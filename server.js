import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import Stripe from 'stripe';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('WARNING: STRIPE_SECRET_KEY is not set. Stripe features will be unavailable.');
}
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const app  = express();
const PORT = process.env.PORT || 3001;

/* ── Allowed origins ── */
const ALLOWED_ORIGINS = [
  'https://dateusappcom-production.up.railway.app',
  'https://dateusapp.com',
  'https://www.dateusapp.com',
  'http://localhost:3000',
  'http://localhost:5173',
];

/* ─────────────────────────────────────────────────────────
   SECURITY MIDDLEWARE
───────────────────────────────────────────────────────── */

/* 1 — Helmet: comprehensive HTTP security headers */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:      ["'self'"],
      scriptSrc:       ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
      styleSrc:        ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:         ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:          ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc:      ["'self'", 'https://api.stripe.com', ...ALLOWED_ORIGINS],
      frameSrc:        ["'none'"],
      objectSrc:       ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts:                    { maxAge: 31536000, includeSubDomains: true, preload: true },
  xFrameOptions:           { action: 'deny' },
  xContentTypeOptions:     true,
  referrerPolicy:          { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: false,
}));

/* Permissions-Policy (not yet in helmet v8) */
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)');
  next();
});

/* 2 — CORS: restrict to known origins */
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  methods:     ['GET', 'POST'],
  credentials: false,
}));

/* 3 — Body size limit (1 MB max) */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

/* 4 — Global rate limit: 120 req / 15 min per IP */
app.use(rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              120,
  standardHeaders:  true,
  legacyHeaders:    false,
  message:          { error: 'Too many requests, please slow down.' },
}));

/* 5 — Stripe endpoint: tighter limit — 10 checkout / 15 min per IP */
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { error: 'Too many checkout attempts, please try again later.' },
});

/* ── Serve built frontend in production ── */
const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath, {
    setHeaders(res) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  }));
}

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */

const VALID_PLANS = new Set(['gold', 'echelon', 'ndu_gold', 'ndu_echelon']);

/* Validate that a URL is same-origin (or https Stripe) before forwarding */
function isSafeRedirectUrl(url) {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    const safeHosts = [
      'dateusappcom-production.up.railway.app',
      'dateusapp.com',
      'www.dateusapp.com',
      'localhost',
    ];
    return parsed.protocol === 'https:' || parsed.hostname === 'localhost'
      ? safeHosts.some(h => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`))
      : false;
  } catch { return false; }
}

/* ─────────────────────────────────────────────────────────
   PLANS
───────────────────────────────────────────────────────── */
const PLAN_LOOKUP_KEYS = {
  gold:        'dateus_gold_monthly',
  echelon:     'dateus_echelon_monthly',
  ndu_gold:    'dontdateus_gold_monthly',
  ndu_echelon: 'dontdateus_echelon_monthly',
};

/* ─────────────────────────────────────────────────────────
   ROUTES
───────────────────────────────────────────────────────── */

/* POST /api/checkout */
app.post('/api/checkout', checkoutLimiter, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });

  const { plan, successUrl, cancelUrl } = req.body;

  /* Validate plan */
  if (!plan || !VALID_PLANS.has(plan)) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  /* Validate redirect URLs to prevent open redirect */
  if ((successUrl && !isSafeRedirectUrl(successUrl)) ||
      (cancelUrl  && !isSafeRedirectUrl(cancelUrl))) {
    return res.status(400).json({ error: 'Invalid redirect URL' });
  }

  try {
    const prices = await stripe.prices.list({
      lookup_keys: [PLAN_LOOKUP_KEYS[plan]],
      expand:      ['data.product'],
    });

    let priceId;
    if (prices.data.length > 0) {
      priceId = prices.data[0].id;
    } else {
      const amounts = { gold: 1999, echelon: 3333, ndu_gold: 1999, ndu_echelon: 3333 };
      const names   = { gold: 'DateUs Ardor', echelon: 'DateUs Echelon', ndu_gold: "Don'tDateUs Ardor", ndu_echelon: "Don'tDateUs Echelon" };
      const price = await stripe.prices.create({
        currency:     'usd',
        unit_amount:  amounts[plan],
        recurring:    { interval: 'month' },
        lookup_key:   PLAN_LOOKUP_KEYS[plan],
        product_data: { name: names[plan] },
      });
      priceId = price.id;
    }

    const origin  = ALLOWED_ORIGINS.includes(req.headers.origin) ? req.headers.origin : ALLOWED_ORIGINS[0];
    const session = await stripe.checkout.sessions.create({
      mode:                 'subscription',
      line_items:           [{ price: priceId, quantity: 1 }],
      success_url:          successUrl || `${origin}?payment=success&plan=${plan}`,
      cancel_url:           cancelUrl  || `${origin}?payment=cancelled`,
      allow_promotion_codes: true,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    res.status(500).json({ error: 'Checkout failed. Please try again.' });
  }
});

/* POST /api/portal */
app.post('/api/portal', checkoutLimiter, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });

  const { customerId, returnUrl } = req.body;

  /* Validate customerId format (Stripe customer IDs start with cus_) */
  if (!customerId || typeof customerId !== 'string' || !/^cus_[a-zA-Z0-9]{10,}$/.test(customerId)) {
    return res.status(400).json({ error: 'Invalid customerId' });
  }

  if (returnUrl && !isSafeRedirectUrl(returnUrl)) {
    return res.status(400).json({ error: 'Invalid return URL' });
  }

  try {
    const origin  = ALLOWED_ORIGINS.includes(req.headers.origin) ? req.headers.origin : ALLOWED_ORIGINS[0];
    const session = await stripe.billingPortal.sessions.create({
      customer:   customerId,
      return_url: returnUrl || origin,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe portal error:', err.message);
    res.status(500).json({ error: 'Portal unavailable. Please try again.' });
  }
});

/* GET /api/health */
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

/* ─────────────────────────────────────────────────────────
   REPORTING SYSTEM
───────────────────────────────────────────────────────── */

const REPORTS_DIR  = join(__dirname, 'data');
const REPORTS_FILE = join(REPORTS_DIR, 'reports.json');

function loadReports() {
  try {
    if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });
    if (!existsSync(REPORTS_FILE)) return [];
    return JSON.parse(readFileSync(REPORTS_FILE, 'utf8'));
  } catch { return []; }
}

function saveReports(reports) {
  try {
    if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });
    writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
  } catch (e) { console.error('Failed to save reports:', e.message); }
}

const VALID_REASONS = new Set([
  'Inappropriate photos', 'Harassment or threats', 'Fake profile / spam',
  'Hate speech', 'Under 18', 'Sexual harassment', 'Threatening language',
  'Violent language', 'Abusive language', 'Potential grooming',
  'Doxxing / privacy threat', 'Scam / spam detected', 'Self-harm reference',
  'Other',
]);

const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: 'Too many reports. Please slow down.' },
});

/* POST /api/report */
app.post('/api/report', reportLimiter, (req, res) => {
  const { reportedUserId, reportedUserName, reason, category, evidence, notes, reporterContext } = req.body;

  if (!reportedUserId || typeof reportedUserId !== 'string' || reportedUserId.length > 100) {
    return res.status(400).json({ error: 'Invalid reportedUserId' });
  }
  if (!reason || !VALID_REASONS.has(reason)) {
    return res.status(400).json({ error: 'Invalid reason' });
  }
  if (notes && (typeof notes !== 'string' || notes.length > 1000)) {
    return res.status(400).json({ error: 'Notes too long (max 1000 chars)' });
  }

  const report = {
    id:              `rpt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    reportedUserId:  reportedUserId.slice(0, 100),
    reportedUserName: (reportedUserName || 'Unknown').slice(0, 80),
    reason,
    category:        category || null,
    evidence:        Array.isArray(evidence) ? evidence.slice(0, 5).map(e => String(e).slice(0, 500)) : [],
    notes:           notes ? notes.slice(0, 1000) : '',
    reporterContext: reporterContext || 'app',
    status:          'pending',   // pending | reviewed | actioned | dismissed
    createdAt:       new Date().toISOString(),
    updatedAt:       new Date().toISOString(),
    ip:              req.ip,
  };

  const reports = loadReports();
  reports.unshift(report);
  saveReports(reports);

  console.log(`[REPORT] ${report.id} — ${reason} against ${reportedUserId}`);
  res.status(201).json({ ok: true, reportId: report.id });
});

/* ─── Admin middleware — simple token auth ─── */
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dateus-admin-2026';

function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

/* GET /api/admin/reports */
app.get('/api/admin/reports', requireAdmin, (req, res) => {
  const reports  = loadReports();
  const status   = req.query.status;  // filter: pending | reviewed | actioned | dismissed
  const filtered = status ? reports.filter(r => r.status === status) : reports;
  res.json({ reports: filtered, total: filtered.length });
});

/* PATCH /api/admin/reports/:id — update status */
app.patch('/api/admin/reports/:id', requireAdmin, (req, res) => {
  const { id }     = req.params;
  const { status, adminNote } = req.body;
  const VALID_STATUSES = new Set(['pending', 'reviewed', 'actioned', 'dismissed']);

  if (!status || !VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const reports = loadReports();
  const idx     = reports.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Report not found' });

  reports[idx].status    = status;
  reports[idx].updatedAt = new Date().toISOString();
  if (adminNote) reports[idx].adminNote = adminNote.slice(0, 500);
  saveReports(reports);

  res.json({ ok: true, report: reports[idx] });
});

/* GET /api/admin/stats */
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const reports = loadReports();
  const counts  = { pending: 0, reviewed: 0, actioned: 0, dismissed: 0 };
  const byReason = {};
  reports.forEach(r => {
    counts[r.status] = (counts[r.status] || 0) + 1;
    byReason[r.reason] = (byReason[r.reason] || 0) + 1;
  });
  res.json({ total: reports.length, counts, byReason });
});

/* Catch-all — serve React app for any non-API route */
if (existsSync(distPath)) {
  app.get('*', (_req, res) => res.sendFile(join(distPath, 'index.html')));
}

/* ── 404 for unmatched API routes ── */
app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
});

/* ── Error handler ── */
app.use((err, _req, res, _next) => {
  if (err.message === 'Not allowed by CORS') return res.status(403).json({ error: 'Forbidden' });
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`DateUs API server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
