import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/mockUsers';
import { getLoveLang } from '../../data/loveLangauges';
import LLIcon from '../../components/LLIcon';
import ReportModal from '../../components/ReportModal';
import { Send, ArrowLeft, MoreHorizontal, Heart, AlertTriangle, X, Flag, Ban, ShieldAlert } from 'lucide-react';
import { scanMessage, CATEGORY_LABELS } from '../../utils/messageSafety';

const ICEBREAKERS = [
  "What's your ideal Sunday morning? ☀️",
  "Describe your perfect date in 3 words 🌹",
  "What do you do to make someone feel special? 💫",
  "What's your love language story? 💬",
  "What makes you feel most at home? 🏡",
];

export default function MessagesPage() {
  const { currentUser, matches, messages, activeChat, setActiveChat, sendMessage, blockUser, reportUser,
          canMessageFirst, firstMessages, markFirstMessage } = useApp();
  const chattableUsers = MOCK_USERS.filter(u => matches.includes(u.id) || firstMessages[u.id]);

  if (activeChat) {
    const isMatched = matches.includes(activeChat.id);
    return (
      <ChatView
        user={activeChat}
        messages={messages[activeChat.id] || []}
        onSend={(t) => sendMessage(activeChat.id, t)}
        onBack={() => setActiveChat(null)}
        currentUser={currentUser}
        isMatched={isMatched}
        canMessageFirst={canMessageFirst}
        hasSentFirst={!!firstMessages[activeChat.id]}
        onMarkFirstMessage={() => markFirstMessage(activeChat.id)}
        onBlock={() => { blockUser(activeChat.id); setActiveChat(null); }}
        onReport={(reason) => reportUser(activeChat.id, reason)}
      />
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ padding: '20px 16px 12px' }}>
        <h1 className="page-title">Messages</h1>
        <p style={{ color: 'rgba(240,235,255,0.38)', fontSize: 13, marginTop: 2 }}>Your conversations ✨</p>
      </div>

      {chattableUsers.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>💬</div>
          <h3 className="font-serif" style={{ fontSize: '1.2rem', marginBottom: 8 }}>No conversations yet</h3>
          <p style={{ color: 'rgba(240,235,255,0.38)', fontSize: 13 }}>Match with someone to start chatting.</p>
        </div>
      ) : (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {chattableUsers.map(u => {
            const conv = messages[u.id] || [];
            const last = conv[conv.length - 1];
            const receive = getLoveLang(u.receive);
            return (
              <button key={u.id} onClick={() => setActiveChat(u)}
                style={{
                  width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 16,
                  display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                  transition: 'background 0.2s',
                }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={u.photos?.[0]} alt={u.name} style={{ width: 56, height: 56, borderRadius: 16, objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#4ade80', border: '2px solid #1a0d2e' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name.split(' ')[0]}, {u.age}</span>
                    {last && <span style={{ color: 'rgba(240,235,255,0.3)', fontSize: 11 }}>{formatTime(last.timestamp)}</span>}
                  </div>
                  <div style={{ color: 'rgba(240,235,255,0.42)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>
                    {last ? (last.from === 'me' ? `You: ${last.text}` : last.text) : `Say hi to ${u.name.split(' ')[0]}! 👋`}
                    {!matches.includes(u.id) && firstMessages[u.id] && <span style={{ fontSize: 11, color: '#f0d080', marginTop: 2, display: 'block' }}>✦ Awaiting reply</span>}
                  </div>
                  {receive && (
                    <span className={`ll-badge-${u.receive}`} style={{ borderRadius: 999, padding: '3px 9px', fontSize: 11, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <LLIcon id={u.receive} size={11} /> {receive.shortName}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Chat view ── */
function ChatView({ user, messages, onSend, onBack, currentUser, isMatched,
                    canMessageFirst, hasSentFirst, onMarkFirstMessage,
                    onBlock, onReport }) {
  const [text, setText] = useState('');
  const [showIce, setShowIce] = useState(messages.length === 0);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportEvidence, setReportEvidence] = useState([]);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  /* For unmatched messaging:
     - premium (canMessageFirst) + not yet sent → show premium first-message UI
     - premium + already sent first msg → show "awaiting reply" locked state
     - free + not matched → show first-date gate (legacy)
  */
  const isPremiumFirstMsg = canMessageFirst && !isMatched;
  const [firstDateAnswer, setFirstDateAnswer] = useState('');
  const [gateSubmitted, setGateSubmitted] = useState(
    isMatched ? true :
    canMessageFirst ? hasSentFirst :   // premium: gated by whether they've sent 1 msg
    messages.length > 0                // free: gated by whether they answered the prompt
  );

  const bottomRef = useRef(null);
  const receive = getLoveLang(user.receive);
  const give = getLoveLang(user.give);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (t) => {
    const msg = t || text.trim();
    if (!msg) return;
    onSend(msg);
    setText('');
    setShowIce(false);
  };

  const submitGate = () => {
    if (firstDateAnswer.trim().length < 10) return;
    onSend(firstDateAnswer.trim());
    setGateSubmitted(true);
    setFirstDateAnswer('');
  };

  const sendPremiumFirst = () => {
    if (firstDateAnswer.trim().length < 1) return;
    onSend(firstDateAnswer.trim());
    onMarkFirstMessage();
    setGateSubmitted(true);
    setFirstDateAnswer('');
  };

  function openReport(evidence = []) {
    setReportEvidence(evidence);
    setShowReportModal(true);
    setShowMenu(false);
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={16} />
        </button>
        <img src={user.photos?.[0]} alt={user.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name.split(' ')[0]}</div>
          <div style={{ color: '#4ade80', fontSize: 12 }}>Online now</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {receive && (
            <span className={`ll-badge-${user.receive}`} style={{ borderRadius: 999, padding: '4px 10px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              {receive.emoji} {receive.shortName}
            </span>
          )}
          {/* More menu */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowMenu(v => !v)}
              style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <div style={{ position: 'absolute', top: 42, right: 0, zIndex: 20, borderRadius: 14, overflow: 'hidden', minWidth: 180, background: '#1a0d2e', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
                <button onClick={() => openReport()}
                  style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#e8b89a', fontSize: 13, textAlign: 'left' }}>
                  <Flag size={14} /> Report {user.name.split(' ')[0]}
                </button>
                <button onClick={() => { setShowMenu(false); setShowBlockConfirm(true); }}
                  style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', fontSize: 13, textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <Ban size={14} /> Block {user.name.split(' ')[0]}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile mini-card */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div className="glass-card" style={{ borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={user.photos?.[0]} alt={user.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{user.name}, {user.age} · {user.occupation}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {receive && <span className={`ll-badge-${user.receive}`} style={{ borderRadius: 999, padding: '3px 8px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>{receive.emoji} Receives {receive.shortName}</span>}
              {give && <span className={`ll-badge-${user.give}`} style={{ borderRadius: 999, padding: '3px 8px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>{give.emoji} Gives {give.shortName}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {showIce && messages.length === 0 && isMatched && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ textAlign: 'center', color: 'rgba(240,235,255,0.28)', fontSize: 12, marginBottom: 10 }}>Icebreakers for {user.name.split(' ')[0]}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ICEBREAKERS.map(ice => (
                <button key={ice} onClick={() => handleSend(ice)}
                  className="glass-card" style={{ borderRadius: 12, padding: '10px 14px', fontSize: 13, color: 'rgba(240,235,255,0.6)', textAlign: 'left', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.035)', transition: 'background 0.15s' }}>
                  {ice}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => {
          const flag = msg.from !== 'me' ? scanMessage(msg.text) : null;
          const flagInfo = flag ? CATEGORY_LABELS[flag.category] : null;
          return (
            <MessageBubble
              key={msg.id}
              msg={msg}
              userPhoto={user.photos?.[0]}
              flag={flag}
              flagInfo={flagInfo}
              onReport={() => openReport([msg.text])}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Premium first-message UI (Ardor / Echelon, not yet matched, haven't sent yet) ── */}
      {isPremiumFirstMsg && !gateSubmitted && (
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,10,20,0.98)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f0d080', background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.28)', borderRadius: 999, padding: '3px 10px' }}>
              ✦ 1 opening message · {canMessageFirst ? 'Ardor / Echelon perk' : ''}
            </span>
          </div>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <textarea
              className="input-dark"
              style={{ resize: 'none', paddingBottom: 28 }}
              rows={3}
              placeholder={`Send ${user.name.split(' ')[0]} an opening message…`}
              value={firstDateAnswer}
              onChange={e => setFirstDateAnswer(e.target.value.slice(0, 300))}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendPremiumFirst(); } }}
            />
            <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 11, color: 'rgba(240,235,255,0.28)' }}>
              {firstDateAnswer.length}/300
            </div>
          </div>
          <button
            onClick={sendPremiumFirst}
            disabled={!firstDateAnswer.trim()}
            className="btn-primary"
            style={{ width: '100%', padding: '11px', fontSize: 13.5, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: firstDateAnswer.trim() ? 1 : 0.4 }}>
            <Send size={14} /> Send Opening Message
          </button>
        </div>
      )}

      {/* ── Premium: already sent first msg, waiting for match to reply ── */}
      {isPremiumFirstMsg && gateSubmitted && (
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,10,20,0.98)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13 }}>⏳</span>
          <p style={{ fontSize: 12.5, color: 'rgba(240,235,255,0.42)', margin: 0, lineHeight: 1.5 }}>
            Message sent — you'll be notified when <strong style={{ color: 'rgba(240,235,255,0.65)' }}>{user.name.split(' ')[0]}</strong> replies.
          </p>
        </div>
      )}

      {/* ── Free users: first-date gate (unmatched) ── */}
      {!isMatched && !canMessageFirst && !gateSubmitted && (
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,10,20,0.98)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <Heart size={14} color="#c9815a" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ color: 'rgba(240,235,255,0.55)', fontSize: 12, lineHeight: 1.6 }}>
              <strong style={{ color: 'rgba(240,235,255,0.8)' }}>Before you message {user.name.split(' ')[0]},</strong> tell them what your first date together would look like. Under 240 characters.
            </p>
          </div>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <textarea
              className="input-dark"
              style={{ resize: 'none', paddingBottom: 28 }}
              rows={3}
              placeholder={`What would we do for our first date? …`}
              value={firstDateAnswer}
              onChange={e => setFirstDateAnswer(e.target.value.slice(0, 240))}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitGate(); } }}
            />
            <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 11, color: firstDateAnswer.length > 220 ? '#c9815a' : 'rgba(240,235,255,0.28)' }}>
              {firstDateAnswer.length}/240
            </div>
          </div>
          <button
            onClick={submitGate}
            disabled={firstDateAnswer.trim().length < 10}
            className="btn-primary"
            style={{ width: '100%', padding: '11px', fontSize: 13.5, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: firstDateAnswer.trim().length >= 10 ? 1 : 0.4 }}>
            <Send size={14} /> Send First Date Idea
          </button>
        </div>
      )}

      {/* ── Normal message input (matched, or free gate passed — NOT premium awaiting) ── */}
      {(isMatched || (!isPremiumFirstMsg && gateSubmitted)) && (
        <div style={{ padding: '12px 16px', paddingBottom: 'max(12px, env(safe-area-inset-bottom))', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'flex-end', gap: 10, flexShrink: 0, background: 'rgba(13,10,20,0.98)' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              className="input-dark"
              style={{ resize: 'none', maxHeight: 112, paddingRight: 16 }}
              rows={1}
              maxLength={2000}
              placeholder={`Message ${user.name.split(' ')[0]}…`}
              value={text}
              onChange={e => { const v = e.target.value.slice(0, 2000); setText(v); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            {text.length > 1800 && (
              <div style={{ position: 'absolute', bottom: 6, right: 10, fontSize: 10, color: text.length > 1950 ? '#ef4444' : 'rgba(240,235,255,0.3)', pointerEvents: 'none' }}>
                {text.length}/2000
              </div>
            )}
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!text.trim()}
            style={{ width: 44, height: 44, borderRadius: 12, background: text.trim() ? 'linear-gradient(135deg, #c9815a, #9b4468)' : 'rgba(255,255,255,0.06)', border: 'none', cursor: text.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: text.trim() ? 1 : 0.35, transition: 'all 0.2s' }}>
            <Send size={16} color="white" />
          </button>
        </div>
      )}

      {/* Report modal */}
      {showReportModal && (
        <ReportModal
          reportedUser={{ id: user.id, name: user.name, photos: user.photos }}
          evidence={reportEvidence}
          context="messages"
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Block confirm */}
      {showBlockConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowBlockConfirm(false)}>
          <div onClick={e => e.stopPropagation()} className="glass-card" style={{ borderRadius: 22, padding: '28px 24px', width: '100%', maxWidth: 360, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🚫</div>
            <h3 className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Block {user.name.split(' ')[0]}?</h3>
            <p style={{ color: 'rgba(240,235,255,0.45)', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
              They won't be able to see your profile or contact you. This action can't be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowBlockConfirm(false)} className="btn-ghost" style={{ flex: 1, padding: '11px', fontSize: 13, borderRadius: 12 }}>Cancel</button>
              <button onClick={onBlock} style={{ flex: 1, padding: '11px', fontSize: 13, borderRadius: 12, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', cursor: 'pointer', fontWeight: 600 }}>
                Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Message bubble with optional safety flag ── */
function MessageBubble({ msg, userPhoto, flag, flagInfo, onReport }) {
  const [dismissed, setDismissed] = useState(false);
  const isMe = msg.from === 'me';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
        {!isMe && (
          <img src={userPhoto} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginBottom: 2 }} />
        )}
        <div style={{
          maxWidth: '72%', padding: '10px 14px', borderRadius: 18, fontSize: 13.5, lineHeight: 1.55,
          background: flag && !dismissed
            ? flagInfo.bg
            : isMe ? 'linear-gradient(135deg, #c9815a, #9b4468)' : 'rgba(255,255,255,0.07)',
          border: flag && !dismissed ? `1.5px solid ${flagInfo.border}` : 'none',
          borderBottomRightRadius: isMe ? 4 : 18,
          borderBottomLeftRadius: !isMe ? 4 : 18,
          color: isMe ? 'white' : 'rgba(240,235,255,0.85)',
          transition: 'background 0.3s',
          position: 'relative',
        }}>
          {/* Flag icon badge on the bubble */}
          {flag && !dismissed && (
            <div style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, borderRadius: '50%', background: flagInfo.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, boxShadow: `0 2px 8px ${flagInfo.color}55` }}>
              <ShieldAlert size={11} color="white" />
            </div>
          )}
          {msg.text}
          <div style={{ fontSize: 11, marginTop: 4, color: isMe ? 'rgba(255,255,255,0.5)' : 'rgba(240,235,255,0.3)' }}>
            {formatTime(msg.timestamp)}
          </div>
        </div>
      </div>

      {/* Flag banner — only for incoming flagged messages, not yet dismissed */}
      {flag && !dismissed && (
        <div style={{
          marginLeft: 36, maxWidth: '82%',
          borderRadius: 12, padding: '9px 12px',
          background: flagInfo.bg, border: `1px solid ${flagInfo.border}`,
          display: 'flex', alignItems: 'flex-start', gap: 8,
          animation: 'fadeInUp 0.2s ease',
        }}>
          <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{flagInfo.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: flagInfo.color, marginBottom: 3 }}>
              {flagInfo.label} detected
            </div>
            <div style={{ fontSize: 11, color: 'rgba(240,235,255,0.5)', lineHeight: 1.5, marginBottom: 8 }}>
              This message may violate our safety guidelines. You can report it or dismiss the warning.
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={onReport} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 8,
                background: flagInfo.color, border: 'none', color: 'white',
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}>
                <Flag size={10} /> Report
              </button>
              <button onClick={() => setDismissed(true)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 8,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(240,235,255,0.45)',
                fontSize: 11, cursor: 'pointer',
              }}>
                <X size={10} /> Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString();
}
