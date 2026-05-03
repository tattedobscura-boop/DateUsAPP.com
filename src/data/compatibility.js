/**
 * DateUs — Multi-Factor Compatibility Engine
 *
 * Scoring dimensions (100 pts total per dimension, then weighted):
 *   - Love Language (40%) — give/receive alignment
 *   - Interests (25%)     — overlap in interests + likes/dislikes
 *   - Attraction (20%)    — vibe alignment + dealmaker/dealbreaker check
 *   - Personality (15%)   — partnership quiz alignment
 */

// ── Love Language Score (0–100) ──────────────────────────────
export function loveLangScore(give1, receive1, give2, receive2) {
  let score = 0;
  if (give1 === receive2) score += 50; // you give what they need
  if (give2 === receive1) score += 50; // they give what you need
  if (give1 === give2) score += 10;    // shared giving style
  if (receive1 === receive2) score += 10; // shared needs
  return Math.min(score, 100);
}

// ── Interests Score (0–100) ──────────────────────────────────
function normalizeList(arr) {
  return (arr || []).map(s => s.toLowerCase().trim());
}

export function interestsScore(user1, user2) {
  const i1 = normalizeList([...(user1.interests || []), ...(user1.likes || [])]);
  const i2 = normalizeList([...(user2.interests || []), ...(user2.likes || [])]);

  if (!i1.length || !i2.length) return 40; // neutral

  // Count direct matches + partial word overlaps
  let matches = 0;
  for (const a of i1) {
    for (const b of i2) {
      if (a === b) { matches += 2; continue; }
      const wordsA = a.split(/\s+/);
      const wordsB = b.split(/\s+/);
      const wordOverlap = wordsA.some(w => w.length > 3 && wordsB.includes(w));
      if (wordOverlap) matches += 1;
    }
  }

  // Check dislike conflicts: if user2 likes something user1 dislikes
  const d1 = normalizeList(user1.dislikes || []);
  const d2 = normalizeList(user2.dislikes || []);
  let conflicts = 0;
  for (const like of i2) {
    if (d1.some(d => like.includes(d) || d.includes(like))) conflicts++;
  }
  for (const like of i1) {
    if (d2.some(d => like.includes(d) || d.includes(like))) conflicts++;
  }

  const maxPossible = Math.min(i1.length, i2.length) * 2;
  const raw = maxPossible > 0 ? (matches / maxPossible) : 0;
  const score = Math.round(raw * 100) - (conflicts * 8);
  return Math.max(10, Math.min(100, score));
}

// ── Attraction Score (0–100) ─────────────────────────────────
export function attractionScore(user1, user2) {
  const a1 = user1.attractions || {};
  const a2 = user2.attractions || {};

  // Vibe alignment: do their described vibes match what the other wants?
  const vibe1Wants = normalizeList(a1.vibe || []);
  const vibe2Has   = normalizeList(a2.vibe || []);
  const vibe2Wants = normalizeList(a2.vibe || []);
  const vibe1Has   = normalizeList(a1.vibe || []);

  // mutual vibe match
  const vibeMatches =
    vibe1Wants.filter(v => vibe2Has.includes(v)).length +
    vibe2Wants.filter(v => vibe1Has.includes(v)).length;
  const maxVibes = Math.max(1, vibe1Wants.length + vibe2Wants.length);
  const vibeScore = Math.round((vibeMatches / maxVibes) * 100);

  // Dealmaker overlap
  const dm1 = normalizeList(a1.dealmakers || []);
  const dm2 = normalizeList(a2.dealmakers || []);
  const i1Has = normalizeList([...(user1.interests || []), ...(user1.likes || [])]);
  const i2Has = normalizeList([...(user2.interests || []), ...(user2.likes || [])]);

  let dealmakerBonus = 0;
  for (const dm of dm2) {
    if (i1Has.some(i => i.includes(dm) || dm.includes(i))) dealmakerBonus += 8;
  }
  for (const dm of dm1) {
    if (i2Has.some(i => i.includes(dm) || dm.includes(i))) dealmakerBonus += 8;
  }

  // Dealbreaker penalty
  const db1 = normalizeList(a1.dealbreakers || []);
  const db2 = normalizeList(a2.dealbreakers || []);
  let dealbreakPenalty = 0;
  for (const db of db2) {
    if (i1Has.some(i => i.includes(db) || db.includes(i))) dealbreakPenalty += 15;
  }
  for (const db of db1) {
    if (i2Has.some(i => i.includes(db) || db.includes(i))) dealbreakPenalty += 15;
  }

  const raw = vibeScore + Math.min(dealmakerBonus, 30) - dealbreakPenalty;
  return Math.max(10, Math.min(100, raw));
}

// ── Personality Quiz Score (0–100) ───────────────────────────
export function personalityScore(quiz1, quiz2) {
  if (!quiz1 || !quiz2) return 50; // neutral if no data
  const keys = ['pace', 'conflict', 'weekend', 'role', 'priority', 'interest'];
  let matches = 0;
  let answered = 0;
  for (const k of keys) {
    if (quiz1[k] && quiz2[k]) {
      answered++;
      if (quiz1[k] === quiz2[k]) matches += 2; // perfect match
      // Compatible pairs (complementary answers score partial)
      else if (areCompatibleAnswers(k, quiz1[k], quiz2[k])) matches += 1;
    }
  }
  if (answered === 0) return 50;
  return Math.round((matches / (answered * 2)) * 100);
}

// Define complementary personality answer pairs
function areCompatibleAnswers(key, a1, a2) {
  const compatible = {
    pace: [['Slow burn', 'Steady and intentional'], ['Fast & passionate', 'Goes with the flow']],
    conflict: [['Talk it out immediately', 'Direct and quick resolution'], ['Need space first, then talk', 'Talk it out immediately']],
    weekend: [['Adventures outside', 'Mix of both'], ['Cozy stay-in', 'Mix of both']],
    role: [['The planner', 'The spontaneous one'], ['The nurturer', 'Balanced / equal']],
    priority: [['Emotional depth', 'Shared values'], ['Physical chemistry', 'Adventure & fun']],
    interest: [['Show up consistently', 'Give them space but stay close'], ['Express it with words', 'Plan special moments']],
  };
  const pairs = compatible[key] || [];
  return pairs.some(([x, y]) => (a1 === x && a2 === y) || (a1 === y && a2 === x));
}

// ── Overall Match Score (weighted) ──────────────────────────
export function getFullCompatibility(user1, user2) {
  const ll   = loveLangScore(user1.give, user1.receive, user2.give, user2.receive);
  const int  = interestsScore(user1, user2);
  const att  = attractionScore(user1, user2);
  const per  = personalityScore(user1.personalityQuiz, user2.personalityQuiz);

  const overall = Math.round(ll * 0.40 + int * 0.25 + att * 0.20 + per * 0.15);

  return {
    overall: Math.min(99, overall),
    loveLang: ll,
    interests: int,
    attraction: att,
    personality: per,
  };
}

// ── Label + color ────────────────────────────────────────────
export function compatLabel(score) {
  if (score >= 88) return { label: 'Soulmate Potential', color: '#c9815a', emoji: '💖' };
  if (score >= 75) return { label: 'Deep Bond', color: '#d4a843', emoji: '✨' };
  if (score >= 62) return { label: 'Strong Match', color: '#10b981', emoji: '💫' };
  if (score >= 48) return { label: 'Good Chemistry', color: '#3b82f6', emoji: '🌟' };
  return { label: 'Growth Together', color: '#8b5cf6', emoji: '🌱' };
}

// ── Smart scan: rank a list of candidates against a user ─────
export function scanAndRank(currentUser, candidates) {
  return candidates
    .map(c => ({ ...c, compat: getFullCompatibility(currentUser, c) }))
    .sort((a, b) => b.compat.overall - a.compat.overall);
}
