export const LOVE_LANGUAGES = [
  {
    id: 'words',
    name: 'Words of Affirmation',
    shortName: 'Words',
    icon: '💬',
    emoji: '💬',
    color: '#c9815a',
    colorLight: '#e8b89a',
    description: 'Verbal compliments, encouragement, and expressions of love.',
    receiveDesc: 'I feel most loved when someone expresses how they feel — a sincere compliment, an "I love you", or a few words that tell me I matter.',
    giveDesc: 'I show love through words. A heartfelt note, a well-timed compliment, or just saying exactly what I feel — that\'s how I let people know I care.',
    traits: ['Communicative', 'Expressive', 'Affirming', 'Articulate'],
    compatibilityNote: 'Best paired with someone who values open communication.',
    questions: [
      'A heartfelt compliment means more to me than an expensive gift.',
      'I feel unloved when my partner goes without saying "I love you."',
      'Written notes and texts from loved ones are treasured by me.',
      'Encouragement from others fuels my motivation.',
    ],
    bgClass: 'll-badge-words',
    ringClass: 'll-ring-words',
  },
  {
    id: 'acts',
    name: 'Acts of Service',
    shortName: 'Acts',
    icon: '🤝',
    emoji: '🤝',
    color: '#3b82f6',
    colorLight: '#93c5fd',
    description: 'Actions that ease burdens and show thoughtful care.',
    receiveDesc: 'I feel most loved when someone just does something — without being asked. A meal on the table, an errand handled, a problem quietly solved. That says everything.',
    giveDesc: 'I show love by doing. I\'ll pick up the slack, fix what\'s broken, and show up before you even have to ask. My actions are my love letters.',
    traits: ['Reliable', 'Helpful', 'Action-oriented', 'Dependable'],
    compatibilityNote: 'Thrives with partners who appreciate effort and reciprocate through initiative.',
    questions: [
      'When someone helps me without being asked, I feel deeply cared for.',
      'Actions speak louder than words in my relationships.',
      'I feel stressed when my partner doesn\'t notice what needs to be done.',
      'I love surprising my partner by taking tasks off their plate.',
    ],
    bgClass: 'll-badge-acts',
    ringClass: 'll-ring-acts',
  },
  {
    id: 'gifts',
    name: 'Receiving Gifts',
    shortName: 'Gifts',
    icon: '🎁',
    emoji: '🎁',
    color: '#d4a843',
    colorLight: '#f0d080',
    description: 'Tangible symbols of love and thoughtful gestures.',
    receiveDesc: 'I feel most loved when someone gives me something thoughtful — it doesn\'t have to be big. It\'s the fact that they saw something and thought of me.',
    giveDesc: 'I love finding the thing that says "I was thinking of you." A small, perfectly chosen gift is how I tell someone they\'re always on my mind.',
    traits: ['Thoughtful', 'Attentive', 'Sentimental', 'Detail-oriented'],
    compatibilityNote: 'Pairs well with someone who notices the small details that matter.',
    questions: [
      'Receiving a gift, even a small one, makes me feel deeply valued.',
      'I keep mementos and gifts from loved ones for years.',
      'I put real thought into selecting the perfect gift for someone.',
      'Forgetting an anniversary or birthday feels like being forgotten.',
    ],
    bgClass: 'll-badge-gifts',
    ringClass: 'll-ring-gifts',
  },
  {
    id: 'time',
    name: 'Quality Time',
    shortName: 'Time',
    icon: '⏳',
    emoji: '⏳',
    color: '#10b981',
    colorLight: '#6ee7b7',
    description: 'Undivided attention and meaningful shared experiences.',
    receiveDesc: 'I feel most loved when someone is truly present with me — phone down, eyes up, nowhere else to be. That kind of attention is everything to me.',
    giveDesc: 'I give love by giving my time. I plan things, I show up fully, and I make space for moments that matter. Time is the most real thing I can offer.',
    traits: ['Present', 'Intentional', 'Devoted', 'Experiential'],
    compatibilityNote: 'Best with partners who prioritize presence over productivity.',
    questions: [
      'Having someone\'s full attention makes me feel special and loved.',
      'Being on a phone during our time together hurts deeply.',
      'I cherish planned dates and shared rituals.',
      'Spending quality time together is my top love priority.',
    ],
    bgClass: 'll-badge-time',
    ringClass: 'll-ring-time',
  },
  {
    id: 'touch',
    name: 'Physical Touch',
    shortName: 'Touch',
    icon: '✨',
    emoji: '✨',
    color: '#8b5cf6',
    colorLight: '#c4b5fd',
    description: 'Physical connection, warmth, and comforting presence.',
    receiveDesc: 'I feel most loved through touch — a hug that lingers, a hand held without thinking, closeness that doesn\'t need words. Physical warmth is how I know someone is really there.',
    giveDesc: 'I show love through being close. A spontaneous hug, a hand on your shoulder, sitting next to you just because. My presence is how I say I love you.',
    traits: ['Warm', 'Affectionate', 'Connected', 'Grounded'],
    compatibilityNote: 'Thrives with emotionally present, physically affectionate partners.',
    questions: [
      'A warm hug can instantly make me feel loved and safe.',
      'Physical closeness matters more to me than grand gestures.',
      'I instinctively reach out to touch the ones I love.',
      'Lack of physical affection makes me feel disconnected.',
    ],
    bgClass: 'll-badge-touch',
    ringClass: 'll-ring-touch',
  },
];

export const getLoveLang = (id) => LOVE_LANGUAGES.find(l => l.id === id);

export const getCompatibilityScore = (give1, receive1, give2, receive2) => {
  // Perfect: your give = their receive, their give = your receive
  let score = 0;
  if (give1 === receive2) score += 50;
  if (give2 === receive1) score += 50;
  if (give1 === give2) score += 10; // shared giving style
  if (receive1 === receive2) score += 10; // shared needs
  return Math.min(score, 100);
};

export const COMPATIBILITY_LABELS = {
  90: { label: 'Soulmate', color: '#c9815a' },
  75: { label: 'Deep Bond', color: '#d4a843' },
  60: { label: 'Strong Match', color: '#10b981' },
  40: { label: 'Good Potential', color: '#3b82f6' },
  0:  { label: 'Growth Opportunity', color: '#8b5cf6' },
};

export const getCompatibilityLabel = (score) => {
  const thresholds = [90, 75, 60, 40, 0];
  for (const t of thresholds) {
    if (score >= t) return COMPATIBILITY_LABELS[t];
  }
  return COMPATIBILITY_LABELS[0];
};
