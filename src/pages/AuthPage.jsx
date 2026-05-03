import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogoFull } from '../components/Logo';
import LLIcon from '../components/LLIcon';
import PolicySheet from '../components/PolicySheet';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const MATCH_PREVIEWS = [
  { llId: 'time',  give: 'Quality Time',    receive: 'Words',         compat: '97%', color: '#10b981' },
  { llId: 'acts',  give: 'Acts of Service', receive: 'Physical Touch', compat: '89%', color: '#8b5cf6' },
  { llId: 'words', give: 'Words',           receive: 'Quality Time',   compat: '84%', color: '#c9815a' },
];

const SOCIAL = [
  { label: 'Continue with Google', icon: '🌐' },
  { label: 'Continue with Apple',  icon: '🍎' },
  { label: 'Continue with Facebook', icon: '📘' },
];

export default function AuthPage() {
  const { authMode, setAuthMode, setPage, register, demoLogin } = useApp();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm]         = useState({ email: '', password: '', name: '', dob: '' });
  const [openPolicy, setOpenPolicy] = useState(null);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const isLogin = authMode === 'login';
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Please fill in all fields.');
    if (!isLogin && !form.name)        return setError('Please enter your name.');
    if (!isLogin && !form.dob)         return setError('Please enter your date of birth.');
    setLoading(true);
    setTimeout(() => {
      if (isLogin) {
        register({ name: 'You', email: form.email, receive: 'time', give: 'words', bio: '', interests: [], photos: [] });
        setPage('app');
      } else {
        window._signupData = { name: form.name, email: form.email, dob: form.dob };
        setPage('onboarding');
      }
      setLoading(false);
    }, 900);
  };

  /* ─── shared styles ─── */
  const S = {
    page: {
      minHeight: '100dvh',
      display: 'flex',
      background: '#0d0a14',
      fontFamily: "'Inter', sans-serif",
    },
    /* Left decorative panel */
    left: {
      width: 460,
      flexShrink: 0,
      display: 'none',          // shown via media-query override below
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '56px 52px',
      position: 'relative',
      overflow: 'hidden',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      background: 'linear-gradient(160deg,#1a0d2e 0%,#0d0a14 100%)',
    },
    /* Right form panel */
    right: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      minHeight: '100dvh',
    },
    formWrap: {
      width: '100%',
      maxWidth: 380,
    },
    label: {
      display: 'block',
      fontSize: 12,
      fontWeight: 500,
      color: 'rgba(240,235,255,0.5)',
      marginBottom: 7,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '20px 0',
    },
    line: {
      flex: 1,
      height: 1,
      background: 'rgba(255,255,255,0.08)',
    },
  };

  return (
    <div style={S.page}>

      {/* ── LEFT PANEL ── only visible ≥1024px via inline media trick */}
      <style>{`@media(min-width:1024px){.auth-left{display:flex!important}}`}</style>
      <div className="auth-left" style={S.left}>
        {/* orbs */}
        <div style={{ position:'absolute', width:360, height:360, borderRadius:'50%', filter:'blur(90px)', top:-80, left:-80, background:'#c9815a', opacity:0.1, pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:280, height:280, borderRadius:'50%', filter:'blur(90px)', bottom:0, right:-40, background:'#8b5cf6', opacity:0.08, pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ marginBottom: 48 }}>
            <LogoFull size="lg" />
          </div>

          <h2 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
            Love speaks.<br />
            <span style={{ background:'linear-gradient(135deg,#e8b89a,#c9815a 50%,#d4a843)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Are you fluent?
            </span>
          </h2>

          <p style={{ color:'rgba(240,235,255,0.42)', fontSize:13.5, lineHeight:1.7, maxWidth:300, marginBottom:40 }}>
            DateUs matches you with people whose love style aligns with yours — how you give it and how you need it.
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {MATCH_PREVIEWS.map((ex, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, borderRadius:14, padding:'12px 16px', background:'rgba(255,255,255,0.035)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <LLIcon id={ex.llId} size={20} showBg bgSize={38} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, color:'rgba(240,235,255,0.32)', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    Gives {ex.give} · Needs {ex.receive}
                  </div>
                  <div style={{ fontSize:13, fontWeight:500, color:'rgba(240,235,255,0.78)' }}>Compatibility Match</div>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:ex.color, flexShrink:0 }}>{ex.compat}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={S.right}>
        <div style={S.formWrap}>

          {/* Mobile: back + logo */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:36 }} className="lg-hide">
            <style>{`@media(min-width:1024px){.lg-hide{display:none!important}}`}</style>
            <button onClick={() => setPage('landing')}
              style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'rgba(240,235,255,0.35)', cursor:'pointer', fontSize:13 }}>
              <ArrowLeft size={15} /> Back
            </button>
            <LogoFull size="sm" />
          </div>

          {/* Heading */}
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 8 }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ color:'rgba(240,235,255,0.4)', fontSize:14, marginBottom:28 }}>
            {isLogin ? 'Sign in to continue your love journey.' : 'Join millions finding love in their language.'}
          </p>

          {/* Social buttons */}
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
            {SOCIAL.map(b => (
              <button key={b.label} className="btn-ghost"
                style={{ width:'100%', padding:'11px 16px', borderRadius:12, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                <span style={{ fontSize:16 }}>{b.icon}</span> {b.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={S.divider}>
            <div style={S.line} />
            <span style={{ color:'rgba(240,235,255,0.28)', fontSize:12, whiteSpace:'nowrap' }}>or with email</span>
            <div style={S.line} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {!isLogin && (
              <div>
                <label style={S.label}>Full Name</label>
                <input className="input-dark" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
            )}

            <div>
              <label style={S.label}>Email</label>
              <input className="input-dark" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>

            {!isLogin && (
              <div>
                <label style={S.label}>Date of Birth</label>
                <input className="input-dark" type="date" value={form.dob} onChange={e => set('dob', e.target.value)} />
              </div>
            )}

            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:7 }}>
                <label style={{ ...S.label, marginBottom:0 }}>Password</label>
                {isLogin && (
                  <button type="button" style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'rgba(240,235,255,0.35)' }}
                    onMouseEnter={e => e.target.style.color='#c9815a'} onMouseLeave={e => e.target.style.color='rgba(240,235,255,0.35)'}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position:'relative' }}>
                <input className="input-dark" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  style={{ paddingRight:44 }}
                  value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(240,235,255,0.3)', display:'flex', alignItems:'center' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.22)', borderRadius:10, padding:'10px 14px', color:'#fca5a5', fontSize:13 }}>
                {error}
              </div>
            )}

            <button className="btn-primary" type="submit" disabled={loading}
              style={{ width:'100%', padding:'13px 20px', fontSize:15, borderRadius:12, marginTop:4 }}>
              {loading ? (
                <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.25)', borderTopColor:'white', borderRadius:'50%' }} className="animate-spin" />
                  {isLogin ? 'Signing in…' : 'Creating account…'}
                </span>
              ) : isLogin ? 'Sign In' : 'Get Started Free'}
            </button>
          </form>

          {/* Switch mode */}
          <p style={{ textAlign:'center', fontSize:13, color:'rgba(240,235,255,0.38)', marginTop:24 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setAuthMode(isLogin ? 'signup' : 'login')}
              style={{ background:'none', border:'none', cursor:'pointer', color:'#c9815a', fontWeight:600, fontSize:13 }}>
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {!isLogin && (
            <p style={{ textAlign:'center', fontSize:11, color:'rgba(240,235,255,0.2)', marginTop:10, lineHeight: 1.7 }}>
              By joining you agree to our{' '}
              <button onClick={() => setOpenPolicy('terms')} style={{ background:'none', border:'none', color:'rgba(201,129,90,0.7)', fontSize:11, cursor:'pointer', padding:0, textDecoration:'underline', textUnderlineOffset:2 }}>Terms of Service</button>
              {' '}&amp;{' '}
              <button onClick={() => setOpenPolicy('privacy')} style={{ background:'none', border:'none', color:'rgba(201,129,90,0.7)', fontSize:11, cursor:'pointer', padding:0, textDecoration:'underline', textUnderlineOffset:2 }}>Privacy Policy</button>.
              {' '}Our{' '}
              <button onClick={() => setOpenPolicy('community')} style={{ background:'none', border:'none', color:'rgba(201,129,90,0.7)', fontSize:11, cursor:'pointer', padding:0, textDecoration:'underline', textUnderlineOffset:2 }}>Community Standards</button>
              {' '}apply to all members.
            </p>
          )}
          {openPolicy && <PolicySheet policyId={openPolicy} onClose={() => setOpenPolicy(null)} />}

          {/* Bypass */}
          <div style={{ marginTop:28, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.06)', textAlign:'center' }}>
            <button onClick={demoLogin}
              style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'rgba(240,235,255,0.28)', textDecoration:'underline', textUnderlineOffset:3 }}>
              Skip — explore as demo user
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
