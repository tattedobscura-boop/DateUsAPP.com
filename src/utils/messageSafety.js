/**
 * Client-side message safety scanner.
 * Flags violent, threatening, accusatory, sexual harassment,
 * grooming, doxxing, and spam/scam language.
 *
 * Returns a flag object or null if the message is clean.
 */

const PATTERNS = [
  // ── VIOLENT ─────────────────────────────────────────────────────────────────
  { re: /\b(kill|murder|stab|shoot|gun|knife|attack|beat\s+you|hurt\s+you|harm\s+you|strangle|choke|rape|assault|destroy\s+you|end\s+you|bury\s+you|torture)\b/i, category: 'violent', severity: 'high' },
  { re: /\b(punch|slap|hit\s+you|smash\s+you|break\s+your|bash\s+you)\b/i, category: 'violent', severity: 'medium' },
  { re: /\b(weapon|bomb|explosive|acid\s+attack)\b/i, category: 'violent', severity: 'high' },

  // ── THREATENING ─────────────────────────────────────────────────────────────
  { re: /\b(i('ll| will|'m going to)\s+(find|come\s+for|come\s+after|get)\s+you)\b/i, category: 'threatening', severity: 'high' },
  { re: /\b(you('ll| will)\s+(regret|pay\s+for|suffer|be\s+sorry))\b/i, category: 'threatening', severity: 'high' },
  { re: /\b(i\s+know\s+where\s+you\s+(live|are|work|go\s+to\s+school))\b/i, category: 'threatening', severity: 'high' },
  { re: /\b(watch\s+your\s+back|you('re|\s+are)\s+dead|make\s+you\s+pay|make\s+your\s+life\s+(hell|miserable)|going\s+to\s+ruin\s+you)\b/i, category: 'threatening', severity: 'high' },
  { re: /\b(don'?t\s+(ignore|reject|leave|ghost)\s+me\s+or)\b/i, category: 'threatening', severity: 'high' },
  { re: /\b(blackmail|expose\s+you|ruin\s+your\s+(life|reputation|career)|release\s+your\s+(photos|videos|nudes))\b/i, category: 'threatening', severity: 'high' },
  { re: /\b(i('ve|\s+have)\s+been\s+(following|watching|tracking)\s+you)\b/i, category: 'threatening', severity: 'high' },
  { re: /\bscreenshot(s)?\s+(your|this|our|every)\b/i, category: 'threatening', severity: 'medium' },

  // ── SEXUAL HARASSMENT ────────────────────────────────────────────────────────
  { re: /\b(send\s+(me\s+)?(nudes?|naked\s+pics?|pics?\s+of\s+your|boobs?|tits|ass\s+pics?))\b/i, category: 'sexual', severity: 'high' },
  { re: /\b(i('ll| will)\s+(fuck|rape|touch|grab)\s+you)\b/i, category: 'sexual', severity: 'high' },
  { re: /\bwanna\s+(fuck|have\s+sex|sleep\s+with)\s+you\b/i, category: 'sexual', severity: 'high' },
  { re: /\bshow\s+me\s+your\s+(body|tits|ass|pussy|dick)\b/i, category: 'sexual', severity: 'high' },
  { re: /\blooking\s+for\s+(sex|hookup|fwb|one\s+night)\b/i, category: 'sexual', severity: 'medium' },

  // ── GROOMING / MINOR SOLICITATION ────────────────────────────────────────────
  { re: /\b(don'?t\s+tell\s+(your\s+(parents?|mom|dad|anyone)|anyone)|keep\s+(this|it|us)\s+(secret|between\s+us)|our\s+little\s+secret)\b/i, category: 'grooming', severity: 'high' },
  { re: /\bmeet\s+(me\s+)?(irl|in\s+person|alone|tonight|right\s+now|at\s+my\s+place)\b/i, category: 'grooming', severity: 'medium' },
  { re: /\bi('ll| will)\s+(buy\s+you\s+anything|give\s+you\s+money\s+if|take\s+care\s+of\s+you\s+if)\b/i, category: 'grooming', severity: 'medium' },

  // ── DOXXING ──────────────────────────────────────────────────────────────────
  { re: /\b(post\s+your\s+(address|phone|number|info)|share\s+your\s+(address|location)|i\s+found\s+your\s+(address|phone|social))\b/i, category: 'doxxing', severity: 'high' },
  { re: /\b(leak\s+your\s+(info|address|number|photos)|i\s+know\s+your\s+(real\s+name|address|number))\b/i, category: 'doxxing', severity: 'high' },

  // ── SCAM / FRAUD ─────────────────────────────────────────────────────────────
  { re: /\bsend\s+me\s+(money|cash|bitcoin|crypto|gift\s+cards?|\$\d+)\b/i, category: 'scam', severity: 'high' },
  { re: /\b(wire\s+transfer|western\s+union|cashapp\s+me|venmo\s+me|i\s+need\s+money)\b/i, category: 'scam', severity: 'high' },
  { re: /\b(click\s+(this\s+)?link|check\s+out\s+my\s+only.?fans|subscribe\s+to\s+my)\b/i, category: 'scam', severity: 'medium' },
  { re: /\b(move\s+(this|our\s+chat)\s+to\s+(telegram|whatsapp|kik|snapchat))\b/i, category: 'scam', severity: 'medium' },

  // ── ACCUSATORY / ABUSIVE ────────────────────────────────────────────────────
  { re: /\b(you('re|\s+are)\s+(worthless|pathetic|disgusting|stupid|trash|garbage|nothing|a\s+(whore|slut|bitch|pig|freak|loser|waste)))\b/i, category: 'accusatory', severity: 'high' },
  { re: /\b(nobody\s+(wants|loves|cares\s+about)\s+you|you\s+don'?t\s+deserve)\b/i, category: 'accusatory', severity: 'high' },
  { re: /\byou\s+(ruined|destroyed|wrecked)\s+(my|our|everything)\b/i, category: 'accusatory', severity: 'medium' },

  // ── SELF-HARM / COERCIVE ────────────────────────────────────────────────────
  { re: /\b(kill\s+myself|end\s+my\s+life|hurt\s+myself|want\s+to\s+die|can'?t\s+go\s+on)\b/i, category: 'self-harm', severity: 'high' },
  { re: /\bif\s+you\s+(leave|reject|block|ignore|don'?t).{0,40}(kill|hurt|harm|end)\b/i, category: 'threatening', severity: 'high' },
];

/**
 * @param {string} text
 * @returns {{ category: string, severity: 'high'|'medium', match: string } | null}
 */
export function scanMessage(text) {
  if (!text || text.length < 3) return null;
  let best = null;
  for (const { re, category, severity } of PATTERNS) {
    const m = text.match(re);
    if (m) {
      if (severity === 'high') return { category, severity, match: m[0] };
      if (!best) best = { category, severity, match: m[0] };
    }
  }
  return best;
}

export const CATEGORY_LABELS = {
  violent:     { label: 'Violent language',         color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   icon: '⚠️' },
  threatening: { label: 'Threatening language',     color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)',  icon: '🚨' },
  accusatory:  { label: 'Abusive language',         color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.28)', icon: '🔴' },
  sexual:      { label: 'Sexual harassment',        color: '#ec4899', bg: 'rgba(236,72,153,0.1)',  border: 'rgba(236,72,153,0.28)', icon: '🛑' },
  grooming:    { label: 'Potential grooming',       color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.3)',  icon: '🔮' },
  doxxing:     { label: 'Doxxing / privacy threat', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.28)', icon: '📍' },
  scam:        { label: 'Scam / spam detected',     color: '#84cc16', bg: 'rgba(132,204,22,0.1)',  border: 'rgba(132,204,22,0.28)', icon: '⚡' },
  'self-harm': { label: 'Self-harm reference',      color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)', icon: '💜' },
};
