import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/mockUsers';
import { getLoveLang } from '../../data/loveLangauges';
import { getFullCompatibility, compatLabel } from '../../data/compatibility';
import LLIcon from '../../components/LLIcon';
import CompatibilityRing from '../../components/CompatibilityRing';
import { MessageCircle, MapPin, Zap } from 'lucide-react';

export default function MatchesPage() {
  const { currentUser, matches, likedProfiles, setViewingProfile, setActiveChat, setAppTab } = useApp();

  const matchedUsers = MOCK_USERS.filter(u => matches.includes(u.id));
  const likedUsers = MOCK_USERS.filter(u => likedProfiles.includes(u.id) && !matches.includes(u.id));

  const openChat = (user) => {
    setActiveChat(user);
    setAppTab('messages');
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ padding: '20px 16px 12px' }}>
        <h1 className="font-serif" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 700, marginBottom: 4 }}>Your Matches</h1>
        <p style={{ color: 'rgba(240,235,255,0.38)', fontSize: 13 }}>People who matched your love language energy ✨</p>
      </div>

      {/* Mutual matches */}
      {matchedUsers.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <div style={{ padding: '0 16px', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(240,235,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Mutual Matches · {matchedUsers.length}
            </span>
          </div>
          <div style={{ padding: '0 12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {matchedUsers.map(u => (
              <MatchCard key={u.id} user={u} currentUser={currentUser}
                onView={() => setViewingProfile(u)} onChat={() => openChat(u)} />
            ))}
          </div>
        </section>
      )}

      {/* Liked (pending) */}
      {likedUsers.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <div style={{ padding: '0 16px', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(240,235,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Awaiting Response · {likedUsers.length}
            </span>
          </div>
          <div style={{ padding: '0 12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {likedUsers.map(u => (
              <MatchCard key={u.id} user={u} currentUser={currentUser}
                onView={() => setViewingProfile(u)} onChat={() => openChat(u)} pending />
            ))}
          </div>
        </section>
      )}

      {matchedUsers.length === 0 && likedUsers.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>💫</div>
          <h3 className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>No matches yet</h3>
          <p style={{ color: 'rgba(240,235,255,0.38)', fontSize: 13 }}>Keep swiping! Your person is out there.</p>
        </div>
      )}
    </div>
  );
}

function MatchCard({ user, currentUser, onView, onChat, pending }) {
  const compat = currentUser ? getFullCompatibility(currentUser, user) : null;
  const info = compat ? compatLabel(compat.overall) : null;
  const receive = getLoveLang(user.receive);
  const give = getLoveLang(user.give);

  return (
    <div className="glass-card" onClick={onView}
      style={{
        borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
        cursor: 'pointer', opacity: pending ? 0.65 : 1, transition: 'background 0.2s',
      }}>
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={user.photos?.[0]} alt={user.name}
          style={{ width: 60, height: 60, borderRadius: 16, objectFit: 'cover', display: 'block' }} />
        {user.verified && (
          <div style={{
            position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%',
            background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 10, fontWeight: 700,
          }}>✓</div>
        )}
        {pending && (
          <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="#d4a843" />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{user.name}, {user.age}</span>
          {pending && <span style={{ color: '#facc15', fontSize: 11 }}>Pending</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(240,235,255,0.38)', fontSize: 11, marginBottom: 8 }}>
          <MapPin size={10} /> {user.distance}
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {receive && (
            <span className={`ll-badge-${user.receive}`} style={{ borderRadius: 999, padding: '3px 9px', fontSize: 10.5, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <LLIcon id={user.receive} size={11} /> {receive.shortName}
            </span>
          )}
          {give && (
            <span className={`ll-badge-${user.give}`} style={{ borderRadius: 999, padding: '3px 9px', fontSize: 10.5, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <LLIcon id={user.give} size={11} /> {give.shortName}
            </span>
          )}
        </div>
      </div>

      {/* Ring + chat */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <CompatibilityRing
          score={compat?.overall}
          color={info?.color}
          label={info?.label}
          give1={currentUser?.give} receive1={currentUser?.receive}
          give2={user.give} receive2={user.receive}
          size={52}
        />
        {!pending && (
          <button onClick={e => { e.stopPropagation(); onChat(); }}
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: 11, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MessageCircle size={11} /> Chat
          </button>
        )}
      </div>
    </div>
  );
}
