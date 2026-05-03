import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PLANS } from '../../context/AppContext';
import { useStripeCheckout } from '../../hooks/useStripeCheckout';
import { getLoveLang, LOVE_LANGUAGES } from '../../data/loveLangauges';
import LLIcon from '../../components/LLIcon';
import {
  Edit3, LogOut, Camera, Shield, Star, ChevronRight, Bell, Eye, Lock,
  Zap, MessageCircle, Heart, Crown, Check, MapPin, Briefcase, Sparkles,
  ArrowLeft, Smartphone, Key, AlertTriangle,
  UserX, Flag, HelpCircle, X, Globe, Users, BellOff,
} from 'lucide-react';

const ROSE    = '#c9815a';
const ROSE_LT = '#e8b89a';
const DEEP    = '#9b4468';

export default function ProfilePage() {
  const {
    currentUser, logout, updateProfile,
    userPlan, likesLeft, likesUsed, likeBudget, maxChats, activeChats,
    swipesLeft, upgradePlan, recycleLikes,
  } = useApp();

  const { startCheckout, loading: checkoutLoading, error: checkoutError } = useStripeCheckout();

  const [tab,              setTab]              = useState('profile');
  const [sheet,            setSheet]            = useState(null); // 'notifications' | 'privacy' | 'security' | 'safety'
  const [editingBio,       setEditingBio]       = useState(false);
  const [bioDraft,         setBioDraft]         = useState(currentUser?.bio || '');
  const [editingFirstDate, setEditingFirstDate] = useState(false);
  const [firstDateDraft,   setFirstDateDraft]   = useState(currentUser?.firstDate || '');

  // Notification prefs (local UI state)
  const [notifPrefs, setNotifPrefs] = useState({ matches: true, messages: true, likes: true, email: false, push: true });
  const toggleNotif = k => setNotifPrefs(p => ({ ...p, [k]: !p[k] }));

  // Privacy prefs
  const [privacyPrefs, setPrivacyPrefs] = useState({ showDistance: true, showAge: true, showLastSeen: false, publicProfile: true });
  const togglePrivacy = k => setPrivacyPrefs(p => ({ ...p, [k]: !p[k] }));

  if (!currentUser) return null;

  const receive = getLoveLang(currentUser.receive);
  const give    = getLoveLang(currentUser.give);
  const photos  = currentUser.photos || [];

  const saveBio = () => { updateProfile({ bio: bioDraft }); setEditingBio(false); };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#120e1c', position: 'relative' }}>

      {/* ── Settings sheet overlay ── */}
      {sheet && (
        <SettingsSheet sheet={sheet} onClose={() => setSheet(null)}
          notifPrefs={notifPrefs} toggleNotif={toggleNotif}
          privacyPrefs={privacyPrefs} togglePrivacy={togglePrivacy}
        />
      )}

      {/* ── Tab bar ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,245,235,0.06)', background: '#0e0b18', flexShrink: 0 }}>
        {[{ id: 'profile', label: 'My Profile' }, { id: 'settings', label: 'Settings' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '14px 0', fontSize: 13.5, fontWeight: tab === t.id ? 700 : 400,
            background: 'none', border: 'none', cursor: 'pointer',
            color: tab === t.id ? ROSE_LT : 'rgba(245,240,232,0.35)',
            borderBottom: tab === t.id ? `2px solid ${ROSE}` : '2px solid transparent',
            transition: 'all 0.15s', fontFamily: 'inherit',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          PROFILE TAB
      ══════════════════════════════════════════ */}
      {tab === 'profile' && (
        <div>

          {/* ── Hero cover ── */}
          <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
            {photos[0] ? (
              <img src={photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${receive?.color || ROSE}33, ${give?.color || DEEP}33, #1a0f2e)` }} />
            )}
            {/* Gradient fade to page bg */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(18,14,28,0.1) 0%, rgba(18,14,28,0.5) 60%, #120e1c 100%)' }} />

            {/* Photo gallery strip — top-right */}
            {photos.length > 1 && (
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4 }}>
                {photos.slice(1, 4).map((p, i) => (
                  <div key={i} style={{ width: 44, height: 56, borderRadius: 8, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.15)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                    <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
                <button style={{ width: 44, height: 56, borderRadius: 8, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '2px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Camera size={14} color="rgba(255,255,255,0.5)" />
                </button>
              </div>
            )}

            {/* Plan badge — top-left */}
            {userPlan.id !== 'free' && (
              <div style={{ position: 'absolute', top: 14, left: 14 }}>
                {userPlan.id === 'echelon' && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 999, padding: '5px 12px', background: 'rgba(139,92,246,0.28)', border: '1px solid rgba(139,92,246,0.5)', backdropFilter: 'blur(8px)' }}>
                    <Crown size={11} color="#c4b5fd" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#c4b5fd' }}>Echelon</span>
                  </div>
                )}
                {userPlan.id === 'gold' && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 999, padding: '5px 12px', background: 'rgba(212,168,67,0.25)', border: '1px solid rgba(212,168,67,0.45)', backdropFilter: 'blur(8px)' }}>
                    <Star size={11} color="#f0d080" fill="#f0d080" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#f0d080' }}>Ardor</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Avatar + name row ── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 18px', marginTop: -44, marginBottom: 18, position: 'relative', zIndex: 2 }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div style={{ width: 88, height: 88, borderRadius: 24, overflow: 'hidden', border: `3px solid ${receive?.color || ROSE}`, boxShadow: `0 0 0 3px #120e1c, 0 8px 24px rgba(0,0,0,0.5)` }}>
                {photos[0] ? (
                  <img src={photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${ROSE}, ${DEEP})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'white' }}>
                    {currentUser.name?.charAt(0)}
                  </div>
                )}
              </div>
              <button style={{ position: 'absolute', bottom: -2, right: -2, width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${ROSE}, ${DEEP})`, border: '2px solid #120e1c', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Camera size={11} color="white" />
              </button>
            </div>

            {/* Edit button */}
            <button onClick={() => setEditingBio(b => !b)} style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 12, padding: '8px 16px', background: 'rgba(255,245,235,0.06)', border: '1px solid rgba(255,245,235,0.1)', color: 'rgba(245,240,232,0.6)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Edit3 size={13} /> Edit profile
            </button>
          </div>

          <div style={{ padding: '0 18px 32px' }}>

            {/* Name / meta */}
            <div style={{ marginBottom: 20 }}>
              <h2 className="font-serif" style={{ fontSize: 'clamp(1.4rem,5vw,1.8rem)', fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>
                {currentUser.name}
                {currentUser.nickname && currentUser.nickname !== currentUser.name.split(' ')[0] && (
                  <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'rgba(245,240,232,0.35)', marginLeft: 10 }}>"{currentUser.nickname}"</span>
                )}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, color: 'rgba(245,240,232,0.42)', fontSize: 13 }}>
                {currentUser.occupation && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={11} />{currentUser.occupation}</span>}
                {currentUser.location  && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{currentUser.location}</span>}
              </div>
              {/* Quick detail chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {[currentUser.zodiac, currentUser.mbti, currentUser.looking, currentUser.height].filter(Boolean).map(v => (
                  <span key={v} style={{ borderRadius: 999, padding: '4px 11px', fontSize: 11.5, background: 'rgba(255,245,235,0.06)', border: '1px solid rgba(255,245,235,0.1)', color: 'rgba(245,240,232,0.55)' }}>{v}</span>
                ))}
                {currentUser.verified && (
                  <span style={{ borderRadius: 999, padding: '4px 11px', fontSize: 11.5, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Check size={10} strokeWidth={3} /> Verified
                  </span>
                )}
              </div>
            </div>

            {/* ── Love Language Blueprint — two vivid cards ── */}
            <div style={{ marginBottom: 20 }}>
              <SectionLabel>Love Language Blueprint</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {receive && (
                  <LLCard
                    id={currentUser.receive}
                    ll={receive}
                    role="I feel loved when"
                    desc={receive.receiveDesc}
                  />
                )}
                {give && (
                  <LLCard
                    id={currentUser.give}
                    ll={give}
                    role="I show love by"
                    desc={give.giveDesc}
                  />
                )}
              </div>
            </div>

            {/* ── Bio ── */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <SectionLabel mb={0}>About me</SectionLabel>
                <button onClick={() => { setEditingBio(b => !b); setBioDraft(currentUser.bio || ''); }} style={{ fontSize: 12, color: ROSE_LT, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Edit3 size={11} /> {editingBio ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {editingBio ? (
                <div>
                  <textarea value={bioDraft} onChange={e => setBioDraft(e.target.value)} rows={4}
                    className="input-dark" style={{ resize: 'none', fontSize: 14, lineHeight: 1.7 }}
                    placeholder="Tell people who you are…" />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="btn-primary" style={{ padding: '9px 20px', fontSize: 13, borderRadius: 11 }} onClick={saveBio}>Save</button>
                    <button className="btn-ghost"   style={{ padding: '9px 20px', fontSize: 13, borderRadius: 11 }} onClick={() => setEditingBio(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ borderRadius: 16, padding: '16px 18px', background: 'rgba(255,245,235,0.03)', border: '1px solid rgba(255,245,235,0.07)' }}>
                  <p style={{ color: currentUser.bio ? 'rgba(245,240,232,0.7)' : 'rgba(245,240,232,0.28)', fontSize: 14, lineHeight: 1.75, margin: 0, fontStyle: currentUser.bio ? 'normal' : 'italic' }}>
                    {currentUser.bio || 'Add a bio to attract more matches…'}
                  </p>
                </div>
              )}
            </div>

            {/* ── First date answer ── */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <SectionLabel mb={0}>For our first date, I'd…</SectionLabel>
                <button onClick={() => { setEditingFirstDate(b => !b); setFirstDateDraft(currentUser.firstDate || ''); }} style={{ fontSize: 12, color: ROSE_LT, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Edit3 size={11} /> {editingFirstDate ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {editingFirstDate ? (
                <div>
                  <div style={{ position: 'relative' }}>
                    <textarea className="input-dark" style={{ resize: 'none', paddingBottom: 30, fontSize: 14 }} rows={3}
                      value={firstDateDraft} onChange={e => setFirstDateDraft(e.target.value.slice(0, 240))}
                      placeholder="Describe your ideal first date… (10–240 chars)" />
                    <div style={{ position: 'absolute', bottom: 10, right: 14, fontSize: 11, color: firstDateDraft.length > 220 ? ROSE : 'rgba(245,240,232,0.28)' }}>{firstDateDraft.length}/240</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="btn-primary" style={{ padding: '9px 20px', fontSize: 13, borderRadius: 11 }}
                      disabled={firstDateDraft.trim().length < 10}
                      onClick={() => { updateProfile({ firstDate: firstDateDraft.trim() }); setEditingFirstDate(false); }}>Save</button>
                    <button className="btn-ghost" style={{ padding: '9px 20px', fontSize: 13, borderRadius: 11 }} onClick={() => setEditingFirstDate(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ borderRadius: 16, padding: '16px 18px', background: `rgba(201,129,90,0.06)`, border: `1px solid rgba(201,129,90,0.16)`, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 14, left: 16, fontSize: 22, opacity: 0.18 }}>"</div>
                  <p style={{ color: currentUser.firstDate ? 'rgba(245,240,232,0.75)' : 'rgba(245,240,232,0.28)', fontSize: 14, lineHeight: 1.75, margin: 0, paddingLeft: 18, fontStyle: 'italic' }}>
                    {currentUser.firstDate || 'Add your first date idea — this appears on your profile.'}
                  </p>
                </div>
              )}
            </div>

            {/* ── Lifestyle facts ── */}
            {[currentUser.height, currentUser.drinks, currentUser.smoke, currentUser.kids].some(Boolean) && (
              <div style={{ marginBottom: 20 }}>
                <SectionLabel>Lifestyle</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {[
                    { emoji: '📏', label: 'Height',   val: currentUser.height },
                    { emoji: '🥂', label: 'Drinks',   val: currentUser.drinks },
                    { emoji: '🚭', label: 'Smoke',    val: currentUser.smoke },
                    { emoji: '👶', label: 'Kids',     val: currentUser.kids },
                    { emoji: '🔭', label: 'Looking',  val: currentUser.looking },
                    { emoji: '⚡', label: 'MBTI',     val: currentUser.mbti },
                  ].filter(d => d.val).map(d => (
                    <div key={d.label} style={{ borderRadius: 14, padding: '12px 14px', background: 'rgba(255,245,235,0.04)', border: '1px solid rgba(255,245,235,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{d.emoji}</span>
                      <div>
                        <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.32)', marginBottom: 1 }}>{d.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{d.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Interests ── */}
            {currentUser.interests?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <SectionLabel>Into</SectionLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {currentUser.interests.map(i => (
                    <span key={i} style={{ borderRadius: 999, padding: '7px 15px', fontSize: 13, background: 'rgba(255,245,235,0.05)', border: '1px solid rgba(255,245,235,0.09)', color: 'rgba(245,240,232,0.65)' }}>{i}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Upgrade CTA (free users) ── */}
            {userPlan.id === 'free' && (
              <div style={{ borderRadius: 20, padding: '20px', background: 'linear-gradient(135deg, rgba(201,129,90,0.1), rgba(155,68,104,0.1))', border: '1px solid rgba(201,129,90,0.2)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: ROSE, opacity: 0.1, filter: 'blur(24px)' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                      <Sparkles size={15} color={ROSE_LT} />
                      <span style={{ fontWeight: 700, fontSize: 14, color: ROSE_LT }}>Unlock more</span>
                    </div>
                    <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: 12, lineHeight: 1.6, margin: 0 }}>Unlimited swipes, see who liked you & more.</p>
                  </div>
                  <button onClick={() => startCheckout('echelon')} disabled={checkoutLoading} className="btn-primary" style={{ padding: '10px 18px', fontSize: 13, borderRadius: 12, flexShrink: 0, opacity: checkoutLoading ? 0.6 : 1 }}>
                    {checkoutLoading ? 'Loading…' : 'Upgrade'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          SETTINGS TAB
      ══════════════════════════════════════════ */}
      {tab === 'settings' && (
        <div style={{ padding: '20px 16px 40px' }}>

          {/* Plan card */}
          <SectionLabel>Your Plan</SectionLabel>
          <CurrentPlanCard plan={userPlan} likesLeft={likesLeft} likesUsed={likesUsed} likeBudget={likeBudget} maxChats={maxChats} activeChats={activeChats} swipesLeft={swipesLeft} onRecycle={recycleLikes} />

          {/* Upgrade */}
          {userPlan.id !== 'echelon' && (
            <div style={{ marginTop: 24 }}>
              <SectionLabel>Upgrade</SectionLabel>
              {userPlan.id === 'free' && (
                <ArdorCard onUpgrade={() => startCheckout('gold')} loading={checkoutLoading} />
              )}
              <div style={{ marginTop: userPlan.id === 'free' ? 12 : 0 }}>
                <EchelonCard onUpgrade={() => startCheckout('echelon')} loading={checkoutLoading} />
              </div>
            </div>
          )}
          {checkoutError && (
            <div style={{ marginTop: 10, borderRadius: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 12.5, color: '#fca5a5' }}>
              {checkoutError}
            </div>
          )}

          {/* Account settings */}
          <div style={{ marginTop: 24 }}>
            <SectionLabel>Account</SectionLabel>
            <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,245,235,0.07)', background: 'rgba(255,245,235,0.02)' }}>
              {[
                { icon: Bell,   label: 'Notifications',   sub: 'Manage alerts and messages',    color: '#c9815a', id: 'notifications' },
                { icon: Eye,    label: 'Privacy',          sub: 'Who can see your profile',      color: '#0d9488', id: 'privacy' },
                { icon: Lock,   label: 'Account Security', sub: 'Password and 2FA',              color: '#7c3aed', id: 'security' },
                { icon: Shield, label: 'Safety Center',    sub: 'Block, report, and moderation', color: '#0891b2', id: 'safety' },
              ].map((s, i, arr) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,245,235,0.05)' : 'none' }}>
                    <button onClick={() => setSheet(s.id)} style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: 'inherit' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                        <Icon size={17} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'rgba(245,240,232,0.9)', lineHeight: 1.3 }}>{s.label}</div>
                        <div style={{ color: 'rgba(245,240,232,0.38)', fontSize: 12, marginTop: 2 }}>{s.sub}</div>
                      </div>
                      <ChevronRight size={15} color="rgba(255,245,235,0.2)" style={{ flexShrink: 0 }} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sign out */}
          <div style={{ marginTop: 24 }}>
            <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(239,68,68,0.12)', background: 'rgba(239,68,68,0.03)' }}>
              <button onClick={logout} style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: 'inherit' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', flexShrink: 0 }}>
                  <LogOut size={17} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#f87171' }}>Sign Out</span>
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

/* ── Section label ── */
function SectionLabel({ children, mb = 10 }) {
  return (
    <div style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(245,240,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: mb }}>
      {children}
    </div>
  );
}

/* ── Love Language card ── */
function LLCard({ id, ll, role, desc }) {
  return (
    <div style={{ borderRadius: 18, padding: '16px 15px', background: `${ll.color}10`, border: `1px solid ${ll.color}30`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -18, right: -18, width: 70, height: 70, borderRadius: '50%', background: ll.color, opacity: 0.1, filter: 'blur(16px)' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ll.color}22`, border: `1px solid ${ll.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 18 }}>
          <LLIcon id={id} size={18} />
        </div>
        <div style={{ fontSize: 9.5, color: 'rgba(245,240,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>{role}</div>
        <div style={{ fontWeight: 700, fontSize: 13, color: ll.colorLight, marginBottom: 6 }}>{ll.shortName}</div>
        <p style={{ fontSize: 11.5, color: 'rgba(245,240,232,0.5)', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{desc}</p>
      </div>
    </div>
  );
}

/* ── Current plan card ── */
function CurrentPlanCard({ plan, likesLeft, likesUsed, likeBudget, maxChats, activeChats, swipesLeft, onRecycle }) {
  const isEchelon = plan.id === 'echelon';
  const isGold    = plan.id === 'gold';

  const accent = isEchelon ? '#8b5cf6' : isGold ? '#d4a843' : ROSE;
  const accentLt = isEchelon ? '#c4b5fd' : isGold ? '#f0d080' : ROSE_LT;

  return (
    <div style={{ borderRadius: 20, padding: '18px', background: `${accent}0d`, border: `1px solid ${accent}30`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 110, height: 110, borderRadius: '50%', background: accent, opacity: 0.1, filter: 'blur(24px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            {isEchelon && <Crown size={18} color={accentLt} />}
            {isGold    && <Star  size={18} color={accentLt} fill={accentLt} />}
            {!isEchelon && !isGold && <Zap size={18} color={accentLt} />}
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: accentLt }}>{plan.name}</div>
              {isEchelon && <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.35)', marginTop: 1 }}>$33.33 / month</div>}
            </div>
          </div>
          {(isEchelon || isGold) && (
            <span style={{ borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700, background: `${accent}22`, border: `1px solid ${accent}44`, color: accentLt }}>Active</span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StatRow icon={<Heart size={13}/>}          label="Likes"          used={likeBudget === Infinity ? 0 : likesUsed}       total={likeBudget}  color={accent} suffix={likeBudget === Infinity ? 'Unlimited' : `${likesLeft} left`} />
          <StatRow icon={<MessageCircle size={13}/>}  label="Active chats"   used={maxChats   === Infinity ? 0 : activeChats}     total={maxChats}    color={accent} suffix={maxChats   === Infinity ? 'Unlimited' : `${Math.max(0, maxChats - activeChats)} open`} />
          {!isEchelon && !isGold
            ? <StatRow icon={<Zap size={13}/>} label="Swipes today"  used={10 - Math.min(10, swipesLeft)} total={10} color="#d4a843" suffix={`${swipesLeft} left`} />
            : <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'rgba(245,240,232,0.4)' }}><Zap size={12} /> Unlimited daily swipes</div>
          }
        </div>

        {isEchelon && likesLeft === 0 && (
          <button onClick={onRecycle} style={{ marginTop: 14, width: '100%', borderRadius: 12, padding: '10px', fontSize: 13, fontWeight: 600, background: `${accent}1c`, border: `1px solid ${accent}44`, color: accentLt, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
            ♻ Recycle — reset your 250 likes
          </button>
        )}
      </div>
    </div>
  );
}

function StatRow({ icon, label, used, total, color, suffix }) {
  const pct = total === Infinity ? 0 : Math.min(100, (used / total) * 100);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(245,240,232,0.5)', fontSize: 12 }}>
          <span style={{ color }}>{icon}</span>{label}
        </div>
        <span style={{ fontSize: 11, color: 'rgba(245,240,232,0.35)' }}>{suffix}</span>
      </div>
      {total !== Infinity && (
        <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)`, borderRadius: 3, transition: 'width 0.6s ease' }} />
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   SETTINGS SHEET — full-screen slide-over
────────────────────────────────────────── */
function SettingsSheet({ sheet, onClose, notifPrefs, toggleNotif, privacyPrefs, togglePrivacy }) {
  const panels = {
    notifications: { title: 'Notifications', color: '#c9815a', icon: Bell },
    privacy:       { title: 'Privacy',        color: '#0d9488', icon: Eye },
    security:      { title: 'Account Security', color: '#7c3aed', icon: Lock },
    safety:        { title: 'Safety Center',  color: '#0891b2', icon: Shield },
  };
  const p = panels[sheet];
  const Icon = p.icon;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: '#120e1c',
      display: 'flex', flexDirection: 'column',
      animation: 'slideUp 0.22s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid rgba(255,245,235,0.06)', background: '#0e0b18', flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,245,235,0.06)', border: '1px solid rgba(255,245,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={15} color="rgba(245,240,232,0.6)" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `${p.color}18`, border: `1px solid ${p.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={15} color={p.color} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'rgba(245,240,232,0.92)' }}>{p.title}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 40px' }}>
        {sheet === 'notifications' && <NotificationsPanel prefs={notifPrefs} toggle={toggleNotif} color={p.color} />}
        {sheet === 'privacy'       && <PrivacyPanel prefs={privacyPrefs} toggle={togglePrivacy} color={p.color} />}
        {sheet === 'security'      && <SecurityPanel color={p.color} />}
        {sheet === 'safety'        && <SafetyPanel color={p.color} />}
      </div>
    </div>
  );
}

/* ── Toggle row ── */
function ToggleRow({ label, sub, value, onChange, color = '#c9815a' }) {
  return (
    <button onClick={onChange} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 14, color: 'rgba(245,240,232,0.88)', lineHeight: 1.3 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'rgba(245,240,232,0.35)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ width: 44, height: 26, borderRadius: 13, background: value ? color : 'rgba(255,255,255,0.1)', border: `1px solid ${value ? color : 'rgba(255,255,255,0.12)'}`, position: 'relative', flexShrink: 0, transition: 'all 0.2s' }}>
        <div style={{ position: 'absolute', top: 3, left: value ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.3)', transition: 'left 0.2s' }} />
      </div>
    </button>
  );
}

/* ── Action row (link-style) ── */
function ActionRow({ icon: Icon, label, sub, color = 'rgba(245,240,232,0.7)', onClick, danger }) {
  return (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
      {Icon && <Icon size={16} color={danger ? '#f87171' : color} style={{ flexShrink: 0 }} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 14, color: danger ? '#f87171' : 'rgba(245,240,232,0.88)', lineHeight: 1.3 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'rgba(245,240,232,0.35)', marginTop: 2 }}>{sub}</div>}
      </div>
      <ChevronRight size={14} color="rgba(255,245,235,0.18)" style={{ flexShrink: 0 }} />
    </button>
  );
}

function SheetSection({ label, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(245,240,232,0.28)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
      <div style={{ borderRadius: 16, background: 'rgba(255,245,235,0.03)', border: '1px solid rgba(255,245,235,0.07)', padding: '0 16px', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(255,245,235,0.05)', margin: '0' }} />;
}

/* ── Notifications panel ── */
function NotificationsPanel({ prefs, toggle, color }) {
  return (
    <>
      <SheetSection label="Push Notifications">
        <ToggleRow label="New matches" sub="When someone connects with you" value={prefs.matches} onChange={() => toggle('matches')} color={color} />
        <Divider />
        <ToggleRow label="Messages" sub="New messages from your connections" value={prefs.messages} onChange={() => toggle('messages')} color={color} />
        <Divider />
        <ToggleRow label="Likes" sub="When someone likes your profile" value={prefs.likes} onChange={() => toggle('likes')} color={color} />
        <Divider />
        <ToggleRow label="Push notifications" sub="Allow all push alerts to your device" value={prefs.push} onChange={() => toggle('push')} color={color} />
      </SheetSection>
      <SheetSection label="Email">
        <ToggleRow label="Email digest" sub="Weekly summary of your activity" value={prefs.email} onChange={() => toggle('email')} color={color} />
      </SheetSection>
      <SheetSection label="Do Not Disturb">
        <ActionRow icon={BellOff} label="Quiet hours" sub="Set times to silence notifications" color={color} onClick={() => {}} />
      </SheetSection>
    </>
  );
}

/* ── Privacy panel ── */
function PrivacyPanel({ prefs, toggle, color }) {
  return (
    <>
      <SheetSection label="Profile Visibility">
        <ToggleRow label="Show my distance" sub="Let others see how far away you are" value={prefs.showDistance} onChange={() => toggle('showDistance')} color={color} />
        <Divider />
        <ToggleRow label="Show my age" sub="Display your age on your profile" value={prefs.showAge} onChange={() => toggle('showAge')} color={color} />
        <Divider />
        <ToggleRow label="Show last active" sub="Let connections see when you were online" value={prefs.showLastSeen} onChange={() => toggle('showLastSeen')} color={color} />
        <Divider />
        <ToggleRow label="Public profile" sub="Visible in Discover to others" value={prefs.publicProfile} onChange={() => toggle('publicProfile')} color={color} />
      </SheetSection>
      <SheetSection label="Data">
        <ActionRow icon={Globe} label="Data usage" sub="Manage how your data is used" color={color} onClick={() => {}} />
        <Divider />
        <ActionRow icon={Users} label="Blocked users" sub="View and manage blocked accounts" color={color} onClick={() => {}} />
      </SheetSection>
      <SheetSection label="Account">
        <ActionRow icon={X} label="Delete account" sub="Permanently remove your profile and data" danger onClick={() => {}} />
      </SheetSection>
    </>
  );
}

/* ── Security panel ── */
function SecurityPanel({ color }) {
  const [show2FAInfo, setShow2FAInfo] = useState(false);
  return (
    <>
      <SheetSection label="Password">
        <ActionRow icon={Key} label="Change password" sub="Update your account password" color={color} onClick={() => {}} />
      </SheetSection>
      <SheetSection label="Two-Factor Authentication">
        <ActionRow icon={Smartphone} label="Set up 2FA" sub="Add an extra layer of security via SMS or app" color={color} onClick={() => setShow2FAInfo(v => !v)} />
        {show2FAInfo && (
          <div style={{ padding: '0 0 14px', fontSize: 12.5, color: 'rgba(245,240,232,0.45)', lineHeight: 1.7 }}>
            Two-factor authentication adds a second step when you log in — a one-time code sent to your phone or generated by an authenticator app. Coming soon.
          </div>
        )}
      </SheetSection>
      <SheetSection label="Active Sessions">
        <ActionRow icon={Globe} label="Manage devices" sub="See where you're logged in" color={color} onClick={() => {}} />
        <Divider />
        <ActionRow icon={LogOut} label="Sign out all devices" sub="Log out everywhere except here" danger onClick={() => {}} />
      </SheetSection>
    </>
  );
}

const SAFETY_TIPS = [
  { emoji: '📍', tip: 'Meet in a public place for your first date — café, park, or busy street.' },
  { emoji: '📱', tip: 'Tell a friend or family member where you\'re going and who you\'re meeting.' },
  { emoji: '🚗', tip: 'Arrange your own transport. Don\'t rely on your date for a ride home.' },
  { emoji: '🥤', tip: 'Watch your drink at all times and never leave it unattended.' },
  { emoji: '🔋', tip: 'Keep your phone charged before heading out.' },
  { emoji: '🆘', tip: 'Trust your instincts — if something feels off, leave. You owe no explanation.' },
  { emoji: '📷', tip: 'Video-call before meeting in person to verify who you\'re talking to.' },
  { emoji: '🔒', tip: 'Never share your home address, workplace, or financial details early on.' },
];

const EMERGENCY_RESOURCES = [
  { name: 'National Domestic Violence Hotline', label: '1-800-799-7233',     href: 'tel:18007997233',          type: 'call', available: '24/7',                flag: '🇺🇸' },
  { name: 'Crisis Text Line',                   label: 'Text HOME to 741741', href: 'sms:741741?body=HOME',     type: 'text', available: '24/7',                flag: '🌐' },
  { name: 'RAINN',                              label: '1-800-656-4673',      href: 'tel:18006564673',          type: 'call', available: '24/7',                flag: '🇺🇸' },
  { name: 'Victim Connect',                     label: '1-855-4-VICTIM',      href: 'tel:18554842866',          type: 'call', available: 'Mon–Fri 9am–5pm ET', flag: '🇺🇸' },
  { name: 'Samaritans (UK & Ireland)',          label: '116 123',             href: 'tel:116123',               type: 'call', available: '24/7',                flag: '🇬🇧' },
  { name: 'Lifeline (Australia)',               label: '13 11 14',            href: 'tel:131114',               type: 'call', available: '24/7',                flag: '🇦🇺' },
];

/* ── Safety panel ── */
function SafetyPanel({ color }) {
  const [openSection, setOpenSection] = useState(null);
  const toggle = key => setOpenSection(s => s === key ? null : key);

  return (
    <>
      {/* Intro banner */}
      <div style={{ borderRadius: 14, padding: '14px 16px', background: `${color}10`, border: `1px solid ${color}28`, marginBottom: 22, display: 'flex', gap: 11, alignItems: 'flex-start' }}>
        <Shield size={16} color={color} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 13, color: 'rgba(245,240,232,0.55)', lineHeight: 1.6, margin: 0 }}>
          Your safety matters. Use these tools to protect yourself and keep DateUs a positive space.
        </p>
      </div>

      <SheetSection label="Report & Block">
        <ActionRow icon={UserX} label="Blocked users" sub="View and unblock people you've blocked" color={color} onClick={() => {}} />
        <Divider />
        <ActionRow icon={Flag} label="Report a user" sub="Flag inappropriate profiles or behaviour" color={color} onClick={() => {}} />
      </SheetSection>

      <SheetSection label="Help">
        {/* Safety Tips — expandable */}
        <button onClick={() => toggle('tips')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
          <HelpCircle size={16} color={color} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 14, color: 'rgba(245,240,232,0.88)' }}>Safety tips</div>
            <div style={{ fontSize: 12, color: 'rgba(245,240,232,0.35)', marginTop: 2 }}>Advice for safe online and in-person dating</div>
          </div>
          <div style={{ fontSize: 11, color: color, fontWeight: 600, flexShrink: 0, transition: 'transform 0.2s', transform: openSection === 'tips' ? 'rotate(90deg)' : 'none' }}>▶</div>
        </button>

        {openSection === 'tips' && (
          <div style={{ paddingBottom: 14 }}>
            {SAFETY_TIPS.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderTop: i === 0 ? `1px solid rgba(255,245,235,0.05)` : 'none' }}>
                <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1.5 }}>{t.emoji}</span>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(245,240,232,0.6)', lineHeight: 1.6 }}>{t.tip}</p>
              </div>
            ))}
          </div>
        )}

        <Divider />

        {/* Emergency Resources — expandable */}
        <button onClick={() => toggle('emergency')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
          <AlertTriangle size={16} color="#f87171" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 14, color: 'rgba(245,240,232,0.88)' }}>Emergency resources</div>
            <div style={{ fontSize: 12, color: 'rgba(245,240,232,0.35)', marginTop: 2 }}>Crisis lines and support services</div>
          </div>
          <div style={{ fontSize: 11, color: '#f87171', fontWeight: 600, flexShrink: 0, transition: 'transform 0.2s', transform: openSection === 'emergency' ? 'rotate(90deg)' : 'none' }}>▶</div>
        </button>

        {openSection === 'emergency' && (
          <div style={{ paddingBottom: 6 }}>
            {EMERGENCY_RESOURCES.map((r, i) => (
              <div key={i} style={{ padding: '11px 0', borderTop: '1px solid rgba(255,245,235,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{r.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(245,240,232,0.8)', lineHeight: 1.3, marginBottom: 4 }}>{r.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <a href={r.href} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '5px 12px', borderRadius: 999,
                      background: r.type === 'text' ? 'rgba(13,148,136,0.15)' : 'rgba(239,68,68,0.13)',
                      border: `1px solid ${r.type === 'text' ? 'rgba(13,148,136,0.35)' : 'rgba(239,68,68,0.3)'}`,
                      color: r.type === 'text' ? '#5eead4' : '#fca5a5',
                      fontSize: 12.5, fontWeight: 700, textDecoration: 'none',
                      fontVariantNumeric: 'tabular-nums', letterSpacing: '0.01em',
                    }}>
                      {r.type === 'text' ? '💬' : '📞'} {r.label}
                    </a>
                    <span style={{ fontSize: 11, color: 'rgba(245,240,232,0.28)', whiteSpace: 'nowrap' }}>{r.available}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetSection>

      <SheetSection label="Community">
        <ActionRow icon={Shield} label="Community guidelines" sub="Our standards for respectful interaction" color={color} onClick={() => {}} />
      </SheetSection>
    </>
  );
}

function ArdorCard({ onUpgrade, loading }) {
  return (
    <div style={{ borderRadius: 22, padding: '20px', background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.22)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: '#d4a843', opacity: 0.1, filter: 'blur(28px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
          <Star size={17} color="#f0d080" fill="#f0d080" />
          <span style={{ fontWeight: 800, fontSize: 16, color: '#f0d080' }}>DateUs Ardor</span>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#d4a843', marginLeft: 'auto' }}>$19.99<span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(212,168,67,0.5)', marginLeft: 3 }}>/mo</span></span>
        </div>
        <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: 12.5, lineHeight: 1.6, marginBottom: 14 }}>
          More swipes, more connections — covers both <strong style={{ color: 'rgba(245,240,232,0.6)' }}>DateUs</strong> &amp; <strong style={{ color: '#5eead4' }}>Don'tDateUs</strong>.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
          {[
            ['❤️','100 likes per cycle'],['💬','20 simultaneous chats'],
            ['⚡','Unlimited swipes'],   ['✉️','1 opening msg/profile'],
            ['🤝','Don\'tDateUs access'], ['✦','Ardor badge'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(245,240,232,0.58)' }}>
              <span>{icon}</span>{text}
            </div>
          ))}
        </div>
        <button onClick={onUpgrade} disabled={loading} style={{ width: '100%', borderRadius: 12, padding: '11px', fontSize: 13.5, fontWeight: 700, background: 'linear-gradient(135deg, #d4a843, #b8861c)', border: 'none', color: 'white', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(212,168,67,0.3)', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s' }}>
          <Star size={14} fill="white" /> {loading ? 'Redirecting…' : 'Join Ardor — $19.99/mo'}
        </button>
      </div>
    </div>
  );
}

function EchelonCard({ onUpgrade, loading }) {
  return (
    <div style={{ borderRadius: 22, padding: '22px 20px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: '#8b5cf6', opacity: 0.1, filter: 'blur(32px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
          <Crown size={19} color="#c4b5fd" />
          <span style={{ fontWeight: 800, fontSize: 17, color: '#c4b5fd' }}>DateUs Echelon</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#a78bfa', marginLeft: 'auto' }}>$33.33<span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(167,139,250,0.55)', marginLeft: 3 }}>/mo</span></span>
        </div>
        <p style={{ color: 'rgba(245,240,232,0.42)', fontSize: 13, lineHeight: 1.65, marginBottom: 18 }}>
          Our elite tier — covers both <strong style={{ color: 'rgba(245,240,232,0.65)' }}>DateUs</strong> &amp; <strong style={{ color: '#5eead4' }}>Don'tDateUs</strong>, everything unlocked.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 20 }}>
          {[
            ['💜','250 likes per cycle'],['💬','50 simultaneous chats'],
            ['⚡','Unlimited swipes'],   ['✉️','1 opening msg/profile'],
            ['🔍','Smart Scan priority'],['♻','Recycle your pool'],
            ['🤝','Don\'tDateUs access'], ['✦','Echelon badge'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'rgba(245,240,232,0.62)' }}>
              <span>{icon}</span>{text}
            </div>
          ))}
        </div>
        <button onClick={onUpgrade} disabled={loading} style={{ width: '100%', borderRadius: 14, padding: '13px', fontSize: 14, fontWeight: 700, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', border: 'none', color: 'white', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 20px rgba(109,40,217,0.4)', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s' }}>
          <Crown size={15} /> {loading ? 'Redirecting to Stripe…' : 'Join Echelon — $33.33/mo'}
        </button>
      </div>
    </div>
  );
}
