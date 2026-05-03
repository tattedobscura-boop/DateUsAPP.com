import { useState } from 'react';
import { X, Flag, ChevronRight, CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';

const ALL_REASONS = [
  { id: 'Inappropriate photos',    emoji: '🖼️',  desc: 'Nudity, graphic or explicit content' },
  { id: 'Harassment or threats',   emoji: '⚠️',  desc: 'Direct threats, intimidation, bullying' },
  { id: 'Fake profile / spam',     emoji: '🤖',  desc: 'Impersonation, bot, or spam account' },
  { id: 'Hate speech',             emoji: '🚫',  desc: 'Racist, homophobic, or discriminatory content' },
  { id: 'Under 18',                emoji: '🔞',  desc: 'User appears to be a minor' },
  { id: 'Sexual harassment',       emoji: '🛑',  desc: 'Unwanted sexual advances or messages' },
  { id: 'Threatening language',    emoji: '💬',  desc: 'Violent or threatening words' },
  { id: 'Violent language',        emoji: '🔪',  desc: 'Descriptions or glorification of violence' },
  { id: 'Abusive language',        emoji: '😡',  desc: 'Verbal abuse, insults, or degrading language' },
  { id: 'Potential grooming',      emoji: '🔍',  desc: 'Concerning interactions possibly targeting minors' },
  { id: 'Doxxing / privacy threat',emoji: '📍',  desc: 'Sharing or threatening to share private info' },
  { id: 'Scam / spam detected',    emoji: '💸',  desc: 'Soliciting money or redirecting off-app' },
  { id: 'Self-harm reference',     emoji: '❤️‍🩹', desc: 'Content referencing self-harm or suicide' },
  { id: 'Other',                   emoji: '📝',  desc: 'Something else not listed above' },
];

/**
 * ReportModal
 *
 * Props:
 *   reportedUser  — { id, name, photos }
 *   evidence      — optional string[] (pre-populated message excerpts)
 *   context       — 'profile' | 'messages'
 *   onClose       — () => void
 */
export default function ReportModal({ reportedUser, evidence = [], context = 'app', onClose }) {
  const [step, setStep]       = useState('reason');   // reason → notes → sending → done | error
  const [reason, setReason]   = useState(null);
  const [notes, setNotes]     = useState('');
  const [error, setError]     = useState(null);

  const firstName = reportedUser?.name?.split(' ')[0] || 'this user';

  async function submitReport() {
    setStep('sending');
    setError(null);
    try {
      const res = await fetch('/api/report', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedUserId:   String(reportedUser.id),
          reportedUserName: reportedUser.name || '',
          reason,
          evidence:         evidence.map(e => String(e).slice(0, 500)).slice(0, 5),
          notes:            notes.trim().slice(0, 1000),
          reporterContext:  context,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error ${res.status}`);
      }
      setStep('done');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep('error');
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 540,
          background: 'linear-gradient(160deg, #160b28 0%, #0d0a14 100%)',
          borderRadius: '28px 28px 0 0',
          border: '1px solid rgba(255,255,255,0.09)',
          borderBottom: 'none',
          padding: '0 0 max(28px, env(safe-area-inset-bottom))',
          maxHeight: '90dvh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 -24px 80px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 22px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldAlert size={16} color="#fca5a5" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Report {firstName}</div>
              <div style={{ fontSize: 11, color: 'rgba(240,235,255,0.35)', marginTop: 1 }}>
                {step === 'reason' ? 'Step 1 of 2 · Choose a reason' :
                 step === 'notes'  ? 'Step 2 of 2 · Add details (optional)' :
                 step === 'sending'? 'Submitting your report…' :
                 step === 'done'   ? 'Report submitted' : 'Submission failed'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <X size={14} color="rgba(255,255,255,0.5)" />
          </button>
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

          {/* ── Step 1: Reason ── */}
          {step === 'reason' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ALL_REASONS.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setReason(r.id); setStep('notes'); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 14,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{r.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(240,235,255,0.9)', marginBottom: 2 }}>{r.id}</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(240,235,255,0.38)', lineHeight: 1.4 }}>{r.desc}</div>
                  </div>
                  <ChevronRight size={14} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
                </button>
              ))}
            </div>
          )}

          {/* ── Step 2: Evidence + Notes ── */}
          {step === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Selected reason pill */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              }}>
                <Flag size={13} color="#fca5a5" />
                <span style={{ fontSize: 13, color: '#fca5a5', fontWeight: 600 }}>{reason}</span>
                <button
                  onClick={() => setStep('reason')}
                  style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(240,235,255,0.38)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Change
                </button>
              </div>

              {/* Evidence snippets (if any) */}
              {evidence.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,235,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Flagged content ({evidence.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {evidence.map((e, i) => (
                      <div key={i} style={{
                        borderRadius: 10, padding: '10px 12px',
                        background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.14)',
                        fontSize: 12, color: 'rgba(240,235,255,0.6)', lineHeight: 1.5,
                        fontStyle: 'italic',
                      }}>
                        "{String(e).slice(0, 200)}{e.length > 200 ? '…' : ''}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional notes */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(240,235,255,0.5)', display: 'block', marginBottom: 6 }}>
                  Additional details <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    className="input-dark"
                    rows={4}
                    style={{ resize: 'none', paddingBottom: 24 }}
                    placeholder="Describe what happened, or paste additional context…"
                    value={notes}
                    maxLength={1000}
                    onChange={e => setNotes(e.target.value)}
                  />
                  <div style={{
                    position: 'absolute', bottom: 8, right: 12,
                    fontSize: 10, color: notes.length > 900 ? '#c9815a' : 'rgba(240,235,255,0.25)',
                    pointerEvents: 'none',
                  }}>
                    {notes.length}/1000
                  </div>
                </div>
              </div>

              {/* Safety notice */}
              <div style={{
                borderRadius: 12, padding: '11px 14px',
                background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
                display: 'flex', alignItems: 'flex-start', gap: 9,
              }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🛡️</span>
                <p style={{ fontSize: 11.5, color: 'rgba(240,235,255,0.45)', lineHeight: 1.6, margin: 0 }}>
                  Reports are reviewed by our safety team. All reports are anonymous — {firstName} won't be notified that you reported them.
                </p>
              </div>

              {/* Submit button */}
              <button
                onClick={submitReport}
                style={{
                  width: '100%', padding: '14px', borderRadius: 14,
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  border: 'none', color: 'white', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 20px rgba(239,68,68,0.3)',
                }}
              >
                <Flag size={15} /> Submit Report
              </button>

              <button
                onClick={onClose}
                style={{
                  width: '100%', padding: '11px', borderRadius: 14,
                  background: 'none', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(240,235,255,0.4)', fontSize: 13, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* ── Sending ── */}
          {step === 'sending' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 16, textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(201,129,90,0.1)', border: '1px solid rgba(201,129,90,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}>
                <ShieldAlert size={28} color="#e8b89a" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Submitting your report…</div>
                <div style={{ fontSize: 13, color: 'rgba(240,235,255,0.38)' }}>This will only take a moment.</div>
              </div>
            </div>
          )}

          {/* ── Done ── */}
          {step === 'done' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: 16, textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle size={34} color="#34d399" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Report submitted</div>
                <div style={{ fontSize: 13, color: 'rgba(240,235,255,0.45)', lineHeight: 1.7, maxWidth: 300 }}>
                  Thank you for helping keep DateUs safe. Our safety team will review this report.
                </div>
              </div>
              <div style={{
                borderRadius: 14, padding: '14px 18px', marginTop: 4,
                background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
                fontSize: 12.5, color: 'rgba(240,235,255,0.5)', lineHeight: 1.6,
              }}>
                If you feel unsafe, you can also <strong style={{ color: '#6ee7b7' }}>block this user</strong> so they can no longer contact you.
              </div>
              <button
                onClick={onClose}
                style={{
                  marginTop: 8, width: '100%', padding: '13px', borderRadius: 14,
                  background: 'linear-gradient(135deg, #c9815a, #9b4468)',
                  border: 'none', color: 'white', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          )}

          {/* ── Error ── */}
          {step === 'error' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: 16, textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertCircle size={34} color="#fca5a5" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Couldn't submit report</div>
                <div style={{ fontSize: 13, color: 'rgba(240,235,255,0.45)', lineHeight: 1.7 }}>
                  {error || 'Something went wrong. Please try again.'}
                </div>
              </div>
              <button
                onClick={submitReport}
                style={{
                  width: '100%', padding: '13px', borderRadius: 14,
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  border: 'none', color: 'white', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                style={{
                  width: '100%', padding: '11px', borderRadius: 14,
                  background: 'none', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(240,235,255,0.4)', fontSize: 13, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
