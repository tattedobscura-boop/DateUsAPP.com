import { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert, RefreshCw, CheckCircle, Clock, Slash,
  AlertTriangle, Search, X, ChevronDown, ChevronUp,
  BarChart2, Flag, Eye, LogOut,
} from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  icon: <Clock size={12} /> },
  reviewed:  { label: 'Reviewed',  color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)',  icon: <Eye size={12} /> },
  actioned:  { label: 'Actioned',  color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)',  icon: <CheckCircle size={12} /> },
  dismissed: { label: 'Dismissed', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.22)', icon: <Slash size={12} /> },
};

export default function AdminPage() {
  const [authed, setAuthed]       = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [token, setToken]         = useState('');
  const [loginErr, setLoginErr]   = useState('');

  const [reports, setReports]     = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch]       = useState('');
  const [expanded, setExpanded]   = useState(null);
  const [tab, setTab]             = useState('reports');  // reports | stats

  /* ── Load data ── */
  const load = useCallback(async (tok) => {
    setLoading(true);
    try {
      const params = filterStatus ? `?status=${filterStatus}` : '';
      const [rRes, sRes] = await Promise.all([
        fetch(`/api/admin/reports${params}`, { headers: { 'x-admin-token': tok || token } }),
        fetch('/api/admin/stats',             { headers: { 'x-admin-token': tok || token } }),
      ]);
      if (rRes.status === 401 || sRes.status === 401) {
        setAuthed(false);
        setLoginErr('Invalid token. Please try again.');
        return;
      }
      const rData = await rRes.json();
      const sData = await sRes.json();
      setReports(rData.reports || []);
      setStats(sData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token, filterStatus]);

  useEffect(() => {
    if (authed) load();
  }, [authed, filterStatus]);

  /* ── Login ── */
  async function handleLogin(e) {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats', { headers: { 'x-admin-token': tokenInput.trim() } });
      if (res.status === 401) { setLoginErr('Invalid admin token.'); return; }
      const data = await res.json();
      setToken(tokenInput.trim());
      setStats(data);
      setAuthed(true);
      load(tokenInput.trim());
    } catch {
      setLoginErr('Could not reach server.');
    } finally {
      setLoading(false);
    }
  }

  /* ── Update report status ── */
  async function updateStatus(id, status, adminNote = '') {
    await fetch(`/api/admin/reports/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ status, adminNote }),
    });
    setReports(prev => prev.map(r => r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r));
  }

  /* ── Filtered list ── */
  const filtered = reports.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.reportedUserId.toLowerCase().includes(q) ||
      (r.reportedUserName || '').toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q) ||
      (r.notes || '').toLowerCase().includes(q)
    );
  });

  /* ─────── LOGIN SCREEN ─────── */
  if (!authed) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at 30% 20%, #1a0a30 0%, #05020c 70%)',
        fontFamily: 'DM Sans, sans-serif', padding: '0 20px',
      }}>
        <div style={{
          width: '100%', maxWidth: 380, borderRadius: 24,
          background: 'rgba(18,9,30,0.9)', border: '1px solid rgba(255,255,255,0.08)',
          padding: '36px 30px', boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'rgba(201,129,90,0.12)', border: '1px solid rgba(201,129,90,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldAlert size={20} color="#e8b89a" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>DateUs Admin</div>
              <div style={{ fontSize: 12, color: 'rgba(240,235,255,0.35)' }}>Moderation Dashboard</div>
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(240,235,255,0.45)', display: 'block', marginBottom: 6 }}>
                Admin Token
              </label>
              <input
                type="password"
                className="input-dark"
                placeholder="Enter admin token…"
                value={tokenInput}
                onChange={e => { setTokenInput(e.target.value); setLoginErr(''); }}
                style={{ width: '100%', boxSizing: 'border-box' }}
                autoFocus
              />
            </div>
            {loginErr && (
              <div style={{ fontSize: 12, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={12} /> {loginErr}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !tokenInput.trim()}
              style={{
                padding: '13px', borderRadius: 14,
                background: tokenInput.trim() ? 'linear-gradient(135deg, #c9815a, #9b4468)' : 'rgba(255,255,255,0.06)',
                border: 'none', color: 'white', fontSize: 14, fontWeight: 600,
                cursor: tokenInput.trim() ? 'pointer' : 'default', opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Signing in…' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ─────── DASHBOARD ─────── */
  return (
    <div style={{
      minHeight: '100dvh',
      background: 'radial-gradient(ellipse at 30% 10%, #1a0a30 0%, #05020c 60%)',
      fontFamily: 'DM Sans, sans-serif', color: 'rgba(240,235,255,0.9)',
    }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(8,4,16,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldAlert size={18} color="#e8b89a" />
          <span style={{ fontWeight: 700, fontSize: 16 }}>DateUs Moderation</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => load()}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(240,235,255,0.55)', fontSize: 12, cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
          <button
            onClick={() => { setAuthed(false); setToken(''); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(240,235,255,0.38)', fontSize: 12, cursor: 'pointer',
            }}
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* Stats bar */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: 12, marginBottom: 28 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setFilterStatus(filterStatus === key ? '' : key)}
                style={{
                  borderRadius: 16, padding: '16px 14px', textAlign: 'left',
                  background: filterStatus === key ? cfg.bg : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${filterStatus === key ? cfg.border : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer', transition: 'all 0.18s',
                }}
              >
                <div style={{ fontSize: 26, fontWeight: 800, color: cfg.color, lineHeight: 1, marginBottom: 6 }}>
                  {stats.counts?.[key] ?? 0}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(240,235,255,0.45)' }}>
                  {cfg.icon} {cfg.label}
                </div>
              </button>
            ))}
            <div style={{
              borderRadius: 16, padding: '16px 14px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, marginBottom: 6 }}>{stats.total ?? 0}</div>
              <div style={{ fontSize: 12, color: 'rgba(240,235,255,0.45)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Flag size={12} /> Total
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[
            { id: 'reports', label: 'Reports', icon: <Flag size={13} /> },
            { id: 'stats',   label: 'By Reason', icon: <BarChart2 size={13} /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10,
                background: tab === t.id ? 'rgba(201,129,90,0.12)' : 'rgba(255,255,255,0.04)',
                border: tab === t.id ? '1px solid rgba(201,129,90,0.28)' : '1px solid rgba(255,255,255,0.06)',
                color: tab === t.id ? '#e8b89a' : 'rgba(240,235,255,0.45)',
                fontSize: 13, fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Reports tab ── */}
        {tab === 'reports' && (
          <>
            {/* Search + filter row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={14} color="rgba(240,235,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="input-dark"
                  placeholder="Search by user, reason, notes…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', paddingLeft: 36, boxSizing: 'border-box' }}
                />
              </div>
              {(filterStatus || search) && (
                <button
                  onClick={() => { setFilterStatus(''); setSearch(''); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '0 14px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(240,235,255,0.45)', fontSize: 12, cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            {/* Report list */}
            {loading && reports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(240,235,255,0.3)', fontSize: 13 }}>Loading…</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(240,235,255,0.3)', fontSize: 13 }}>
                {search || filterStatus ? 'No reports match your filters.' : 'No reports yet.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map(r => (
                  <ReportCard key={r.id} report={r} expanded={expanded === r.id}
                    onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
                    onUpdateStatus={(status, note) => updateStatus(r.id, status, note)} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Stats / By-reason tab ── */}
        {tab === 'stats' && stats?.byReason && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(stats.byReason)
              .sort((a, b) => b[1] - a[1])
              .map(([reason, count]) => (
                <div key={reason} style={{
                  borderRadius: 14, padding: '14px 18px',
                  background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>{reason}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      height: 6, width: `${Math.round((count / stats.total) * 160)}px`,
                      minWidth: 8, maxWidth: 160, borderRadius: 3,
                      background: 'linear-gradient(90deg, #c9815a, #9b4468)',
                    }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#e8b89a', minWidth: 24, textAlign: 'right' }}>{count}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Individual report card ── */
function ReportCard({ report: r, expanded, onToggle, onUpdateStatus }) {
  const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
  const [note, setNote] = useState(r.adminNote || '');
  const [saving, setSaving] = useState(false);

  async function saveStatus(status) {
    setSaving(true);
    await onUpdateStatus(status, note);
    setSaving(false);
  }

  return (
    <div style={{
      borderRadius: 16,
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${expanded ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
      overflow: 'hidden', transition: 'border-color 0.15s',
    }}>
      {/* Summary row */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        {/* Status dot */}
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: cfg.color, flexShrink: 0,
          boxShadow: `0 0 6px ${cfg.color}66`,
        }} />

        {/* Reason + user */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 2 }}>{r.reason}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(240,235,255,0.38)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Against: {r.reportedUserName || r.reportedUserId} · {new Date(r.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Status badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8,
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          fontSize: 11, fontWeight: 600, color: cfg.color, flexShrink: 0,
        }}>
          {cfg.icon} {cfg.label}
        </div>

        {expanded ? <ChevronUp size={14} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={14} color="rgba(255,255,255,0.3)" />}
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 16px 18px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Metadata grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 8, padding: '14px 0' }}>
            {[
              { label: 'Report ID',  val: r.id },
              { label: 'User ID',    val: r.reportedUserId },
              { label: 'Context',    val: r.reporterContext || 'app' },
              { label: 'IP',         val: r.ip || '—' },
              { label: 'Created',    val: new Date(r.createdAt).toLocaleString() },
              { label: 'Updated',    val: new Date(r.updatedAt).toLocaleString() },
            ].map(m => (
              <div key={m.label} style={{ borderRadius: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 10, color: 'rgba(240,235,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 12, fontWeight: 500, wordBreak: 'break-all' }}>{m.val}</div>
              </div>
            ))}
          </div>

          {/* Evidence snippets */}
          {r.evidence?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,235,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Evidence</div>
              {r.evidence.map((e, i) => (
                <div key={i} style={{
                  borderRadius: 10, padding: '9px 12px', marginBottom: 6,
                  background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.13)',
                  fontSize: 12, color: 'rgba(240,235,255,0.6)', fontStyle: 'italic', lineHeight: 1.5,
                }}>"{e}"</div>
              ))}
            </div>
          )}

          {/* Reporter notes */}
          {r.notes && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,235,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Reporter notes</div>
              <div style={{
                borderRadius: 10, padding: '10px 12px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                fontSize: 12.5, color: 'rgba(240,235,255,0.65)', lineHeight: 1.6,
              }}>{r.notes}</div>
            </div>
          )}

          {/* Admin note */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,235,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
              Admin note
            </label>
            <textarea
              className="input-dark"
              rows={2}
              style={{ resize: 'none', width: '100%', boxSizing: 'border-box', fontSize: 12.5 }}
              placeholder="Internal note (not shown to users)…"
              value={note}
              maxLength={500}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                disabled={saving || r.status === key}
                onClick={() => saveStatus(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 10, fontSize: 12.5, fontWeight: 600,
                  background: r.status === key ? cfg.bg : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${r.status === key ? cfg.border : 'rgba(255,255,255,0.08)'}`,
                  color: r.status === key ? cfg.color : 'rgba(240,235,255,0.5)',
                  cursor: r.status === key || saving ? 'default' : 'pointer',
                  opacity: saving ? 0.6 : 1,
                  transition: 'all 0.15s',
                }}
              >
                {cfg.icon} Mark {cfg.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
