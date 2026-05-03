import { useApp } from '../../context/AppContext';
import DiscoverPage from './DiscoverPage';
import MatchesPage from './MatchesPage';
import MessagesPage from './MessagesPage';
import ProfilePage from './ProfilePage';
import ProfileModal from './ProfileModal';
import { LogoFull, LogoMark } from '../../components/Logo';
import { Search, MessageCircle, User, Compass, Heart } from 'lucide-react';

const TABS = [
  { id: 'discover',  label: 'Discover',  icon: Compass },
  { id: 'matches',   label: 'Matches',   icon: Heart },
  { id: 'messages',  label: 'Messages',  icon: MessageCircle },
  { id: 'profile',   label: 'Profile',   icon: User },
];

export default function AppShell() {
  const { appTab, setAppTab, matches, unreadNotifications, viewingProfile } = useApp();

  const BADGE = {
    matches:  matches.length,
    messages: unreadNotifications,
  };

  const activeTab = TABS.find(t => t.id === appTab);

  return (
    <div style={{ display: 'flex', height: '100dvh', background: '#120e1c', overflow: 'hidden' }}>

      {/* ── Desktop side nav ── */}
      <aside className="desktop-sidenav" style={{
        display: 'none', flexDirection: 'column', flexShrink: 0,
        borderRight: '1px solid rgba(255,245,235,0.05)',
        background: '#0e0b18',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 0 18px', borderBottom: '1px solid rgba(255,245,235,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="sidenav-logo-full"><LogoFull size="sm" /></span>
          <span className="sidenav-logo-mark"><LogoMark size={26} /></span>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const badge = BADGE[t.id];
            const active = appTab === t.id;
            return (
              <button key={t.id} onClick={() => setAppTab(t.id)} title={t.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(201,129,90,0.1)' : 'transparent',
                  color: active ? '#e8b89a' : 'rgba(245,240,232,0.3)',
                  transition: 'all 0.15s', textAlign: 'left', position: 'relative',
                }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Icon size={18} fill={active && t.id === 'matches' ? 'currentColor' : 'none'} strokeWidth={active ? 2.2 : 1.6} />
                  {badge > 0 && (
                    <span style={{ position: 'absolute', top: -5, right: -5, width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg,#c9815a,#9b4468)', color: 'white', fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span className="sidenav-label" style={{ fontSize: 13, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {t.label}
                </span>
                {active && <div style={{ position: 'absolute', right: 0, top: '18%', bottom: '18%', width: 3, borderRadius: '2px 0 0 2px', background: 'linear-gradient(#c9815a, #9b4468)' }} />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* ── Top bar (mobile + tablet) ── */}
        <header className="mobile-header" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          padding: '0 14px', height: 54, flexShrink: 0,
          borderBottom: '1px solid rgba(255,245,235,0.05)',
          background: '#0e0b18',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LogoMark size={28} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="font-serif" style={{ fontSize: 14, fontWeight: 600, color: 'rgba(245,240,232,0.5)', whiteSpace: 'nowrap' }}>
              {activeTab?.label}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,245,235,0.08)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Search size={14} color="rgba(245,240,232,0.4)" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {appTab === 'discover'  && <DiscoverPage />}
          {appTab === 'matches'   && <MatchesPage />}
          {appTab === 'messages'  && <MessagesPage />}
          {appTab === 'profile'   && <ProfilePage />}
        </div>

        {/* ── Bottom nav (mobile only) ── */}
        <nav className="mobile-bottomnav" style={{
          display: 'flex', flexShrink: 0,
          background: '#0e0b18',
          borderTop: '1px solid rgba(255,245,235,0.05)',
          paddingBottom: 'max(6px, env(safe-area-inset-bottom))',
        }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const badge = BADGE[t.id];
            const active = appTab === t.id;
            return (
              <button key={t.id} onClick={() => setAppTab(t.id)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  paddingTop: 10, paddingBottom: 6, gap: 0,
                  border: 'none', cursor: 'pointer', background: 'transparent',
                  color: active ? '#e8b89a' : 'rgba(245,240,232,0.25)',
                  position: 'relative', transition: 'color 0.15s',
                }}>
                {active && (
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 22, height: 2.5, borderRadius: '0 0 3px 3px', background: 'linear-gradient(90deg, #c9815a, #9b4468)' }} />
                )}
                <div style={{ position: 'relative', padding: '6px 10px', borderRadius: 10, background: active ? 'rgba(201,129,90,0.12)' : 'transparent', transition: 'background 0.15s' }}>
                  <Icon size={19} fill={active && t.id === 'matches' ? 'currentColor' : 'none'} strokeWidth={active ? 2.2 : 1.6} />
                  {badge > 0 && (
                    <span style={{ position: 'absolute', top: 2, right: 4, width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg,#c9815a,#9b4468)', color: 'white', fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile modal */}
      {viewingProfile && <ProfileModal />}
    </div>
  );
}
