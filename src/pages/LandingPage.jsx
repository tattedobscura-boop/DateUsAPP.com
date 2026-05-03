import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LOVE_LANGUAGES } from '../data/loveLangauges';
import { LogoFull } from '../components/Logo';
import LLIcon from '../components/LLIcon';
import PolicySheet from '../components/PolicySheet';
import { Star, Shield, Zap, MessageCircle, Eye, Sparkles } from 'lucide-react';

/* ── tiny helper components to keep markup readable ── */
const SectionLabel = ({ children }) => <p className="section-label">{children}</p>;

const Pill = ({ children, className = '' }) => (
  <span className={`rounded-full px-4 py-1.5 text-xs font-medium inline-flex items-center gap-1.5 ${className}`}>
    {children}
  </span>
);

/* ── data ── */
const FEATURES = [
  { icon: <Zap size={18} />, title: 'Language-First Matching', body: 'Every match starts with how you give and receive love — not just looks.' },
  { icon: <Eye size={18} />, title: 'Real Compatibility Score', body: 'Our algorithm measures true emotional alignment between two people.' },
  { icon: <Sparkles size={18} />, title: 'Curated Discovery', body: 'Browse filtered by love language so you find someone who truly gets you.' },
  { icon: <Shield size={18} />, title: 'Verified Profiles', body: 'Every profile is photo-verified. Real people, real connections only.' },
  { icon: <MessageCircle size={18} />, title: 'Meaningful Icebreakers', body: 'Conversation starters built around love languages — never surface-level.' },
  { icon: <Star size={18} />, title: 'Full Profile Depth', body: 'Photos, lifestyle, MBTI, zodiac, goals — the complete picture, always.' },
];

const TESTIMONIALS = [
  { name: 'Maya S.', lang: 'Quality Time', llId: 'time',  quote: 'I finally found someone who puts the phone down. DateUs understood what I needed before I said it.' },
  { name: 'Darius K.', lang: 'Words of Affirmation', llId: 'words', quote: 'She wrote me a note on our third date. I had never felt so completely seen.' },
  { name: 'Lena R.', lang: 'Acts of Service', llId: 'acts', quote: 'He quietly handles everything without being asked. He speaks my love language fluently.' },
];

const STATS = [
  { val: '2.4M+', label: 'Active members' },
  { val: '847K',  label: 'Matches made' },
  { val: '94%',   label: 'Satisfaction rate' },
];

const HOW = [
  { n: '01', icon: '📝', title: 'Take the Quiz', body: 'Answer a short assessment to reveal how you give love and how you most need to receive it.' },
  { n: '02', icon: '✨', title: 'Build Your Profile', body: 'Photos, bio, lifestyle, values, MBTI, zodiac — a complete picture of who you are.' },
  { n: '03', icon: '💫', title: 'Meet Your Match', body: 'Browse curated matches with real compatibility scores. Message, flirt, fall in love.' },
];

export default function LandingPage() {
  const { setPage, setAuthMode, demoLogin } = useApp();
  const [openPolicy, setOpenPolicy] = useState(null);
  const goSignup = () => { setAuthMode('signup'); setPage('auth'); };
  const goLogin  = () => { setAuthMode('login');  setPage('auth'); };

  return (
    <div style={{ background: '#0d0a14', minHeight: '100dvh' }}>

      {/* ══ NAV ══ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(13,10,20,0.88)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <LogoFull size="md" />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-ghost" style={{ padding: '9px 20px' }} onClick={goLogin}>Sign In</button>
            <button className="btn-primary" style={{ padding: '9px 20px' }} onClick={goSignup}>Join Free</button>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: 700, height: 700, top: -200, left: -150, opacity: 0.07, background: '#c9815a' }} />
        <div className="orb" style={{ width: 500, height: 500, top: 100, right: -100, opacity: 0.055, background: '#8b5cf6' }} />
        <div className="orb" style={{ width: 400, height: 400, bottom: -100, left: '40%', opacity: 0.045, background: '#d4a843' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: 'clamp(56px, 10vw, 96px) 20px clamp(64px, 10vw, 104px)', textAlign: 'center' }}>
          {/* pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(201,129,90,0.1)', border: '1px solid rgba(201,129,90,0.24)',
            borderRadius: 999, padding: '6px 16px', fontSize: 12, color: '#e8b89a',
            marginBottom: 28, fontWeight: 500,
          }}>
            <Sparkles size={11} />
            The only dating app built entirely on love languages
          </div>

          <h1 className="font-serif" style={{
            fontSize: 'clamp(2.6rem, 7vw, 5.25rem)',
            fontWeight: 700, lineHeight: 1.1, marginBottom: 24,
          }}>
            Find love that speaks<br />
            <span className="gradient-text-hero" style={{ fontStyle: 'italic' }}>your language.</span>
          </h1>

          <p style={{ color: 'rgba(240,235,255,0.5)', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: 540, margin: '0 auto 40px' }}>
            DateUs matches you based on how you give love and how you need to receive it —
            the two things that actually make relationships last.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            <button className="btn-primary" style={{ padding: '13px 36px', fontSize: 15, borderRadius: 14 }} onClick={goSignup}>
              Discover Your Match
            </button>
            <button className="btn-ghost" style={{ padding: '13px 36px', fontSize: 15, borderRadius: 14 }} onClick={goLogin}>
              Sign In
            </button>
          </div>
          <div style={{ marginBottom: 48 }}>
            <button onClick={demoLogin}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'rgba(240,235,255,0.3)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Skip — explore the app as a demo user →
            </button>
          </div>

          {/* LL pill row — uses LLIcon */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {LOVE_LANGUAGES.map(ll => (
              <span key={ll.id} className={`ll-badge-${ll.id}`}
                style={{ borderRadius: 999, padding: '7px 14px', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <LLIcon id={ll.id} size={16} />
                {ll.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <div className="divider" />
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div className="font-serif gradient-text" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 4 }}>{s.val}</div>
              <div style={{ color: 'rgba(240,235,255,0.38)', fontSize: 13 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ 5 LOVE LANGUAGES ══ */}
      <section className="section" style={{ textAlign: 'center' }}>
        <SectionLabel>The Foundation</SectionLabel>
        <h2 className="section-title">The 5 Languages of Love</h2>
        <p className="section-sub">Every person gives and receives love differently. Both sides form your DateUs blueprint.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 48 }}>
          {LOVE_LANGUAGES.map(ll => (
            <div key={ll.id} className="glass-card card-hover" style={{ borderRadius: 20, padding: '28px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <LLIcon id={ll.id} size={36} showBg bgSize={64} />
              <div style={{ fontWeight: 600, fontSize: 14, color: ll.colorLight }}>{ll.name}</div>
              <div style={{ color: 'rgba(240,235,255,0.4)', fontSize: 12, lineHeight: 1.6 }}>{ll.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <div style={{ background: 'rgba(255,255,255,0.018)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <section className="section" style={{ textAlign: 'center' }}>
          <SectionLabel>The Process</SectionLabel>
          <h2 className="section-title">How DateUs Works</h2>
          <p className="section-sub">Three intentional steps to your most meaningful connection yet.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginTop: 48 }}>
            {HOW.map(s => (
              <div key={s.n} className="glass-card" style={{ borderRadius: 20, padding: 32, textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                <div className="font-serif" style={{ position: 'absolute', top: -8, right: 12, fontSize: 80, fontWeight: 700, color: 'rgba(255,255,255,0.03)', lineHeight: 1 }}>{s.n}</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, marginBottom: 20,
                  }}>{s.icon}</div>
                  <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: 'rgba(240,235,255,0.42)', fontSize: 13, lineHeight: 1.7 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ══ FEATURES ══ */}
      <section className="section" style={{ textAlign: 'center' }}>
        <SectionLabel>Why DateUs</SectionLabel>
        <h2 className="section-title">Everything you need. Nothing you don't.</h2>
        <p className="section-sub">The best of every dating app — built around emotional intelligence.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 48 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="glass-card card-hover" style={{ borderRadius: 20, padding: '24px 24px', display: 'flex', gap: 16, textAlign: 'left' }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: 'rgba(201,129,90,0.1)', border: '1px solid rgba(201,129,90,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9815a',
              }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{f.title}</div>
                <div style={{ color: 'rgba(240,235,255,0.4)', fontSize: 13, lineHeight: 1.65 }}>{f.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <div style={{ background: 'rgba(255,255,255,0.018)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <section className="section" style={{ textAlign: 'center' }}>
          <SectionLabel>Real Stories</SectionLabel>
          <h2 className="section-title">Love in their language.</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 48 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="glass-card" style={{ borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 18 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#d4a843" color="#d4a843" />)}
                </div>
                <p style={{ color: 'rgba(240,235,255,0.65)', fontSize: 13.5, lineHeight: 1.75, flexGrow: 1, fontStyle: 'italic', marginBottom: 20 }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <LLIcon id={t.llId} size={22} showBg bgSize={40} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: 'rgba(240,235,255,0.35)', fontSize: 12 }}>{t.lang}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ══ CTA ══ */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '96px 24px' }}>
        <div className="glass-card card-glow" style={{ borderRadius: 28, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="orb" style={{ width: 280, height: 280, top: -80, left: -80, opacity: 0.18, background: '#c9815a' }} />
          <div className="orb" style={{ width: 220, height: 220, bottom: -60, right: -60, opacity: 0.14, background: '#8b5cf6' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <LogoFull size="xl" className="justify-center" style={{ marginBottom: 24 }} />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            </div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, marginBottom: 14 }}>
              Find someone who loves<br />the way you do.
            </h2>
            <p style={{ color: 'rgba(240,235,255,0.42)', fontSize: 14, marginBottom: 36, lineHeight: 1.6 }}>
              Join millions already speaking love fluently on DateUs.
            </p>
            <button className="btn-primary" style={{ padding: '14px 48px', fontSize: 15, borderRadius: 14 }} onClick={goSignup}>
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* ══ FRIENDUS CALLOUT ══ */}
      <section style={{ padding: '0 24px 72px' }}>
        <div style={{
          maxWidth: 760, margin: '0 auto',
          borderRadius: 22,
          background: 'linear-gradient(135deg, rgba(13,148,136,0.08) 0%, rgba(8,145,178,0.06) 100%)',
          border: '1px solid rgba(13,148,136,0.18)',
          padding: '28px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Ambient glow */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: '#0d9488', opacity: 0.07, filter: 'blur(50px)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: 'linear-gradient(135deg, #0d9488, #0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 4px 16px rgba(13,148,136,0.3)',
            }}>🤝</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'rgba(240,235,255,0.92)', marginBottom: 3 }}>
                Looking for friendship, not romance?
              </div>
              <div style={{ fontSize: 13, color: 'rgba(240,235,255,0.45)', lineHeight: 1.55 }}>
                Our sister app <span style={{ color: '#5eead4', fontWeight: 600 }}>FriendUs</span> connects people for platonic bonds, shared interests, and genuine community.
              </div>
            </div>
          </div>

          <a
            href="https://friendusapp.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 22px', borderRadius: 11,
              background: 'linear-gradient(135deg, #0d9488, #0891b2)',
              color: 'white', fontSize: 13.5, fontWeight: 600,
              textDecoration: 'none', position: 'relative', zIndex: 1,
              boxShadow: '0 4px 14px rgba(13,148,136,0.28)',
              transition: 'opacity 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Visit FriendUs
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <LogoFull size="sm" />
          <p style={{ color: 'rgba(240,235,255,0.22)', fontSize: 12 }}>
            © 2026 DateUs Inc. · dateusapp.com · All rights reserved.
            {' · '}
            <a href="https://friendusapp.com" target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(94,234,212,0.5)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = 'rgba(94,234,212,0.85)'}
              onMouseLeave={e => e.target.style.color = 'rgba(94,234,212,0.5)'}>
              friendusapp.com
            </a>
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Privacy Policy',     id: 'privacy' },
              { label: 'Terms of Service',   id: 'terms' },
              { label: 'Cookie Policy',      id: 'cookies' },
              { label: 'Community Standards',id: 'community' },
              { label: 'Support',            id: null },
            ].map(({ label, id }) => (
              <button key={label}
                onClick={() => id ? setOpenPolicy(id) : window.location.href = 'mailto:support@dateusapp.com'}
                style={{ background: 'none', border: 'none', color: 'rgba(240,235,255,0.28)', fontSize: 12, cursor: 'pointer', padding: 0, transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(240,235,255,0.65)'}
                onMouseLeave={e => e.target.style.color = 'rgba(240,235,255,0.28)'}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {openPolicy && <PolicySheet policyId={openPolicy} onClose={() => setOpenPolicy(null)} />}
    </div>
  );
}
