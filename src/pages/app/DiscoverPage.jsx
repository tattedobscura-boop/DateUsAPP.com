import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/mockUsers';
import { LOVE_LANGUAGES, getLoveLang } from '../../data/loveLangauges';
import { getFullCompatibility, compatLabel, scanAndRank } from '../../data/compatibility';
import LLIcon, { LL_COLORS } from '../../components/LLIcon';
import CompatibilityRing from '../../components/CompatibilityRing';
import { Heart, X, Star, MapPin, Briefcase, Filter, Zap, Scan, Crown, LayoutGrid, User, Sparkles, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

/* ─── Brand colours ── */
const ROSE    = '#c9815a';
const ROSE_LT = '#e8b89a';
const DEEP    = '#9b4468';

/* ── Double-tap hook ── */
function useDoubleTap(onDoubleTap, delay = 280) {
  const lastTap = useRef(0);
  return (e) => {
    const now = Date.now();
    if (now - lastTap.current < delay) { e.preventDefault(); onDoubleTap(); }
    lastTap.current = now;
  };
}

const FILTER_OPTIONS = [
  { label: 'All', id: null },
  ...LOVE_LANGUAGES.map(ll => ({ label: ll.shortName, id: ll.id })),
];

export default function DiscoverPage() {
  const { currentUser, likeProfile, passProfile, isPassedRecently, setViewingProfile, likedProfiles, swipesLeft, blockedUsers, userPlan, likesLeft, likeBudget } = useApp();
  const [filterReceive, setFilterReceive] = useState(null);
  const [dismissed, setDismissed] = useState([]);
  const [showMatch, setShowMatch] = useState(null);
  const [viewMode, setViewMode] = useState('feed');
  const [smartScanActive, setSmartScanActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const available = MOCK_USERS.filter(u => {
    if (dismissed.includes(u.id)) return false;
    if (blockedUsers?.includes(u.id)) return false;
    if (isPassedRecently(u.id)) return false;
    if (filterReceive && u.receive !== filterReceive) return false;
    return true;
  });

  const runSmartScan = () => {
    if (!currentUser) return;
    setScanning(true); setScanResults(null);
    setTimeout(() => {
      const ranked = scanAndRank(currentUser, MOCK_USERS.filter(u => !blockedUsers?.includes(u.id)));
      setScanResults(ranked); setSmartScanActive(true); setScanning(false);
    }, 1600);
  };

  const displayList = smartScanActive && scanResults
    ? scanResults.filter(u => !dismissed.includes(u.id))
    : available;

  const outOfSwipes = !currentUser?.premium && swipesLeft <= 0;

  const doLike = (u) => {
    if (!u || outOfSwipes) return;
    const isMatch = likeProfile(u.id);
    if (isMatch) { setShowMatch(u.name.split(' ')[0]); setTimeout(() => setShowMatch(null), 3200); }
    setDismissed(d => [...d, u.id]);
  };

  const doPass = (u) => {
    if (!u || outOfSwipes) return;
    passProfile(u.id);
    setDismissed(d => [...d, u.id]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#120e1c' }}>

      {/* ── Match moment ── */}
      {showMatch && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(18,14,28,0.82)', backdropFilter: 'blur(16px)', pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', animation: 'slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            {/* Rings */}
            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 20px' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ position: 'absolute', inset: `${i * 14}px`, borderRadius: '50%', border: `1.5px solid rgba(201,129,90,${0.35 - i * 0.1})`, animation: `shimmer 2s ease ${i * 0.2}s infinite` }} />
              ))}
              <div style={{ position: 'absolute', inset: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #c9815a, #9b4468)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                💫
              </div>
            </div>
            <div className="font-serif" style={{ fontSize: 'clamp(1.6rem,6vw,2.4rem)', fontWeight: 700, background: 'linear-gradient(135deg, #e8b89a, #c9815a, #9b4468)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
              A connection
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f5f0e8', marginBottom: 6 }}>{showMatch}</div>
            <div style={{ color: 'rgba(245,240,232,0.45)', fontSize: 13 }}>felt the same way</div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">Discover</h1>
            {/* Plan/swipe pill */}
            {userPlan?.id === 'echelon' ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 999, padding: '4px 11px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.28)' }}>
                <Crown size={11} color="#c4b5fd" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#c4b5fd' }}>{likeBudget === Infinity ? '∞' : likesLeft} likes</span>
              </div>
            ) : userPlan?.id === 'gold' ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 999, padding: '4px 11px', background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.22)' }}>
                <Star size={11} color="#f0d080" fill="#f0d080" />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#f0d080' }}>Unlimited</span>
              </div>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 999, padding: '4px 11px', background: outOfSwipes ? 'rgba(212,168,67,0.1)' : 'rgba(201,129,90,0.1)', border: `1px solid ${outOfSwipes ? 'rgba(212,168,67,0.25)' : 'rgba(201,129,90,0.22)'}` }}>
                <Zap size={11} color={outOfSwipes ? '#f0d080' : ROSE_LT} fill={outOfSwipes ? '#f0d080' : ROSE_LT} />
                <span style={{ fontSize: 11, fontWeight: 600, color: outOfSwipes ? '#f0d080' : ROSE_LT }}>
                  {outOfSwipes ? 'No swipes left' : `${swipesLeft} today`}
                </span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {/* Smart Scan */}
            {!smartScanActive ? (
              <button onClick={runSmartScan} disabled={scanning} style={{
                display: 'flex', alignItems: 'center', gap: 5, borderRadius: 999, padding: '6px 13px',
                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
                color: '#c4b5fd', fontSize: 11, fontWeight: 600, cursor: scanning ? 'default' : 'pointer', opacity: scanning ? 0.5 : 1,
              }}>
                {scanning
                  ? <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid rgba(139,92,246,0.3)', borderTopColor: '#8b5cf6', animation: 'spin 0.7s linear infinite' }} />
                  : <Scan size={11} />}
                {scanning ? 'Scanning…' : 'Smart Scan'}
              </button>
            ) : (
              <button onClick={() => { setSmartScanActive(false); setScanResults(null); }} style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 999, padding: '6px 13px', background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                <Scan size={11} /> Ranked · Clear
              </button>
            )}
            {/* Filter toggle */}
            <button onClick={() => setShowFilters(f => !f)} style={{
              width: 32, height: 32, borderRadius: 9, border: `1px solid ${showFilters ? `rgba(201,129,90,0.4)` : 'rgba(255,245,235,0.1)'}`,
              background: showFilters ? 'rgba(201,129,90,0.1)' : 'rgba(255,245,235,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: showFilters ? ROSE_LT : 'rgba(245,240,232,0.4)',
            }}>
              <Filter size={13} />
            </button>
            {/* View mode */}
            <div style={{ display: 'flex', gap: 1, background: 'rgba(255,245,235,0.05)', borderRadius: 9, padding: 2 }}>
              {[
                { id: 'feed',  icon: '≡', title: 'Feed' },
                { id: 'grid',  icon: '⊞', title: 'Grid' },
                { id: 'faces', icon: '◉', title: 'Faces' },
                { id: 'body',  icon: '▬', title: 'Body' },
              ].map(m => (
                <button key={m.id} onClick={() => setViewMode(m.id)} title={m.title} style={{
                  padding: '4px 8px', borderRadius: 7, fontSize: 12, cursor: 'pointer', border: 'none',
                  background: viewMode === m.id ? `rgba(201,129,90,0.2)` : 'transparent',
                  color: viewMode === m.id ? ROSE_LT : 'rgba(245,240,232,0.3)',
                  fontWeight: viewMode === m.id ? 700 : 400, transition: 'all 0.15s',
                }}>{m.icon}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter row */}
        {showFilters && (
          <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none', animation: 'fadeInDown 0.2s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, color: 'rgba(245,240,232,0.3)', fontSize: 11 }}>
              <Filter size={11} /> Receives:
            </div>
            {FILTER_OPTIONS.map(f => {
              const active = filterReceive === f.id;
              const c = f.id ? LL_COLORS[f.id] : null;
              return (
                <button key={f.label} onClick={() => setFilterReceive(f.id)} style={{
                  flexShrink: 0, borderRadius: 999, padding: '5px 13px', fontSize: 12, fontWeight: 500,
                  border: active ? `1px solid ${c?.color || ROSE}` : '1px solid rgba(255,245,235,0.1)',
                  background: active ? (c ? c.bg : `rgba(201,129,90,0.14)`) : 'transparent',
                  color: active ? (c?.light || ROSE_LT) : 'rgba(245,240,232,0.45)',
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.18s',
                }}>
                  {f.id && <LLIcon id={f.id} size={12} />}
                  {f.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Smart Scan active banner */}
        {smartScanActive && !scanning && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 10, color: '#c4b5fd', fontSize: 12 }}>
            <Sparkles size={12} />
            <span>Ranked by your full compatibility — love language, interests, attraction, personality</span>
          </div>
        )}
      </div>

      {/* Out of swipes */}
      {outOfSwipes && (
        <div style={{ margin: '0 16px 10px', borderRadius: 12, padding: '10px 14px', background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Zap size={13} color="#f0d080" fill="#f0d080" />
            <span style={{ fontSize: 13, color: '#f0d080', fontWeight: 500 }}>Daily swipes used up — resets tomorrow</span>
          </div>
          <button className="btn-gold" style={{ padding: '5px 14px', fontSize: 12, borderRadius: 8 }}>Upgrade</button>
        </div>
      )}

      {/* ── Content ── */}
      <div className={viewMode === 'feed' ? 'discover-feed-scroll' : ''} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {viewMode === 'feed'  && <FeedView users={displayList} currentUser={currentUser} onLike={doLike} onPass={doPass} onView={u => setViewingProfile(u)} likedProfiles={likedProfiles} outOfSwipes={outOfSwipes} smartScanActive={smartScanActive} />}
        {viewMode === 'grid'  && <GridView users={displayList} currentUser={currentUser} onView={u => setViewingProfile(u)} onLike={doLike} likedProfiles={likedProfiles} outOfSwipes={outOfSwipes} smartScanActive={smartScanActive} />}
        {viewMode === 'faces' && <FaceGrid users={displayList} currentUser={currentUser} onView={u => setViewingProfile(u)} likedProfiles={likedProfiles} outOfSwipes={outOfSwipes} onLike={doLike} smartScanActive={smartScanActive} />}
        {viewMode === 'body'  && <BodyGrid users={displayList} currentUser={currentUser} onView={u => setViewingProfile(u)} likedProfiles={likedProfiles} outOfSwipes={outOfSwipes} onLike={doLike} smartScanActive={smartScanActive} />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FEED VIEW — scrollable editorial cards (landscape photo left, info right)
─────────────────────────────────────────────────────────── */
function FeedView({ users, currentUser, onLike, onPass, onView, likedProfiles, outOfSwipes, smartScanActive }) {
  if (!users.length) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 340, textAlign: 'center', padding: '0 32px' }}>
      <div style={{ fontSize: 48, marginBottom: 14, opacity: 0.7 }}>🌿</div>
      <h3 className="font-serif" style={{ fontSize: '1.15rem', marginBottom: 8 }}>You've seen everyone</h3>
      <p style={{ color: 'rgba(245,240,232,0.38)', fontSize: 13 }}>Adjust filters or check back later.</p>
    </div>
  );

  return (
    <div className="feed-cards-wrapper">
      {users.map((u, idx) => (
        <div key={u.id} className="feed-card-snap">
          <FeedCard u={u} idx={idx} currentUser={currentUser} onLike={onLike} onPass={onPass} onView={onView} liked={likedProfiles.includes(u.id)} outOfSwipes={outOfSwipes} smartScanActive={smartScanActive} />
        </div>
      ))}
    </div>
  );
}

function FeedCard({ u, idx, currentUser, onLike, onPass, onView, liked, outOfSwipes, smartScanActive }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const compat = currentUser ? getFullCompatibility(currentUser, u) : null;
  const compatInfo = compat ? compatLabel(compat.overall) : null;
  const receive = getLoveLang(u.receive);
  const give    = getLoveLang(u.give);
  const photos  = u.photos || [];

  return (
    <div className="feed-card animate-fadeInUp" style={{ animationDelay: `${idx * 0.06}s` }}>
      {/* Photo strip — cinematic 16:9-ish landscape */}
      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#0d0a14', overflow: 'hidden' }}>
        <img src={photos[imgIdx] || photos[0]} alt={u.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block', transition: 'opacity 0.25s' }} />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,22,38,1) 0%, rgba(28,22,38,0.3) 40%, transparent 70%)' }} />

        {/* Photo nav dots */}
        {photos.length > 1 && (
          <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
            {photos.map((_, i) => (
              <div key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 20 : 5, height: 5, borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s', background: i === imgIdx ? ROSE_LT : 'rgba(255,255,255,0.3)' }} />
            ))}
          </div>
        )}
        {/* Click zones */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '40%', height: '100%', cursor: photos.length > 1 ? 'pointer' : 'default' }}
          onClick={() => setImgIdx(i => Math.max(0, i - 1))} />
        <div style={{ position: 'absolute', right: 0, top: 0, width: '40%', height: '100%', cursor: photos.length > 1 ? 'pointer' : 'default' }}
          onClick={() => setImgIdx(i => Math.min(photos.length - 1, i + 1))} />

        {/* Badges row */}
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
          {u.verified && <span style={{ background: 'rgba(59,130,246,0.22)', border: '1px solid rgba(59,130,246,0.45)', borderRadius: 999, padding: '3px 9px', fontSize: 10, color: '#93c5fd', fontWeight: 600 }}>✓</span>}
          {smartScanActive && idx < 3 && (
            <span style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white', background: idx === 0 ? ROSE : idx === 1 ? '#d4a843' : '#10b981' }}>
              {idx + 1}
            </span>
          )}
        </div>

        {/* Compat score top-left */}
        {compat && compatInfo && (
          <div style={{ position: 'absolute', top: 12, left: 12, borderRadius: 999, padding: '4px 10px', background: `${compatInfo.color}22`, border: `1px solid ${compatInfo.color}44`, backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: compatInfo.color }}>{compatInfo.emoji} {compat.overall}%</span>
          </div>
        )}

        {/* Name overlaid at bottom of photo */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.15, marginBottom: 3 }}>
                {u.name}, {u.age}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(245,240,232,0.5)', fontSize: 12 }}>
                {u.distance && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} />{u.distance}</span>}
                {u.occupation && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Briefcase size={10} />{u.occupation}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info body */}
      <div style={{ padding: '14px 16px 16px' }}>
        {/* Love language row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {receive && (
            <span className={`ll-badge-${u.receive}`} style={{ borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <LLIcon id={u.receive} size={12} /> {receive.shortName}
            </span>
          )}
          {give && (
            <span className={`ll-badge-${u.give}`} style={{ borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <LLIcon id={u.give} size={12} /> Gives {give.shortName}
            </span>
          )}
          {u.looking && (
            <span style={{ borderRadius: 999, padding: '5px 12px', fontSize: 11, background: 'rgba(255,245,235,0.06)', border: '1px solid rgba(255,245,235,0.1)', color: 'rgba(245,240,232,0.55)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {u.looking}
            </span>
          )}
        </div>

        {/* Bio */}
        <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 13.5, lineHeight: 1.7, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: expanded ? 99 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {u.bio}
        </p>

        {/* Compat breakdown (expandable) */}
        {compat && (
          <button onClick={() => setExpanded(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px', width: '100%' }}>
            <div style={{ flex: 1, height: 3, background: 'rgba(255,245,235,0.07)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${compat.overall}%`, background: `linear-gradient(90deg, ${ROSE}, ${DEEP})`, borderRadius: 2, transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ fontSize: 11, color: compatInfo.color, fontWeight: 700, flexShrink: 0 }}>{compatInfo.label}</span>
            {expanded ? <ChevronUp size={12} color="rgba(245,240,232,0.3)" /> : <ChevronDown size={12} color="rgba(245,240,232,0.3)" />}
          </button>
        )}
        {expanded && compat && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12, animation: 'fadeInUp 0.2s ease' }}>
            {[
              { label: 'Love Lang', score: compat.loveLang, color: ROSE },
              { label: 'Interests', score: compat.interests, color: '#8b5cf6' },
              { label: 'Attraction', score: compat.attraction, color: '#d4a843' },
              { label: 'Personality', score: compat.personality, color: '#10b981' },
            ].map(d => (
              <div key={d.label} style={{ borderRadius: 10, padding: '8px 10px', background: 'rgba(255,245,235,0.04)', border: '1px solid rgba(255,245,235,0.06)' }}>
                <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.38)', marginBottom: 4 }}>{d.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${d.score}%`, background: d.color, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: d.color, flexShrink: 0 }}>{d.score}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => onPass(u)} style={{
            flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(255,245,235,0.1)',
            background: 'rgba(255,245,235,0.04)', color: 'rgba(245,240,232,0.45)', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.18s',
          }}>
            <X size={14} /> Pass
          </button>
          <button onClick={() => onView(u)} style={{
            padding: '11px 16px', borderRadius: 12, border: '1px solid rgba(255,245,235,0.1)',
            background: 'rgba(255,245,235,0.05)', color: 'rgba(245,240,232,0.55)', fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all 0.18s', whiteSpace: 'nowrap',
          }}>
            View <ChevronRight size={13} />
          </button>
          <button onClick={() => !outOfSwipes && onLike(u)} disabled={outOfSwipes} style={{
            flex: 1, padding: '11px', borderRadius: 12, border: 'none',
            background: liked ? 'rgba(201,129,90,0.25)' : `linear-gradient(135deg, ${ROSE}, ${DEEP})`,
            color: 'white', fontSize: 13, fontWeight: 600,
            cursor: outOfSwipes ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            opacity: outOfSwipes ? 0.45 : 1, transition: 'all 0.18s',
            boxShadow: liked ? 'none' : `0 4px 16px rgba(155,68,104,0.35)`,
          }}>
            <Heart size={14} fill={liked ? ROSE_LT : 'white'} color={liked ? ROSE_LT : 'white'} />
            {liked ? 'Liked' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   GRID VIEW
─────────────────────────────────────────────────────────── */
function GridView({ users, currentUser, onView, onLike, likedProfiles, outOfSwipes, smartScanActive }) {
  if (!users.length) return <EmptyState />;
  return (
    <div style={{ padding: 12 }}>
      {smartScanActive && <div style={{ padding: '8px 4px 10px', color: 'rgba(245,240,232,0.38)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Scan size={12} /> Sorted by compatibility</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 10 }}>
        {users.map((u, idx) => {
          const compat = currentUser ? getFullCompatibility(currentUser, u) : null;
          const info   = compat ? compatLabel(compat.overall) : null;
          const liked  = likedProfiles.includes(u.id);
          const receive = getLoveLang(u.receive);
          return (
            <div key={u.id} onClick={() => onView(u)} style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', aspectRatio: '3/4', background: '#0d0a14' }}>
              <img src={u.photos?.[0]} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,14,28,0.9) 0%, transparent 55%)' }} />
              {smartScanActive && idx < 3 && (
                <div style={{ position: 'absolute', top: 9, left: 9, width: 21, height: 21, borderRadius: '50%', background: idx === 0 ? ROSE : idx === 1 ? '#d4a843' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white' }}>{idx + 1}</div>
              )}
              {compat && (
                <div style={{ position: 'absolute', top: 9, right: 9, borderRadius: 999, padding: '3px 8px', fontSize: 10, fontWeight: 700, background: `${info.color}26`, border: `1px solid ${info.color}50`, color: info.color }}>{compat.overall}%</div>
              )}
              {!smartScanActive && (
                <button onClick={e => { e.stopPropagation(); if (!outOfSwipes) onLike(u); }} style={{ position: 'absolute', top: 9, left: 9, width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,245,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: outOfSwipes ? 'default' : 'pointer', opacity: outOfSwipes ? 0.4 : 1 }}>
                  <Heart size={13} fill={liked ? ROSE : 'none'} color={liked ? ROSE : 'white'} />
                </button>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 11px 12px' }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{u.name.split(' ')[0]}, {u.age}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginBottom: 5 }}>{u.distance}</div>
                {receive && <span className={`ll-badge-${u.receive}`} style={{ borderRadius: 999, padding: '3px 9px', fontSize: 10, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}><LLIcon id={u.receive} size={10} />{receive.shortName}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── FACE GRID ── */
function FaceGrid({ users, currentUser, onView, likedProfiles, outOfSwipes, onLike, smartScanActive }) {
  if (!users.length) return <EmptyState />;
  return (
    <div style={{ padding: '10px 10px 20px' }}>
      {smartScanActive && <div style={{ padding: '6px 4px 10px', color: 'rgba(245,240,232,0.38)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Scan size={12} /> Sorted by compatibility</div>}
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(245,240,232,0.28)', fontSize: 11 }}><User size={11} /> Double-tap to open</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
        {users.map((u, idx) => (
          <PhotoTile key={u.id} user={u} currentUser={currentUser} idx={idx} onView={onView} onLike={onLike} liked={likedProfiles.includes(u.id)} outOfSwipes={outOfSwipes} smartScanActive={smartScanActive} aspectRatio="1/1" objectPosition="top center" showNameOverlay={false} />
        ))}
      </div>
    </div>
  );
}

/* ─── BODY GRID ── */
function BodyGrid({ users, currentUser, onView, likedProfiles, outOfSwipes, onLike, smartScanActive }) {
  if (!users.length) return <EmptyState />;
  return (
    <div style={{ padding: '10px 10px 20px' }}>
      {smartScanActive && <div style={{ padding: '6px 4px 10px', color: 'rgba(245,240,232,0.38)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Scan size={12} /> Sorted by compatibility</div>}
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(245,240,232,0.28)', fontSize: 11 }}><LayoutGrid size={11} /> Double-tap to open</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
        {users.map((u, idx) => (
          <PhotoTile key={u.id} user={u} currentUser={currentUser} idx={idx} onView={onView} onLike={onLike} liked={likedProfiles.includes(u.id)} outOfSwipes={outOfSwipes} smartScanActive={smartScanActive} aspectRatio="2/3" objectPosition="center center" showNameOverlay />
        ))}
      </div>
    </div>
  );
}

/* ─── PHOTO TILE ── */
function PhotoTile({ user: u, currentUser, idx, onView, onLike, liked, outOfSwipes, smartScanActive, aspectRatio, objectPosition, showNameOverlay }) {
  const compat = currentUser ? getFullCompatibility(currentUser, u) : null;
  const info   = compat ? compatLabel(compat.overall) : null;
  const handleDoubleTap = useDoubleTap(() => onView(u));

  return (
    <div onClick={handleDoubleTap} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', aspectRatio, background: '#0d0a14' }}>
      <img src={u.photos?.[0]} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,14,28,0.85) 0%, rgba(18,14,28,0.1) 40%, transparent 65%)' }} />
      {smartScanActive && idx < 3 && (
        <div style={{ position: 'absolute', top: 7, left: 7, width: 19, height: 19, borderRadius: '50%', fontSize: 9, fontWeight: 800, color: 'white', background: idx === 0 ? ROSE : idx === 1 ? '#d4a843' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{idx + 1}</div>
      )}
      {compat && info && (
        <div style={{ position: 'absolute', top: 7, right: 7, borderRadius: 7, padding: '2px 6px', fontSize: 10, fontWeight: 700, background: `${info.color}26`, border: `1px solid ${info.color}50`, color: info.color, backdropFilter: 'blur(4px)' }}>{compat.overall}%</div>
      )}
      {idx === 0 && (
        <div style={{ position: 'absolute', top: '38%', left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', opacity: 0, animation: 'fadeHint 3s ease 1.2s forwards' }}>
          <div style={{ borderRadius: 999, padding: '4px 11px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>👆👆 double-tap</div>
        </div>
      )}
      {showNameOverlay && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '9px 10px 11px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{u.name.split(' ')[0]}, {u.age}</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 1 }}>{u.distance}</div>
          </div>
          <button onClick={e => { e.stopPropagation(); onLike(u); }} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', flexShrink: 0, cursor: outOfSwipes ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: liked ? `rgba(201,129,90,0.35)` : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', opacity: outOfSwipes ? 0.4 : 1 }}>
            <Heart size={13} fill={liked ? ROSE_LT : 'none'} color={liked ? ROSE_LT : 'white'} />
          </button>
        </div>
      )}
      {!showNameOverlay && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '5px 7px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{u.name.split(' ')[0]}</span>
          <button onClick={e => { e.stopPropagation(); onLike(u); }} style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', flexShrink: 0, cursor: outOfSwipes ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: liked ? `rgba(201,129,90,0.4)` : 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', opacity: outOfSwipes ? 0.4 : 1 }}>
            <Heart size={11} fill={liked ? ROSE_LT : 'none'} color={liked ? ROSE_LT : 'white'} />
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, textAlign: 'center', padding: '0 32px' }}>
      <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.6 }}>🌿</div>
      <h3 className="font-serif" style={{ fontSize: '1.1rem', marginBottom: 8 }}>You've seen everyone</h3>
      <p style={{ color: 'rgba(245,240,232,0.38)', fontSize: 13 }}>Adjust filters or check back later.</p>
    </div>
  );
}
