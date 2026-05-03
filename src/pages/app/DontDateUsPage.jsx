import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/mockUsers';
import {
  X, Users, Check, ArrowLeft, Send, ChevronRight, ChevronDown, ChevronUp,
  Search, MapPin, Briefcase, Sparkles, MessageCircle,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   Don'tDateUs colour system — mirrors DateUs but in teal/slate
─────────────────────────────────────────────────────────── */
const T   = '#0d9488';   // teal-600
const T_LT = '#5eead4';  // teal-300
const T_DK = '#0f766e';  // teal-700
const T_GRAD = 'linear-gradient(135deg, #0d9488, #0891b2)';
const BG   = '#0a1214';  // midnight teal-black
const SURF = '#111c1e';  // warm dark surface

/* ─────────────────────────────────────────────────────────
   FRIEND LANGUAGES
   Mirrors love languages but for platonic connection
─────────────────────────────────────────────────────────── */
export const FRIEND_LANGUAGES = [
  {
    id: 'convos',
    name: 'Deep Conversations',
    shortName: 'Deep Talks',
    emoji: '💬',
    color: '#0d9488',
    colorLight: '#5eead4',
    desc: 'I connect through conversation — the kind that goes somewhere real. Give me a long walk and a topic that matters.',
    giveDesc: 'I show up for people through words. I ask the questions nobody else asks, and I actually listen.',
  },
  {
    id: 'adventures',
    name: 'Shared Adventures',
    shortName: 'Adventures',
    emoji: '🧭',
    color: '#0891b2',
    colorLight: '#7dd3fc',
    desc: "I bond through doing things together. A road trip, a new restaurant, a spontaneous plan — that's where friendship lives for me.",
    giveDesc: "I invite people into experiences. I'm the one planning the trip, suggesting the thing, making it happen.",
  },
  {
    id: 'presence',
    name: 'Showing Up',
    shortName: 'Presence',
    emoji: '🤝',
    color: '#7c3aed',
    colorLight: '#c4b5fd',
    desc: 'I value a friend who just shows up — for the big moments and the boring ones. Consistency means everything to me.',
    giveDesc: "I'm reliable. I remember what matters. When you need someone there, I'm there.",
  },
  {
    id: 'gestures',
    name: 'Thoughtful Gestures',
    shortName: 'Gestures',
    emoji: '🎁',
    color: '#b45309',
    colorLight: '#fcd34d',
    desc: "I feel closest to friends who notice the small things — a link they thought of me for, a meme that's perfectly me.",
    giveDesc: 'I show friendship through small, specific acts. I remember what you said three months ago and bring it up.',
  },
  {
    id: 'hangouts',
    name: 'Casual Hangouts',
    shortName: 'Hangouts',
    emoji: '☕',
    color: '#059669',
    colorLight: '#6ee7b7',
    desc: "I don't need a plan or a reason — just company. Low pressure, good vibes, comfortable silence.",
    giveDesc: "I'm the friend you can do nothing with. My couch, your couch — it doesn't matter.",
  },
];

/* Map user interests/likes to a likely friend language */
function guessFriendLang(user) {
  const pool = [...(user.interests || []), ...(user.likes || [])].join(' ').toLowerCase();
  if (/(music|concert|vinyl|jazz|festival)/i.test(pool)) return 'adventures';
  if (/(cook|food|restaurant|coffee|wine)/i.test(pool)) return 'hangouts';
  if (/(travel|road|hike|outdoor|nature)/i.test(pool)) return 'adventures';
  if (/(read|book|film|museum|art|gallery)/i.test(pool)) return 'convos';
  if (/(yoga|meditat|fitness)/i.test(pool)) return 'presence';
  if (/(gift|gesture|thoughtful)/i.test(pool)) return 'gestures';
  return 'convos'; // default
}

const FL_BY_ID = Object.fromEntries(FRIEND_LANGUAGES.map(f => [f.id, f]));

/* ── All interests for the single search-term picker ── */
const ALL_INTERESTS = [
  'Travel', 'Cooking', 'Yoga', 'Art', 'Music', 'Hiking', 'Film', 'Reading',
  'Coffee', 'Fitness', 'Photography', 'Dancing', 'Gaming', 'Foodie', 'Meditation',
  'Fashion', 'Tech', 'Concerts', 'Museums', 'Nature', 'Dogs', 'Cats', 'Wine',
  'Road trips', 'Vinyl records', 'Jazz', 'Deep conversations', 'Live music',
  'Lazy Sundays', 'Gallery hopping', 'Whiskey', 'Rooftop sunsets',
];

/* ── shared tags between two users ── */
function getSharedTags(a, b) {
  const bPool = [...(b.interests || []), ...(b.likes || [])].map(x => x.toLowerCase());
  const aPool = [...(a.interests || []), ...(a.likes || [])];
  return aPool.filter(x => bPool.includes(x.toLowerCase()));
}

/* ─────────────────────────────────────────────────────────
   FRIEND LANGUAGE BADGE
─────────────────────────────────────────────────────────── */
function FLBadge({ id, size = 'sm' }) {
  const fl = FL_BY_ID[id];
  if (!fl) return null;
  const pad = size === 'lg' ? '6px 14px' : '4px 10px';
  const fs  = size === 'lg' ? 12.5 : 11;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 999,
      padding: pad, fontSize: fs, fontWeight: 500,
      background: `${fl.color}18`, border: `1px solid ${fl.color}40`, color: fl.colorLight,
    }}>
      <span style={{ fontSize: fs + 1 }}>{fl.emoji}</span> {fl.shortName}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   SINGLE INTEREST PICKER (modal sheet)
─────────────────────────────────────────────────────────── */
function InterestPicker({ current, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const filtered = ALL_INTERESTS.filter(i =>
    !query || i.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(10,18,20,0.82)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', maxHeight: '78dvh', background: SURF, borderRadius: '22px 22px 0 0', display: 'flex', flexDirection: 'column', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, margin: '14px auto 0' }} />
        <div style={{ padding: '16px 18px 12px' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4, color: '#f5f0e8' }}>Choose your search term</div>
          <div style={{ color: 'rgba(245,240,232,0.38)', fontSize: 12.5, marginBottom: 12 }}>Pick <b style={{ color: T_LT }}>one interest</b> — Don'tDateUs finds people who share it.</div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Type to search…"
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '9px 12px 9px 34px', color: '#f5f0e8', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          </div>
        </div>
        {/* List */}
        <div style={{ overflowY: 'auto', padding: '0 18px', display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 16 }}>
          {/* Clear option */}
          {current && (
            <button onClick={() => { onSelect(null); onClose(); }} style={{ borderRadius: 999, padding: '7px 16px', fontSize: 13, cursor: 'pointer', border: '1px dashed rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(245,240,232,0.35)', fontFamily: 'inherit' }}>
              ✕ Clear filter
            </button>
          )}
          {filtered.map(i => {
            const active = current === i;
            return (
              <button key={i} onClick={() => { onSelect(i); onClose(); }} style={{
                borderRadius: 999, padding: '7px 16px', fontSize: 13, cursor: 'pointer', fontWeight: active ? 600 : 400,
                border: active ? `1.5px solid ${T}` : '1px solid rgba(255,255,255,0.09)',
                background: active ? `${T}18` : 'rgba(255,255,255,0.04)',
                color: active ? T_LT : 'rgba(245,240,232,0.58)',
                display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}>
                {active && <Check size={11} strokeWidth={3} color={T_LT} />}
                {i}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   GRID CARD — mirrors DateUs grid but no photo-only modes
─────────────────────────────────────────────────────────── */
function FriendGridCard({ profile, currentUser, onView, onConnect, connected, outOfSwipes }) {
  const fl   = FL_BY_ID[guessFriendLang(profile)];
  const tags = currentUser ? getSharedTags(currentUser, profile) : [];

  return (
    <div onClick={() => onView(profile)} style={{
      background: SURF, borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
      border: '1px solid rgba(255,255,255,0.06)',
      transition: 'box-shadow 0.2s, border-color 0.2s',
    }}>
      {/* Photo — standard aspect, not face-crop or body-crop */}
      <div style={{ position: 'relative', aspectRatio: '4/5', background: '#0d0a14', overflow: 'hidden' }}>
        <img src={profile.photos?.[0]} alt={profile.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,18,20,0.92) 0%, rgba(10,18,20,0.15) 45%, transparent 70%)' }} />

        {/* Friend language chip — top-left */}
        {fl && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: `${fl.color}28`, border: `1px solid ${fl.color}55`,
            backdropFilter: 'blur(8px)', borderRadius: 999, padding: '3px 9px',
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: fl.colorLight, fontWeight: 600,
          }}>
            {fl.emoji} {fl.shortName}
          </div>
        )}

        {/* Shared count badge — top-right */}
        {tags.length > 0 && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: `${T}28`, border: `1px solid ${T}55`,
            backdropFilter: 'blur(8px)', borderRadius: 999, padding: '3px 9px',
            fontSize: 10.5, color: T_LT, fontWeight: 700,
          }}>
            {tags.length} shared
          </div>
        )}

        {/* Name / meta — bottom overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 12px 12px' }}>
          <div className="font-serif" style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2, marginBottom: 2 }}>
            {profile.name.split(' ')[0]}, {profile.age}
          </div>
          <div style={{ color: 'rgba(245,240,232,0.45)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Briefcase size={9} /> {profile.occupation}
          </div>
        </div>
      </div>

      {/* Connect strip */}
      <div style={{ padding: '10px 12px', display: 'flex', gap: 7 }}>
        <button onClick={e => { e.stopPropagation(); if (!outOfSwipes) onConnect(profile); }}
          disabled={outOfSwipes}
          style={{
            flex: 1, padding: '9px', borderRadius: 11, border: 'none', cursor: outOfSwipes ? 'default' : 'pointer',
            background: connected ? `${T}22` : T_GRAD,
            color: connected ? T_LT : 'white',
            fontSize: 12, fontWeight: 600, opacity: outOfSwipes ? 0.4 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            boxShadow: connected ? 'none' : `0 3px 12px ${T}55`,
            fontFamily: 'inherit',
          }}>
          <Users size={13} />
          {connected ? 'Connected' : 'Connect'}
        </button>
        <button onClick={e => { e.stopPropagation(); onView(profile); }}
          style={{ padding: '9px 11px', borderRadius: 11, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(245,240,232,0.45)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PROFILE SHEET — mirrors DateUs ProfileModal feel
─────────────────────────────────────────────────────────── */
function FriendProfileSheet({ profile, currentUser, connected, onConnect, onClose, outOfSwipes, onMessage }) {
  const [photo, setPhoto] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const fl    = FL_BY_ID[guessFriendLang(profile)];
  const tags  = currentUser ? getSharedTags(currentUser, profile) : [];
  const photos = profile.photos || [];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(10,18,20,0.88)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', maxHeight: '90dvh', background: BG, borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, margin: '12px auto 0', flexShrink: 0 }} />

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Photo */}
          <div style={{ position: 'relative', aspectRatio: '4/3', background: '#070d0f' }}>
            <img src={photos[photo]} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,18,20,1) 0%, transparent 60%)' }} />

            {/* Close */}
            <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <X size={16} />
            </button>

            {/* Don'tDateUs badge */}
            <div style={{ position: 'absolute', top: 14, left: 14, background: T_GRAD, borderRadius: 999, padding: '4px 12px', fontSize: 10, fontWeight: 700, color: 'white', letterSpacing: '0.06em' }}>
              Don'tDateUs
            </div>

            {/* Photo dots */}
            {photos.length > 1 && (
              <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
                {photos.map((_, i) => (
                  <div key={i} onClick={() => setPhoto(i)} style={{ width: i === photo ? 18 : 5, height: 5, borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s', background: i === photo ? T_LT : 'rgba(255,255,255,0.3)' }} />
                ))}
              </div>
            )}
            {/* Photo click zones */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '40%', height: '100%', cursor: 'pointer' }} onClick={() => setPhoto(i => Math.max(0, i - 1))} />
            <div style={{ position: 'absolute', right: 0, top: 0, width: '40%', height: '100%', cursor: 'pointer' }} onClick={() => setPhoto(i => Math.min(photos.length - 1, i + 1))} />

            {/* Name overlay */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 18px 18px' }}>
              <h2 className="font-serif" style={{ fontSize: 'clamp(1.3rem,5vw,1.7rem)', fontWeight: 700, marginBottom: 4 }}>
                {profile.name}, {profile.age}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(245,240,232,0.5)', fontSize: 12 }}>
                {profile.distance && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} />{profile.distance}</span>}
                {profile.occupation && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Briefcase size={10} />{profile.occupation}</span>}
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '18px 18px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Friend language */}
            {fl && (
              <div style={{ borderRadius: 16, padding: '16px 18px', background: `${fl.color}0d`, border: `1px solid ${fl.color}30` }}>
                <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8 }}>Friend Language</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${fl.color}22`, border: `1px solid ${fl.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{fl.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: fl.colorLight }}>{fl.name}</div>
                </div>
                <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>{fl.desc}</p>
              </div>
            )}

            {/* Shared interests */}
            {tags.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: T_LT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  {tags.length} thing{tags.length !== 1 ? 's' : ''} you share
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {tags.map(t => (
                    <span key={t} style={{ background: `${T}14`, border: `1px solid ${T}33`, color: T_LT, borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            <div>
              <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8 }}>About</div>
              <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: 13.5, lineHeight: 1.75, margin: 0, display: '-webkit-box', WebkitLineClamp: expanded ? 99 : 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {profile.bio}
              </p>
              {profile.bio?.length > 200 && (
                <button onClick={() => setExpanded(v => !v)} style={{ background: 'none', border: 'none', color: T_LT, fontSize: 12, cursor: 'pointer', padding: '4px 0', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  {expanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Read more</>}
                </button>
              )}
            </div>

            {/* Interests */}
            {profile.interests?.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8 }}>Into</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {profile.interests.map(i => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(245,240,232,0.6)', borderRadius: 999, padding: '5px 12px', fontSize: 12 }}>{i}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA bar */}
        <div style={{ padding: '12px 18px', paddingBottom: 'max(12px, env(safe-area-inset-bottom))', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10, flexShrink: 0, background: BG }}>
          <button onClick={onClose} style={{ flex: '0 0 auto', padding: '13px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.09)', background: 'transparent', color: 'rgba(245,240,232,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Maybe not
          </button>
          {connected ? (
            <button onClick={() => { onClose(); onMessage(); }} style={{ flex: 1, padding: '13px', borderRadius: 14, border: 'none', background: T_GRAD, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: `0 4px 18px ${T}55` }}>
              <MessageCircle size={16} /> Message {profile.name.split(' ')[0]}
            </button>
          ) : (
            <button onClick={() => { if (!outOfSwipes) { onConnect(profile); onClose(); } }} disabled={outOfSwipes}
              style={{ flex: 1, padding: '13px', borderRadius: 14, border: 'none', background: outOfSwipes ? 'rgba(255,255,255,0.06)' : T_GRAD, color: outOfSwipes ? 'rgba(245,240,232,0.25)' : 'white', fontSize: 14, fontWeight: 600, cursor: outOfSwipes ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: outOfSwipes ? 'none' : `0 4px 18px ${T}55` }}>
              <Users size={16} /> Connect with {profile.name.split(' ')[0]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CONNECTIONS LIST
─────────────────────────────────────────────────────────── */
function ConnectionsList({ connections, messages, onChat }) {
  if (!connections.length) return (
    <div style={{ textAlign: 'center', padding: '56px 28px' }}>
      <div style={{ fontSize: 40, marginBottom: 14, opacity: 0.6 }}>🤝</div>
      <h3 className="font-serif" style={{ fontSize: '1.05rem', marginBottom: 8 }}>No connections yet</h3>
      <p style={{ color: 'rgba(245,240,232,0.38)', fontSize: 13, lineHeight: 1.7 }}>
        Connect with people in the Discover tab.<br />When they connect back, you'll find them here.
      </p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 0' }}>
      {connections.map(p => {
        const last = (messages[p.id] || []).at(-1);
        const unread = (messages[p.id] || []).filter(m => m.from !== 'me').length;
        const fl = FL_BY_ID[guessFriendLang(p)];
        return (
          <button key={p.id} onClick={() => onChat(p)} style={{ width: '100%', textAlign: 'left', padding: '13px 16px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src={p.photos?.[0]} alt={p.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 10%', border: `2px solid ${T}` }} />
              {unread > 0 && <div style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: T_GRAD, color: 'white', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</div>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name.split(' ')[0]}</span>
                {fl && <span style={{ fontSize: 12 }}>{fl.emoji}</span>}
              </div>
              <div style={{ color: 'rgba(245,240,232,0.35)', fontSize: 12, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {last ? (last.from === 'me' ? `You: ${last.text}` : last.text) : 'Say hi 👋'}
              </div>
            </div>
            <ChevronRight size={13} color="rgba(245,240,232,0.2)" />
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NDU CHAT
─────────────────────────────────────────────────────────── */
function NduChat({ conn, messages, onSend, onBack }) {
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const msgs = messages[conn.id] || [];
  const fl = FL_BY_ID[guessFriendLang(conn)];

  const send = () => {
    if (!text.trim()) return;
    onSend(conn.id, text.trim());
    setText('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: BG }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, background: 'rgba(10,18,20,0.95)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T_LT, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontFamily: 'inherit' }}>
          <ArrowLeft size={15} />
        </button>
        <img src={conn.photos?.[0]} alt={conn.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 10%', border: `2px solid ${T}` }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{conn.name.split(' ')[0]}</div>
          <div style={{ fontSize: 11, color: T_LT, display: 'flex', alignItems: 'center', gap: 4 }}>
            {fl && <>{fl.emoji} {fl.shortName} · </>}Don'tDateUs friend
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 48 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{fl?.emoji || '👋'}</div>
            <div style={{ color: 'rgba(245,240,232,0.42)', fontSize: 13, lineHeight: 1.7 }}>
              Say hello to {conn.name.split(' ')[0]}!<br />
              <span style={{ fontSize: 11, opacity: 0.6 }}>A platonic connection on Don'tDateUs.</span>
            </div>
          </div>
        )}
        {msgs.map(m => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '72%', padding: '10px 14px', borderRadius: m.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.from === 'me' ? T_GRAD : 'rgba(255,255,255,0.08)', color: 'white', fontSize: 14, lineHeight: 1.55 }}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 14px', paddingBottom: 'max(10px, env(safe-area-inset-bottom))', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 9, alignItems: 'center', flexShrink: 0, background: 'rgba(10,18,20,0.95)' }}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Send a message…"
          style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: '10px 16px', color: '#f5f0e8', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
        <button onClick={send} disabled={!text.trim()} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: text.trim() ? T_GRAD : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: text.trim() ? 'pointer' : 'default', boxShadow: text.trim() ? `0 2px 10px ${T}55` : 'none' }}>
          <Send size={15} color={text.trim() ? 'white' : 'rgba(255,255,255,0.25)'} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
─────────────────────────────────────────────────────────── */
export default function DontDateUsPage() {
  const {
    currentUser, nduConnections, nduLiked, nduMessages,
    nduSwipesLeft, nduLikeProfile, nduPassProfile, nduSendMessage, nduInterests, updateNduInterests,
  } = useApp();

  const [tab, setTab]                   = useState('discover');
  const [viewingProfile, setViewingProfile] = useState(null);
  const [activeChat, setActiveChat]     = useState(null);
  const [showPicker, setShowPicker]     = useState(false);
  const [toast, setToast]               = useState(null);

  /* Single interest search term — take first from nduInterests */
  const searchTerm = nduInterests?.[0] || null;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const outOfSwipes = nduSwipesLeft <= 0;

  /* Pool: exclude seen profiles, optionally filter by 1 term */
  const seenIds = new Set([...(nduLiked || [])]);
  if (currentUser?.id) seenIds.add(currentUser.id);

  const pool = MOCK_USERS.filter(u => {
    if (seenIds.has(u.id)) return false;
    if (!searchTerm) return true;
    const tags = [...(u.interests || []), ...(u.likes || [])].map(x => x.toLowerCase());
    return tags.includes(searchTerm.toLowerCase());
  });

  const connectedProfiles = MOCK_USERS.filter(u => nduConnections.includes(u.id));

  const handleConnect = (profile) => {
    const connected = nduLikeProfile(profile.id);
    if (connected) showToast(`🤝 ${profile.name.split(' ')[0]} connected back!`);
  };

  /* Chat view */
  if (activeChat) {
    return (
      <div style={{ height: '100%', background: BG }}>
        <NduChat conn={activeChat} messages={nduMessages} onSend={nduSendMessage} onBack={() => setActiveChat(null)} />
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, overflow: 'hidden' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: T_GRAD, color: 'white', padding: '10px 20px', borderRadius: 999, fontWeight: 600, fontSize: 13, boxShadow: `0 4px 18px ${T}55`, animation: 'fadeInUp 0.3s ease', whiteSpace: 'nowrap' }}>{toast}</div>
      )}

      {/* Profile sheet */}
      {viewingProfile && (
        <FriendProfileSheet
          profile={viewingProfile}
          currentUser={currentUser}
          connected={nduConnections.includes(viewingProfile.id)}
          onConnect={handleConnect}
          onClose={() => setViewingProfile(null)}
          outOfSwipes={outOfSwipes}
          onMessage={() => {
            const p = MOCK_USERS.find(u => u.id === viewingProfile.id);
            if (p) setActiveChat(p);
          }}
        />
      )}

      {/* Interest picker */}
      {showPicker && (
        <InterestPicker current={searchTerm} onSelect={v => updateNduInterests(v ? [v] : [])} onClose={() => setShowPicker(false)} />
      )}

      {/* ── Header ── */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>

        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* NDU logo mark */}
            <div style={{ width: 36, height: 36, borderRadius: 12, background: T_GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 12px ${T}55` }}>
              <Users size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', background: T_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.01em' }}>Don'tDateUs</div>
              <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.32)', marginTop: -1, letterSpacing: '0.02em' }}>Platonic connections</div>
            </div>
          </div>

          {/* Swipe quota */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 700, background: outOfSwipes ? 'rgba(255,255,255,0.06)' : `${T}18`, border: `1px solid ${outOfSwipes ? 'rgba(255,255,255,0.08)' : T + '45'}`, color: outOfSwipes ? 'rgba(245,240,232,0.3)' : T_LT }}>
              {nduSwipesLeft}/10 swipes
            </div>
          </div>
        </div>

        {/* Search-term strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.04)', border: `1px solid ${searchTerm ? T + '45' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '9px 14px', cursor: 'pointer' }}
            onClick={() => setShowPicker(true)}>
            <Search size={13} color={searchTerm ? T_LT : 'rgba(245,240,232,0.3)'} />
            {searchTerm
              ? <span style={{ fontSize: 13, fontWeight: 600, color: T_LT }}>{searchTerm}</span>
              : <span style={{ fontSize: 13, color: 'rgba(245,240,232,0.3)' }}>Search by interest…</span>
            }
            {searchTerm && <button onClick={e => { e.stopPropagation(); updateNduInterests([]); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,240,232,0.3)', display: 'flex', alignItems: 'center', lineHeight: 1 }}><X size={12} /></button>}
          </div>
        </div>

        {/* Tabs — mirrors DateUs tab style */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 11, padding: 3, marginBottom: 14 }}>
          {[
            { id: 'discover', label: 'Discover', icon: Sparkles },
            { id: 'connections', label: `Friends${connectedProfiles.length > 0 ? ` (${connectedProfiles.length})` : ''}`, icon: Users },
          ].map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '9px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', background: active ? T_GRAD : 'transparent', color: active ? 'white' : 'rgba(245,240,232,0.38)', fontWeight: active ? 700 : 400, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.18s', fontFamily: 'inherit', boxShadow: active ? `0 2px 10px ${T}44` : 'none' }}>
                <Icon size={13} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px 28px' }}>

        {/* ── FRIEND LANGUAGES reference strip ── */}
        {tab === 'discover' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.28)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8 }}>Friend Languages</div>
            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
              {FRIEND_LANGUAGES.map(fl => (
                <div key={fl.id} style={{ flexShrink: 0, borderRadius: 999, padding: '5px 12px', background: `${fl.color}12`, border: `1px solid ${fl.color}30`, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: fl.colorLight, fontWeight: 500 }}>
                  {fl.emoji} {fl.shortName}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'discover' && (
          <>
            {outOfSwipes && (
              <div style={{ borderRadius: 12, padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>⏳</span>
                <span style={{ fontSize: 13, color: 'rgba(245,240,232,0.42)' }}>Daily swipes used — resets at midnight</span>
              </div>
            )}

            {pool.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '52px 24px' }}>
                <div style={{ fontSize: 40, marginBottom: 14, opacity: 0.6 }}>{searchTerm ? '🔍' : '✨'}</div>
                <h3 className="font-serif" style={{ fontSize: '1.05rem', marginBottom: 8 }}>
                  {searchTerm ? `No one with "${searchTerm}" yet` : "You've seen everyone"}
                </h3>
                <p style={{ color: 'rgba(245,240,232,0.38)', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                  {searchTerm ? 'Try a different interest.' : 'Check back soon.'}
                </p>
                {searchTerm && (
                  <button onClick={() => setShowPicker(true)} style={{ background: T_GRAD, border: 'none', color: 'white', borderRadius: 12, padding: '11px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Change search term
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(152px, 1fr))', gap: 10 }}>
                {pool.map(u => (
                  <FriendGridCard
                    key={u.id}
                    profile={u}
                    currentUser={currentUser}
                    onView={setViewingProfile}
                    onConnect={handleConnect}
                    connected={nduConnections.includes(u.id)}
                    outOfSwipes={outOfSwipes}
                  />
                ))}
              </div>
            )}

            {/* How it works */}
            {pool.length > 0 && (
              <div style={{ borderRadius: 16, padding: '16px 18px', marginTop: 20, background: `${T}08`, border: `1px solid ${T}20` }}>
                <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: T_LT }}>How Don'tDateUs works</div>
                {[
                  ['🔍', 'Pick one interest — your search term'],
                  ['🤝', 'Connect with people who share it'],
                  ['💬', 'When they connect back, you can message'],
                  ['✨', '10 free swipes per day, all plans'],
                ].map(([icon, text]) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 8, fontSize: 12.5, color: 'rgba(245,240,232,0.52)', lineHeight: 1.6 }}>
                    <span style={{ flexShrink: 0 }}>{icon}</span>{text}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'connections' && (
          <ConnectionsList connections={connectedProfiles} messages={nduMessages} onChat={setActiveChat} />
        )}
      </div>
    </div>
  );
}
