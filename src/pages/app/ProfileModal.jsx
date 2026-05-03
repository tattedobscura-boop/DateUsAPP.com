import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getLoveLang } from '../../data/loveLangauges';
import { getFullCompatibility, compatLabel } from '../../data/compatibility';
import LLIcon from '../../components/LLIcon';
import CompatibilityRing from '../../components/CompatibilityRing';
import ReportModal from '../../components/ReportModal';
import {
  X, Heart, MessageCircle, MapPin, Briefcase, GraduationCap,
  Star, Shield, Flag, Ban, MoreHorizontal, Crown, ChevronLeft, ChevronRight,
  Sparkles, Flame, Zap,
} from 'lucide-react';

export default function ProfileModal() {
  const {
    viewingProfile, setViewingProfile, currentUser,
    likeProfile, setActiveChat, setAppTab,
    likedProfiles, matches, blockUser, reportUser,
    canMessageFirst, firstMessages, markFirstMessage,
  } = useApp();

  const [imgIdx, setImgIdx]       = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [showReport, setShowReport]   = useState(false);
  const [showBlock, setShowBlock]     = useState(false);

  if (!viewingProfile) return null;

  const u          = viewingProfile;
  const receive    = getLoveLang(u.receive);
  const give       = getLoveLang(u.give);
  const compat     = currentUser ? getFullCompatibility(currentUser, u) : null;
  const compatInfo = compat ? compatLabel(compat.overall) : null;
  const isMatch       = matches.includes(u.id);
  const hasSentFirst  = !!firstMessages[u.id];
  const canOpenChat   = isMatch || canMessageFirst;
  const liked      = likedProfiles.includes(u.id);
  const photos     = u.photos || [];
  const firstName  = u.name.split(' ')[0];

  const prev  = () => setImgIdx(i => Math.max(0, i - 1));
  const next  = () => setImgIdx(i => Math.min(photos.length - 1, i + 1));
  const close = () => setViewingProfile(null);

  const handleLike    = () => likeProfile(u.id);
  const handleMessage = () => {
    close();
    setActiveChat(u);
    setAppTab('messages');
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={close} style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(5,2,12,0.85)', backdropFilter: 'blur(16px)',
      }} />

      {/* Full-screen panel */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 51,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(0px, 2vw, 24px)',
        pointerEvents: 'none',
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          pointerEvents: 'auto',
          width: '100%', height: '100%',
          maxWidth: 940, maxHeight: '100dvh',
          borderRadius: 'clamp(0px, 2vw, 28px)',
          background: 'linear-gradient(160deg, #18092e 0%, #0d0a14 55%, #100820 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 32px 100px rgba(0,0,0,0.75)',
          /* Two-column on wide screens via inner layout */
        }}>

          {/* ── Top bar ── */}
          <div style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(13,6,22,0.6)', backdropFilter: 'blur(20px)',
          }}>
            {/* Left: user identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <img src={photos[0]} alt={u.name}
                style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)' }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {u.name}, {u.age}
                  {u.verified && <Shield size={12} color="#93c5fd" />}
                  {u.plan === 'echelon' && <Crown size={12} color="#c4b5fd" />}
                  {u.premium && u.plan !== 'echelon' && <Star size={12} color="#f0d080" fill="#f0d080" />}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(240,235,255,0.38)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {u.distance && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={9} />{u.distance}</span>}
                  {u.occupation && <><span style={{ opacity: 0.3 }}>·</span><span>{u.occupation}</span></>}
                </div>
              </div>
            </div>

            {/* Right: actions + close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowActions(v => !v)}
                  style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <MoreHorizontal size={15} color="rgba(255,255,255,0.55)" />
                </button>
                {showActions && (
                  <div style={{ position: 'absolute', top: 40, right: 0, minWidth: 190, borderRadius: 14, overflow: 'hidden', background: 'rgba(22,11,40,0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 48px rgba(0,0,0,0.7)', zIndex: 10 }}>
                    <button onClick={() => { setShowActions(false); setShowReport(true); }}
                      style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', color: '#e8b89a', fontSize: 13, textAlign: 'left' }}>
                      <Flag size={13} /> Report {firstName}
                    </button>
                    <button onClick={() => { setShowActions(false); setShowBlock(true); }}
                      style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', fontSize: 13, textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <Ban size={13} /> Block {firstName}
                    </button>
                  </div>
                )}
              </div>
              <button onClick={close}
                style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={15} color="rgba(255,255,255,0.55)" />
              </button>
            </div>
          </div>

          {/* ── Body: two-column on wide, stacked on narrow ── */}
          <div className="profile-body-row" style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>

            {/* ── LEFT: Photos panel ── */}
            <div className="profile-photo-col" style={{
              flexShrink: 0, position: 'relative', overflow: 'hidden',
              background: '#0a0614',
            }}>
              <img key={imgIdx} src={photos[imgIdx] || photos[0]} alt={u.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

              {/* Tap zones */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                <div style={{ flex: 1, cursor: imgIdx > 0 ? 'w-resize' : 'default' }} onClick={prev} />
                <div style={{ flex: 1, cursor: imgIdx < photos.length - 1 ? 'e-resize' : 'default' }} onClick={next} />
              </div>

              {/* Prev / next arrows */}
              {imgIdx > 0 && (
                <button onClick={prev} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ChevronLeft size={16} color="white" />
                </button>
              )}
              {imgIdx < photos.length - 1 && (
                <button onClick={next} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ChevronRight size={16} color="white" />
                </button>
              )}

              {/* Dot indicators */}
              {photos.length > 1 && (
                <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
                  {photos.map((_, i) => (
                    <div key={i} onClick={() => setImgIdx(i)} style={{
                      height: 3, borderRadius: 2, cursor: 'pointer', transition: 'all 0.22s',
                      width: i === imgIdx ? 22 : 6,
                      background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.4)',
                    }} />
                  ))}
                </div>
              )}

              {/* Photo count badge */}
              {photos.length > 1 && (
                <div style={{ position: 'absolute', top: 12, right: 12, borderRadius: 8, padding: '4px 8px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  {imgIdx + 1} / {photos.length}
                </div>
              )}
            </div>

            {/* ── RIGHT: Scrollable invitation card ── */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0 }}>

              {/* ── Hero identity block ── */}
              <div style={{ padding: '24px 24px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 20 }}>
                {/* Name + compat ring */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                  <div>
                    <h2 className="font-serif" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 4 }}>
                      {u.name}
                      <span style={{ fontWeight: 400, color: 'rgba(240,235,255,0.5)', fontSize: '0.75em', marginLeft: 8 }}>{u.age}</span>
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', color: 'rgba(240,235,255,0.5)', fontSize: 12.5 }}>
                      {u.distance && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{u.distance}</span>}
                      {u.occupation && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={11} />{u.occupation}</span>}
                      {u.education && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GraduationCap size={11} />{u.education}</span>}
                    </div>
                  </div>
                  {compat && compatInfo && (
                    <div style={{ flexShrink: 0 }}>
                      <CompatibilityRing
                        score={compat.overall} color={compatInfo.color} label={compatInfo.label}
                        give1={currentUser?.give} receive1={currentUser?.receive}
                        give2={u.give} receive2={u.receive} size={68}
                      />
                    </div>
                  )}
                </div>

                {/* Membership badges */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {u.verified && <Badge icon={<Shield size={10} />} label="Verified" bg="rgba(59,130,246,0.12)" border="rgba(59,130,246,0.3)" color="#93c5fd" />}
                  {u.plan === 'echelon' && <Badge icon={<Crown size={10} />} label="Echelon" bg="rgba(139,92,246,0.14)" border="rgba(139,92,246,0.38)" color="#c4b5fd" />}
                  {u.premium && u.plan !== 'echelon' && <Badge icon={<Star size={10} fill="#f0d080" />} label="Ardor" bg="rgba(212,168,67,0.12)" border="rgba(212,168,67,0.35)" color="#f0d080" />}
                </div>

                {/* Love language pills */}
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {receive && (
                    <span className={`ll-badge-${u.receive}`} style={{ borderRadius: 999, padding: '6px 13px', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <LLIcon id={u.receive} size={13} /> I need {receive.shortName}
                    </span>
                  )}
                  {give && (
                    <span className={`ll-badge-${u.give}`} style={{ borderRadius: 999, padding: '6px 13px', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <LLIcon id={u.give} size={13} /> I give {give.shortName}
                    </span>
                  )}
                </div>
              </div>

              {/* ── Invitation card body ── */}
              <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>

                {/* Compatibility breakdown */}
                {compat && compatInfo && (
                  <Section>
                    <SectionLabel icon={<Sparkles size={12} />}>Compatibility Report</SectionLabel>
                    <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${compatInfo.color}22`, background: `${compatInfo.color}08` }}>
                      {/* Score header */}
                      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${compatInfo.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ fontSize: 18 }}>{compatInfo.emoji}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: compatInfo.color }}>{compatInfo.label}</div>
                            <div style={{ fontSize: 10, color: 'rgba(240,235,255,0.32)', marginTop: 1 }}>Overall score</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: compatInfo.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{compat.overall}<span style={{ fontSize: 14, fontWeight: 500, opacity: 0.6 }}>%</span></div>
                      </div>
                      {/* Master bar */}
                      <div style={{ padding: '10px 16px 4px' }}>
                        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${compat.overall}%`, background: `linear-gradient(90deg, ${compatInfo.color}, ${compatInfo.color}88)`, borderRadius: 3, transition: 'width 1.1s ease' }} />
                        </div>
                      </div>
                      {/* Dimensions */}
                      <div style={{ padding: '10px 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[
                          { label: 'Love Language', score: compat.loveLang, color: '#c9815a', emoji: '💝', weight: '40%', desc: compat.loveLang >= 80 ? 'Perfect' : compat.loveLang >= 50 ? 'Strong' : 'Complementary' },
                          { label: 'Interests', score: compat.interests, color: '#8b5cf6', emoji: '✨', weight: '25%', desc: compat.interests >= 70 ? 'Lots in common' : compat.interests >= 40 ? 'Some overlap' : 'Different worlds' },
                          { label: 'Attraction', score: compat.attraction, color: '#d4a843', emoji: '🔥', weight: '20%', desc: compat.attraction >= 70 ? 'Mutual pull' : compat.attraction >= 40 ? 'Potential' : 'Needs discovery' },
                          { label: 'Personality', score: compat.personality, color: '#10b981', emoji: '🧠', weight: '15%', desc: compat.personality >= 70 ? 'Very aligned' : compat.personality >= 40 ? 'Good balance' : 'Growth zone' },
                        ].map(d => (
                          <div key={d.label} style={{ borderRadius: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ fontSize: 13 }}>{d.emoji}</span>
                                <span style={{ fontSize: 11, color: 'rgba(240,235,255,0.5)', fontWeight: 500 }}>{d.label}</span>
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.score}%</span>
                            </div>
                            <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
                              <div style={{ height: '100%', width: `${d.score}%`, background: d.color, borderRadius: 2 }} />
                            </div>
                            <div style={{ fontSize: 10, color: d.color, opacity: 0.7 }}>{d.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Section>
                )}

                {/* Bio */}
                {u.bio && (
                  <Section>
                    <SectionLabel icon={<span style={{ fontSize: 12 }}>✦</span>}>In my own words</SectionLabel>
                    <p style={{ color: 'rgba(240,235,255,0.75)', fontSize: 14, lineHeight: 1.85, fontStyle: 'normal' }}>{u.bio}</p>
                  </Section>
                )}

                {/* First date */}
                {u.firstDate && (
                  <Section>
                    <SectionLabel icon={<span style={{ fontSize: 12 }}>💑</span>}>For our first date, I'd…</SectionLabel>
                    <div style={{ borderRadius: 16, padding: '16px 18px', background: 'rgba(201,129,90,0.06)', border: '1px solid rgba(201,129,90,0.18)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: '#c9815a', opacity: 0.06, filter: 'blur(20px)' }} />
                      <p style={{ color: 'rgba(240,235,255,0.85)', fontSize: 14, lineHeight: 1.85, fontStyle: 'italic', position: 'relative', zIndex: 1 }}>"{u.firstDate}"</p>
                    </div>
                  </Section>
                )}

                {/* Love Language deep dive */}
                <Section>
                  <SectionLabel icon={<Heart size={12} />}>How I love</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {receive && (
                      <div className={`ll-badge-${u.receive}`} style={{ borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <LLIcon id={u.receive} size={24} showBg bgSize={42} />
                        <div>
                          <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>I feel loved when…</div>
                          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{receive.name}</div>
                          <div style={{ fontSize: 13, opacity: 0.72, lineHeight: 1.7 }}>{receive.receiveDesc}</div>
                        </div>
                      </div>
                    )}
                    {give && (
                      <div className={`ll-badge-${u.give}`} style={{ borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <LLIcon id={u.give} size={24} showBg bgSize={42} />
                        <div>
                          <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>I show love by…</div>
                          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{give.name}</div>
                          <div style={{ fontSize: 13, opacity: 0.72, lineHeight: 1.7 }}>{give.giveDesc}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Section>

                {/* Attraction profile */}
                {(u.attractions?.vibe?.length > 0 || u.attractions?.dealmakers?.length > 0) && (
                  <Section>
                    <SectionLabel icon={<Flame size={12} />}>I'm attracted to</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {u.attractions?.vibe?.length > 0 && (
                        <div>
                          <div style={{ fontSize: 11, color: 'rgba(240,235,255,0.32)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>The vibe I'm drawn to</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                            {u.attractions.vibe.map(v => (
                              <span key={v} style={{ borderRadius: 999, padding: '6px 14px', fontSize: 12.5, fontWeight: 500, background: 'rgba(201,129,90,0.09)', border: '1px solid rgba(201,129,90,0.22)', color: '#e8b89a' }}>{v}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {u.attractions?.dealmakers?.length > 0 && (
                        <div>
                          <div style={{ fontSize: 11, color: 'rgba(240,235,255,0.32)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>I need someone who is…</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                            {u.attractions.dealmakers.map(d => (
                              <span key={d} style={{ borderRadius: 999, padding: '6px 14px', fontSize: 12.5, fontWeight: 500, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}>✓ {d}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Section>
                )}

                {/* Likes */}
                {u.likes?.length > 0 && (
                  <Section>
                    <SectionLabel icon={<span style={{ fontSize: 12 }}>✦</span>}>I'm into</SectionLabel>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                      {u.likes.map(l => (
                        <span key={l} style={{ borderRadius: 999, padding: '6px 14px', fontSize: 12.5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(240,235,255,0.68)' }}>{l}</span>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Interests */}
                {u.interests?.length > 0 && (
                  <Section>
                    <SectionLabel icon={<Zap size={12} />}>My interests</SectionLabel>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                      {u.interests.map(i => (
                        <span key={i} style={{ borderRadius: 999, padding: '6px 14px', fontSize: 12.5, background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.18)', color: 'rgba(196,181,253,0.82)' }}>{i}</span>
                      ))}
                    </div>
                  </Section>
                )}

                {/* At a glance grid */}
                {[u.height, u.looking, u.zodiac, u.mbti, u.drinks, u.kids].some(Boolean) && (
                  <Section>
                    <SectionLabel icon={<span style={{ fontSize: 12 }}>◈</span>}>A bit about me</SectionLabel>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                      {[
                        { label: 'Height', val: u.height, emoji: '📏' },
                        { label: 'Looking for', val: u.looking, emoji: '🔍' },
                        { label: 'Zodiac', val: u.zodiac, emoji: '⭐' },
                        { label: 'MBTI', val: u.mbti, emoji: '🧠' },
                        { label: 'Drinks', val: u.drinks, emoji: '🥂' },
                        { label: 'Kids', val: u.kids, emoji: '🌱' },
                      ].filter(d => d.val).map(d => (
                        <div key={d.label} style={{ borderRadius: 14, padding: '11px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <div style={{ fontSize: 16, marginBottom: 5 }}>{d.emoji}</div>
                          <div style={{ fontSize: 10, color: 'rgba(240,235,255,0.3)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.label}</div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(240,235,255,0.82)' }}>{d.val}</div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </div>
            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div style={{
            flexShrink: 0, display: 'flex', gap: 10, padding: '14px 18px',
            paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(10,5,20,0.96)', backdropFilter: 'blur(20px)',
          }}>
            {isMatch ? (
              /* ── Matched: full message button ── */
              <button onClick={handleMessage} style={{ flex: 1, borderRadius: 14, padding: '14px', fontSize: 15, fontWeight: 600, background: 'linear-gradient(135deg, #c9815a, #9b4468)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 20px rgba(201,129,90,0.35)' }}>
                <MessageCircle size={17} /> Message {firstName}
              </button>
            ) : canMessageFirst && !hasSentFirst ? (
              /* ── Premium, not matched, haven't sent first msg yet ── */
              <>
                <button onClick={handleLike} style={{ flexShrink: 0, borderRadius: 14, padding: '14px 16px', fontSize: 14, fontWeight: 500, background: liked ? 'rgba(201,129,90,0.12)' : 'rgba(255,255,255,0.06)', border: liked ? '1px solid rgba(201,129,90,0.35)' : '1px solid rgba(255,255,255,0.1)', color: liked ? '#e8b89a' : 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Heart size={15} fill={liked ? '#e8b89a' : 'none'} color={liked ? '#e8b89a' : 'rgba(255,255,255,0.5)'} />
                  {liked ? '✓' : 'Like'}
                </button>
                <button onClick={handleMessage} style={{ flex: 1, borderRadius: 14, padding: '14px', fontSize: 14, fontWeight: 700, background: 'linear-gradient(135deg, #d4a843, #b8861c)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(212,168,67,0.3)' }}>
                  <MessageCircle size={16} /> Send opening message ✦
                </button>
              </>
            ) : canMessageFirst && hasSentFirst ? (
              /* ── Premium, already sent first msg, waiting for reply ── */
              <>
                <div style={{ flex: 1, borderRadius: 14, padding: '12px 16px', background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.22)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>⏳</span>
                  <span style={{ fontSize: 13, color: 'rgba(240,235,255,0.5)' }}>Waiting for {firstName} to reply</span>
                </div>
                <button onClick={close} style={{ flexShrink: 0, borderRadius: 14, padding: '14px 18px', fontSize: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                  Close
                </button>
              </>
            ) : (
              /* ── Free user, not matched ── */
              <>
                <button onClick={close} style={{ flexShrink: 0, borderRadius: 14, padding: '14px 18px', fontSize: 14, fontWeight: 500, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                  Maybe later
                </button>
                <button onClick={handleLike} style={{
                  flex: 1, borderRadius: 14, padding: '14px', fontSize: 15, fontWeight: 600,
                  background: liked ? 'rgba(201,129,90,0.12)' : 'linear-gradient(135deg, #c9815a, #9b4468)',
                  border: liked ? '1px solid rgba(201,129,90,0.35)' : 'none',
                  color: liked ? '#e8b89a' : 'white',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: liked ? 'none' : '0 4px 20px rgba(201,129,90,0.32)',
                  transition: 'all 0.2s',
                }}>
                  <Heart size={17} fill={liked ? '#e8b89a' : 'white'} color={liked ? '#e8b89a' : 'white'} />
                  {liked ? `You liked ${firstName} ✓` : `Like ${firstName}`}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Report modal */}
      {showReport && (
        <ReportModal
          reportedUser={{ id: u.id, name: u.name, photos: u.photos }}
          context="profile"
          onClose={() => { setShowReport(false); close(); }}
        />
      )}

      {/* Block confirm */}
      {showBlock && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)' }}
          onClick={() => setShowBlock(false)}>
          <div onClick={e => e.stopPropagation()} style={{ borderRadius: 24, padding: '30px 26px', width: '100%', maxWidth: 360, textAlign: 'center', background: 'rgba(22,11,40,0.98)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🚫</div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>Block {firstName}?</h3>
            <p style={{ color: 'rgba(240,235,255,0.45)', fontSize: 13.5, marginBottom: 24, lineHeight: 1.65 }}>They won't be able to see your profile or contact you. This can't be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowBlock(false)} style={{ flex: 1, padding: '13px', fontSize: 14, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button onClick={() => { blockUser(u.id); setShowBlock(false); close(); }} style={{ flex: 1, padding: '13px', fontSize: 14, borderRadius: 14, background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.32)', color: '#fca5a5', cursor: 'pointer', fontWeight: 600 }}>Block</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ children }) {
  return <div>{children}</div>;
}

function SectionLabel({ children, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'rgba(240,235,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
      {icon && <span style={{ color: 'rgba(240,235,255,0.28)' }}>{icon}</span>}
      {children}
    </div>
  );
}

function Badge({ icon, label, bg, border, color }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 600, background: bg, border: `1px solid ${border}`, color }}>
      {icon} {label}
    </span>
  );
}
