import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LOVE_LANGUAGES } from '../data/loveLangauges';
import { LogoFull } from '../components/Logo';
import LLIcon from '../components/LLIcon';
import { ArrowRight, ArrowLeft, Heart, Check, Camera, Upload, Shield } from 'lucide-react';

/* ── Step IDs ── */
const STEPS = [
  'love_receive',   // 0
  'love_give',      // 1
  'basics',         // 2
  'partnership',    // 3 — personality quiz
  'attractions',    // 4 — what you find attractive (vibe + traits)
  'likes_dislikes', // 5 — likes & dealbreakers
  'first_date',     // 6 — first date answer (≤240 chars)
  'photos',         // 7 — 3 photos required
  'id_verify',      // 8 — ID verification
  'done',           // 9
];

/* ─────────────────────────────────────────────────────────
   LOVE LANGUAGE QUIZ
   4 rounds. Each round shows one statement from each of the
   5 love languages (shuffled per round). The user picks the
   statement that resonates most. Highest tally = their result.
─────────────────────────────────────────────────────────── */

// Build quiz rounds: 4 rounds × 5 options (one per language)
// Each LOVE_LANGUAGE has 4 questions so we can use question[roundIndex]
function buildQuizRounds(mode) {
  // mode: 'receive' | 'give'
  // For receive we use each language's questions (experiential)
  // For give we use the giveDesc phrased as a statement
  return [0, 1, 2, 3].map(round => ({
    round,
    options: LOVE_LANGUAGES.map(ll => ({
      id: ll.id,
      text: ll.questions[round],
      color: ll.color,
      colorLight: ll.colorLight,
    })),
  }));
}

const RECEIVE_QUIZ_ROUNDS = buildQuizRounds('receive');

// Give quiz: use distinct give-phrased statements per language
const GIVE_STATEMENTS = {
  words: [
    'I text the people I care about just to say I\'m thinking of them.',
    'I always know the right words to make someone feel better.',
    'I write heartfelt notes or messages to show I care.',
    'I\'d rather tell someone I love them than show it any other way.',
  ],
  acts: [
    'I show up and take care of things so others don\'t have to.',
    'When someone I love needs help, I handle it without being asked.',
    'Running errands or fixing problems for someone is my way of saying I care.',
    'I find real satisfaction in doing things that make life easier for others.',
  ],
  gifts: [
    'I\'m always spotting things and thinking "they would love this."',
    'I put a lot of thought into choosing the perfect gift for someone.',
    'A small but perfectly chosen item says more than words ever could.',
    'I love bringing back souvenirs or little surprises for people I care about.',
  ],
  time: [
    'When I\'m with someone I love, everything else can wait.',
    'I plan special experiences to share with the people who matter to me.',
    'Being fully present — phone away, eyes up — is how I show I care.',
    'I carve out uninterrupted time with loved ones as a priority.',
  ],
  touch: [
    'I\'m the first to offer a hug when someone needs comfort.',
    'I naturally reach out — a hand on the shoulder, a squeeze — without thinking.',
    'Being physically close to someone I love is how I show I\'m there for them.',
    'A warm embrace or sitting close feels more powerful to me than any words.',
  ],
};

function buildGiveQuizRounds() {
  return [0, 1, 2, 3].map(round => ({
    round,
    options: LOVE_LANGUAGES.map(ll => ({
      id: ll.id,
      text: GIVE_STATEMENTS[ll.id][round],
      color: ll.color,
      colorLight: ll.colorLight,
    })),
  }));
}

const GIVE_QUIZ_ROUNDS = buildGiveQuizRounds();

function LoveLanguageQuiz({ mode, onComplete }) {
  // mode: 'receive' | 'give'
  const rounds = mode === 'receive' ? RECEIVE_QUIZ_ROUNDS : GIVE_QUIZ_ROUNDS;
  const TOTAL = rounds.length; // 4

  const [roundIdx, setRoundIdx] = useState(0);
  const [scores, setScores] = useState({}); // { words: 0, acts: 0, ... }
  const [chosen, setChosen] = useState(null); // chosen id this round
  const [showResult, setShowResult] = useState(false);
  const [resultId, setResultId] = useState(null);
  const [animating, setAnimating] = useState(false);

  const pick = (id) => {
    if (chosen || animating) return;
    setChosen(id);
    setAnimating(true);
    const newScores = { ...scores, [id]: (scores[id] || 0) + 1 };

    setTimeout(() => {
      if (roundIdx + 1 < TOTAL) {
        setRoundIdx(r => r + 1);
        setChosen(null);
        setAnimating(false);
        setScores(newScores);
      } else {
        // Tally results
        const winner = LOVE_LANGUAGES.reduce((best, ll) => {
          const s = newScores[ll.id] || 0;
          return s > (newScores[best] || 0) ? ll.id : best;
        }, LOVE_LANGUAGES[0].id);
        setResultId(winner);
        setShowResult(true);
        setAnimating(false);
        setScores(newScores);
      }
    }, 380);
  };

  const currentRound = rounds[roundIdx];
  const progressPct = ((roundIdx) / TOTAL) * 100;

  // Shuffle options each round so the order isn't always the same
  const shuffledOptions = [...currentRound.options].sort((a, b) => {
    // stable pseudo-shuffle based on round index
    const order = [2, 4, 0, 3, 1, 1, 3, 0, 4, 2, 4, 1, 3, 0, 2, 0, 2, 4, 1, 3];
    return order[roundIdx * 5 + currentRound.options.indexOf(a)] -
           order[roundIdx * 5 + currentRound.options.indexOf(b)];
  });

  if (showResult && resultId) {
    const winner = LOVE_LANGUAGES.find(l => l.id === resultId);
    const desc = mode === 'receive' ? winner.receiveDesc : winner.giveDesc;
    const label = mode === 'receive' ? 'how I receive love' : 'how I give love';
    return (
      <div style={{ animation: 'fadeInUp 0.4s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 56, marginBottom: 12, animation: 'heartbeat 2s ease-in-out infinite' }}>
            {winner.icon}
          </div>
          <h2 className="font-serif" style={{ fontSize: 'clamp(1.5rem,5vw,1.9rem)', fontWeight: 700, marginBottom: 6 }}>
            Your result
          </h2>
          <p style={{ color: 'rgba(240,235,255,0.45)', fontSize: 13 }}>Based on your answers</p>
        </div>

        <div style={{
          borderRadius: 22, padding: '24px 22px', marginBottom: 22,
          background: `rgba(${hexToRgb(winner.color)}, 0.09)`,
          border: `2px solid ${winner.color}55`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: winner.color, opacity: 0.08, filter: 'blur(30px)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <LLIcon id={winner.id} size={32} showBg bgSize={56} />
              <div>
                <div style={{ fontSize: 11, color: 'rgba(240,235,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
                  {label}
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: winner.colorLight }}>{winner.name}</div>
              </div>
            </div>
            <p style={{ color: 'rgba(240,235,255,0.78)', fontSize: 14, lineHeight: 1.75 }}>{desc}</p>
          </div>
        </div>

        {/* Score breakdown */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'rgba(240,235,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Your score breakdown
          </div>
          {LOVE_LANGUAGES.map(ll => {
            const s = scores[ll.id] || 0;
            const pct = (s / TOTAL) * 100;
            return (
              <div key={ll.id} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
                    <LLIcon id={ll.id} size={14} />
                    <span style={{ color: ll.id === resultId ? ll.colorLight : 'rgba(240,235,255,0.5)', fontWeight: ll.id === resultId ? 700 : 400 }}>{ll.shortName}</span>
                    {ll.id === resultId && <span style={{ fontSize: 10, background: `${ll.color}22`, border: `1px solid ${ll.color}44`, color: ll.colorLight, borderRadius: 999, padding: '2px 7px', fontWeight: 700 }}>Your result</span>}
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(240,235,255,0.35)' }}>{s}/{TOTAL}</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: ll.color, borderRadius: 3, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          onClick={() => onComplete(resultId)}>
          Continue <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Quiz header */}
      <div style={{ marginBottom: 22 }}>
        <h2 className="font-serif" style={{ fontSize: 'clamp(1.4rem,5vw,1.8rem)', fontWeight: 700, marginBottom: 8 }}>
          {mode === 'receive' ? 'What makes you feel most loved?' : 'How do you naturally show love?'}
        </h2>
        <p style={{ color: 'rgba(240,235,255,0.45)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
          {mode === 'receive'
            ? 'Pick the statement that resonates most with you right now.'
            : 'Pick the statement that sounds most like something you\'d do.'}
        </p>

        {/* Round progress dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {rounds.map((_, i) => (
            <div key={i} style={{
              height: 4, borderRadius: 2, transition: 'all 0.3s',
              flex: i < roundIdx ? 0 : 1,
              width: i < roundIdx ? 22 : i === roundIdx ? 'auto' : 6,
              background: i < roundIdx ? '#10b981' : i === roundIdx ? '#c9815a' : 'rgba(255,255,255,0.12)',
            }} />
          ))}
          <span style={{ fontSize: 12, color: 'rgba(240,235,255,0.32)', flexShrink: 0, marginLeft: 4 }}>
            {roundIdx + 1} of {TOTAL}
          </span>
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shuffledOptions.map(opt => {
          const isChosen = chosen === opt.id;
          const otherChosen = chosen && chosen !== opt.id;
          return (
            <button key={opt.id} onClick={() => pick(opt.id)}
              style={{
                width: '100%', textAlign: 'left', borderRadius: 16, padding: '16px 18px',
                cursor: chosen ? 'default' : 'pointer',
                border: isChosen ? `2px solid ${opt.color}` : '1px solid rgba(255,255,255,0.08)',
                background: isChosen ? `rgba(${hexToRgb(opt.color)}, 0.13)` : 'rgba(255,255,255,0.03)',
                color: isChosen ? opt.colorLight : otherChosen ? 'rgba(240,235,255,0.28)' : 'rgba(240,235,255,0.82)',
                fontSize: 14, lineHeight: 1.65, fontWeight: isChosen ? 600 : 400,
                transition: 'all 0.22s',
                opacity: otherChosen ? 0.45 : 1,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
              {isChosen
                ? <div style={{ width: 22, height: 22, borderRadius: '50%', background: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={12} color="white" strokeWidth={3} /></div>
                : <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.14)', flexShrink: 0 }} />
              }
              {opt.text}
            </button>
          );
        })}
      </div>

      <p style={{ textAlign: 'center', color: 'rgba(240,235,255,0.22)', fontSize: 12, marginTop: 16 }}>
        No right answer — just what feels most true to you
      </p>
    </div>
  );
}

const INTERESTS_LIST = [
  'Travel', 'Cooking', 'Yoga', 'Art', 'Music', 'Hiking', 'Film', 'Reading',
  'Coffee', 'Wine', 'Fitness', 'Photography', 'Dancing', 'Gaming', 'Foodie',
  'Meditation', 'Fashion', 'Tech', 'Concerts', 'Museums', 'Nature', 'Dogs', 'Cats',
];

const VIBE_OPTIONS = [
  'Intellectual', 'Creative', 'Ambitious', 'Adventurous', 'Calm', 'Humorous',
  'Witty', 'Grounded', 'Spontaneous', 'Passionate', 'Gentle', 'Confident',
  'Warm', 'Magnetic', 'Playful', 'Focused', 'Artistic', 'Deep thinker',
  'Driven', 'Empathetic', 'Free-spirited', 'Self-aware', 'Sincere',
];

const DEALMAKER_OPTIONS = [
  'Emotionally available', 'Ambitious', 'Good listener', 'Has goals',
  'Loves to travel', 'Family-oriented', 'Career-driven', 'Therapy-positive',
  'Growth mindset', 'Physically active', 'Foodie soul', 'Creatively expressive',
  'Financially stable', 'Values alone time', 'Adventurous spirit', 'Reads books',
];

const DEALBREAKER_OPTIONS = [
  'Dishonesty', 'Jealousy issues', 'No ambition', 'Controlling behavior',
  'Closed-mindedness', 'Avoidant attachment', 'Ghosting', 'Arrogance',
  'Excessive partying', 'Financial irresponsibility', 'Lack of communication',
  'Dismissiveness', 'Materialism', 'Flakiness', 'No accountability',
];

const LIKES_LIST = [
  'Deep conversations', 'Slow mornings', 'Road trips', 'Wine nights', 'Hiking',
  'Cooking together', 'Live music', 'Art galleries', 'Sunrise runs', 'Lazy Sundays',
  'Bookstores', 'New restaurants', 'Film nights', 'Spontaneous adventures',
  'Coffee rituals', 'Dancing', 'Farmers markets', 'Working out', 'Writing',
];

const DISLIKES_LIST = [
  'Flakiness', 'Rudeness', 'Indecision', 'Loud crowds', 'Negativity',
  'Lack of passion', 'Tardiness', 'Phoniness', 'Passive aggression',
  'Gossip', 'Over-scheduling', 'Sarcasm as armor', 'Ghosting', 'Small talk',
];

/* Partnership / personality-when-in-relationship questions */
const PARTNERSHIP_QUESTIONS = [
  {
    key: 'pace',
    question: "What's your relationship pace?",
    options: ['Slow burn', 'Fast & passionate', 'Steady and intentional', 'Goes with the flow'],
  },
  {
    key: 'conflict',
    question: 'How do you handle conflict in a relationship?',
    options: ['Talk it out immediately', 'Need space first, then talk', 'Avoid it when possible', 'Direct and quick resolution'],
  },
  {
    key: 'weekend',
    question: 'Your ideal weekend together looks like:',
    options: ['Adventures outside', 'Cozy stay-in', 'Mix of both', 'Whatever they want'],
  },
  {
    key: 'role',
    question: 'In a partnership, you tend to be:',
    options: ['The planner', 'The spontaneous one', 'The nurturer', 'Balanced / equal'],
  },
  {
    key: 'priority',
    question: 'What matters most to you in a partner?',
    options: ['Emotional depth', 'Physical chemistry', 'Shared values', 'Adventure & fun'],
  },
  {
    key: 'interest',
    question: 'When deeply interested in someone, you:',
    options: ['Show up consistently', 'Express it with words', 'Plan special moments', 'Give them space but stay close'],
  },
];

/* Demo/placeholder photo URLs for mock photo upload */
const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80',
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function OnboardingPage() {
  const { register } = useApp();
  const [step, setStep] = useState(0);

  /* Steps 0 & 1 — Love Language quizzes */
  const [receive, setReceive] = useState(null);
  const [give, setGive] = useState(null);

  /* Step 2 — basics */
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState([]);
  const [profileData, setProfileData] = useState({
    occupation: '', location: '', height: '', looking: '', zodiac: '', mbti: '',
    drinks: '', smoke: '', kids: '',
  });

  /* Step 3 — partnership quiz */
  const [quizAnswers, setQuizAnswers] = useState({});

  /* Step 4 — attractions */
  const [attractVibes, setAttractVibes] = useState([]);
  const [dealmakers, setDealmakers] = useState([]);

  /* Step 5 — likes + dealbreakers */
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);

  /* Step 6 — first date */
  const [firstDate, setFirstDate] = useState('');

  /* Step 7 — photos (3 required) */
  const [photos, setPhotos] = useState([null, null, null]);
  const [uploadingSlot, setUploadingSlot] = useState(null);

  /* Step 8 — ID verify */
  const [idUploaded, setIdUploaded] = useState(false);
  const [idUploading, setIdUploading] = useState(false);

  const setP = (k, v) => setProfileData(p => ({ ...p, [k]: v }));
  const toggleInterest = (i) => {
    setInterests(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : prev.length < 8 ? [...prev, i] : prev
    );
  };

  const canProceed = () => {
    if (step === 0) return !!receive;
    if (step === 1) return !!give;
    if (step === 2) return bio.length >= 20 && !!profileData.occupation;
    if (step === 3) return Object.keys(quizAnswers).length >= PARTNERSHIP_QUESTIONS.length;
    if (step === 4) return attractVibes.length >= 2 && dealmakers.length >= 1;
    if (step === 5) return likes.length >= 2 && dislikes.length >= 1;
    if (step === 6) return firstDate.trim().length >= 10 && firstDate.length <= 240;
    if (step === 7) return photos.filter(Boolean).length >= 3;
    if (step === 8) return idUploaded;
    return true;
  };

  const next = () => {
    if (step === STEPS.length - 1) {
      const data = window._signupData || {};
      register({
        name: data.name || 'New Member',
        email: data.email || '',
        dob: data.dob || '',
        nickname: nickname || data.name?.split(' ')[0] || '',
        receive, give, bio, interests, ...profileData,
        photos: photos.filter(Boolean),
        firstDate,
        personalityQuiz: quizAnswers,
        attractions: {
          vibe: attractVibes,
          dealmakers,
          dealbreakers: dislikes,
        },
        likes,
        dislikes,
        idVerified: true,
        verified: true,
      });
      return;
    }
    setStep(s => s + 1);
  };
  const prev = () => setStep(s => Math.max(0, s - 1));

  /* Simulate photo upload */
  const simulatePhotoUpload = (slotIdx) => {
    setUploadingSlot(slotIdx);
    setTimeout(() => {
      setPhotos(prev => {
        const next = [...prev];
        next[slotIdx] = DEMO_PHOTOS[slotIdx] || DEMO_PHOTOS[0];
        return next;
      });
      setUploadingSlot(null);
    }, 1000 + Math.random() * 800);
  };

  const simulateIdUpload = () => {
    setIdUploading(true);
    setTimeout(() => {
      setIdUploading(false);
      setIdUploaded(true);
    }, 1500);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  const S = {
    page: {
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 'clamp(32px, 6vw, 48px) clamp(16px, 5vw, 24px) max(80px, env(safe-area-inset-bottom, 80px))',
      background: 'linear-gradient(180deg, #0d0a14 0%, #1a0d2e 100%)',
    },
    header: { width: '100%', maxWidth: 560, marginBottom: 32 },
    card: { width: '100%', maxWidth: 560 },
    label: {
      display: 'block', fontSize: 12, fontWeight: 500,
      color: 'rgba(240,235,255,0.5)', marginBottom: 7,
      textTransform: 'uppercase', letterSpacing: '0.06em',
    },
  };

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.header}>
        <div style={{ marginBottom: 20 }}>
          <LogoFull size="sm" />
        </div>
        <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #c9815a, #d4a843)', borderRadius: 3, width: `${progress}%`, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ color: 'rgba(240,235,255,0.28)', fontSize: 12 }}>Step {step + 1} of {STEPS.length}</span>
          <span style={{ color: 'rgba(240,235,255,0.28)', fontSize: 12 }}>{Math.round(progress)}% complete</span>
        </div>
      </div>

      <div style={S.card} className="animate-fadeInUp" key={step}>

        {/* ── STEP 0: Love Language Quiz (receive) ── */}
        {step === 0 && (
          <LoveLanguageQuiz mode="receive" onComplete={(id) => { setReceive(id); setStep(1); }} />
        )}

        {/* ── STEP 1: Love Language Quiz (give) ── */}
        {step === 1 && (
          <LoveLanguageQuiz mode="give" onComplete={(id) => { setGive(id); setStep(2); }} />
        )}

        {/* ── STEP 2: Basics ── */}
        {step === 2 && (
          <div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem,5vw,2rem)', fontWeight: 700, marginBottom: 8 }}>Tell us about yourself</h2>
            <p style={{ color: 'rgba(240,235,255,0.48)', fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
              A rich profile gets 3× more matches. Be genuine — that's what makes you irresistible.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Nickname */}
              <div>
                <label style={S.label}>Nickname <span style={{ color: 'rgba(240,235,255,0.3)', textTransform: 'none', letterSpacing: 0 }}>(optional, shown in app)</span></label>
                <input className="input-dark" placeholder="What do friends call you?" value={nickname} onChange={e => setNickname(e.target.value)} />
              </div>

              {/* Bio */}
              <div>
                <label style={S.label}>Your Bio <span style={{ color: '#c9815a' }}>*</span></label>
                <textarea className="input-dark" style={{ resize: 'none' }} rows={3}
                  placeholder="Tell your story. What makes you feel alive? What are you looking for? (min. 20 chars)"
                  value={bio} onChange={e => setBio(e.target.value)} />
                <div style={{ textAlign: 'right', color: 'rgba(240,235,255,0.28)', fontSize: 12, marginTop: 4 }}>{bio.length}/300</div>
              </div>

              {/* Interests */}
              <div>
                <label style={S.label}>Interests <span style={{ color: 'rgba(240,235,255,0.3)', textTransform: 'none', letterSpacing: 0 }}>({interests.length}/8)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {INTERESTS_LIST.map(i => (
                    <button key={i} onClick={() => toggleInterest(i)}
                      style={{
                        borderRadius: 999, padding: '7px 16px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        border: interests.includes(i) ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        background: interests.includes(i) ? 'linear-gradient(135deg, #c9815a, #9b4468)' : 'rgba(255,255,255,0.04)',
                        color: interests.includes(i) ? 'white' : 'rgba(240,235,255,0.5)',
                        transition: 'all 0.15s',
                      }}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile fields grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={S.label}>Occupation <span style={{ color: '#c9815a' }}>*</span></label>
                  <input className="input-dark" placeholder="What do you do?" value={profileData.occupation} onChange={e => setP('occupation', e.target.value)} />
                </div>
                <div>
                  <label style={S.label}>Location</label>
                  <input className="input-dark" placeholder="City, State" value={profileData.location} onChange={e => setP('location', e.target.value)} />
                </div>
                <div>
                  <label style={S.label}>Height</label>
                  <input className="input-dark" placeholder='e.g. 5&apos;8"' value={profileData.height} onChange={e => setP('height', e.target.value)} />
                </div>
                <div>
                  <label style={S.label}>Zodiac</label>
                  <select className="input-dark" value={profileData.zodiac} onChange={e => setP('zodiac', e.target.value)}>
                    <option value="">Select...</option>
                    {['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].map(z => <option key={z}>{z}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>MBTI</label>
                  <select className="input-dark" value={profileData.mbti} onChange={e => setP('mbti', e.target.value)}>
                    <option value="">Select...</option>
                    {['INFJ','INFP','INTJ','INTP','ISFJ','ISFP','ISTJ','ISTP','ENFJ','ENFP','ENTJ','ENTP','ESFJ','ESFP','ESTJ','ESTP'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Looking for</label>
                  <select className="input-dark" value={profileData.looking} onChange={e => setP('looking', e.target.value)}>
                    <option value="">Select...</option>
                    {['Long-term relationship','Something serious','Casual dating','Open to anything','Deep friendship first'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Drinks</label>
                  <select className="input-dark" value={profileData.drinks} onChange={e => setP('drinks', e.target.value)}>
                    <option value="">Select...</option>
                    {['Never','Rarely','Socially','Regularly'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Kids</label>
                  <select className="input-dark" value={profileData.kids} onChange={e => setP('kids', e.target.value)}>
                    <option value="">Select...</option>
                    {["Want someday","Don't want","Have them","Open to it","Not sure yet"].map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Partnership personality quiz ── */}
        {step === 3 && (
          <div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem,5vw,2rem)', fontWeight: 700, marginBottom: 8 }}>Your personality in a relationship</h2>
            <p style={{ color: 'rgba(240,235,255,0.48)', fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
              These questions reveal how you show up as a partner — your style, pace, and priorities when you're deeply invested.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {PARTNERSHIP_QUESTIONS.map((q, qi) => (
                <div key={q.key}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: quizAnswers[q.key] ? '#f0ebff' : 'rgba(240,235,255,0.75)' }}>
                    {qi + 1}. {q.question}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {q.options.map(opt => {
                      const selected = quizAnswers[q.key] === opt;
                      return (
                        <button key={opt} onClick={() => setQuizAnswers(prev => ({ ...prev, [q.key]: opt }))}
                          style={{
                            borderRadius: 12, padding: '11px 14px', fontSize: 13, cursor: 'pointer', textAlign: 'left',
                            border: selected ? '2px solid #c9815a' : '1px solid rgba(255,255,255,0.08)',
                            background: selected ? 'rgba(201,129,90,0.12)' : 'rgba(255,255,255,0.035)',
                            color: selected ? '#e8b89a' : 'rgba(240,235,255,0.6)',
                            fontWeight: selected ? 600 : 400,
                            transition: 'all 0.18s',
                          }}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right', color: 'rgba(240,235,255,0.28)', fontSize: 12, marginTop: 16 }}>
              {Object.keys(quizAnswers).length}/{PARTNERSHIP_QUESTIONS.length} answered
            </div>
          </div>
        )}

        {/* ── STEP 4: What attracts you ── */}
        {step === 4 && (
          <div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem,5vw,2rem)', fontWeight: 700, marginBottom: 8 }}>What draws you in?</h2>
            <p style={{ color: 'rgba(240,235,255,0.48)', fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
              This powers your Smart Scan — we'll match you with people whose energy and values align with what you're genuinely attracted to.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Vibes */}
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  The vibe I'm attracted to <span style={{ color: '#c9815a' }}>*</span>
                </div>
                <div style={{ color: 'rgba(240,235,255,0.38)', fontSize: 12, marginBottom: 12 }}>
                  Pick at least 2 — up to 6 ({attractVibes.length}/6)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {VIBE_OPTIONS.map(v => {
                    const sel = attractVibes.includes(v);
                    return (
                      <button key={v} onClick={() => setAttractVibes(prev =>
                        prev.includes(v) ? prev.filter(x => x !== v) : prev.length < 6 ? [...prev, v] : prev
                      )} style={{
                        borderRadius: 999, padding: '7px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        border: sel ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        background: sel ? 'linear-gradient(135deg, #c9815a, #9b4468)' : 'rgba(255,255,255,0.04)',
                        color: sel ? 'white' : 'rgba(240,235,255,0.55)',
                        transition: 'all 0.15s',
                      }}>
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dealmakers */}
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  My ideal partner… <span style={{ color: '#c9815a' }}>*</span>
                </div>
                <div style={{ color: 'rgba(240,235,255,0.38)', fontSize: 12, marginBottom: 12 }}>
                  Select traits and qualities you're drawn to ({dealmakers.length}/5)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {DEALMAKER_OPTIONS.map(d => {
                    const sel = dealmakers.includes(d);
                    return (
                      <button key={d} onClick={() => setDealmakers(prev =>
                        prev.includes(d) ? prev.filter(x => x !== d) : prev.length < 5 ? [...prev, d] : prev
                      )} style={{
                        borderRadius: 999, padding: '7px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        border: sel ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                        background: sel ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
                        color: sel ? '#6ee7b7' : 'rgba(240,235,255,0.55)',
                        transition: 'all 0.15s',
                      }}>
                        {sel && <span style={{ marginRight: 4 }}>✓</span>}{d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: Likes & Dealbreakers ── */}
        {step === 5 && (
          <div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem,5vw,2rem)', fontWeight: 700, marginBottom: 8 }}>Your world at a glance</h2>
            <p style={{ color: 'rgba(240,235,255,0.48)', fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
              Your likes and dealbreakers help our algorithm find people who genuinely click with your lifestyle — and filter out who won't.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Likes */}
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  Things I'm into <span style={{ color: '#c9815a' }}>*</span>
                </div>
                <div style={{ color: 'rgba(240,235,255,0.38)', fontSize: 12, marginBottom: 12 }}>
                  Pick at least 2 ({likes.length}/8)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {LIKES_LIST.map(l => {
                    const sel = likes.includes(l);
                    return (
                      <button key={l} onClick={() => setLikes(prev =>
                        prev.includes(l) ? prev.filter(x => x !== l) : prev.length < 8 ? [...prev, l] : prev
                      )} style={{
                        borderRadius: 999, padding: '7px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        border: sel ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        background: sel ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'rgba(255,255,255,0.04)',
                        color: sel ? 'white' : 'rgba(240,235,255,0.55)',
                        transition: 'all 0.15s',
                      }}>
                        {l}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dealbreakers */}
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  My dealbreakers <span style={{ color: '#c9815a' }}>*</span>
                </div>
                <div style={{ color: 'rgba(240,235,255,0.38)', fontSize: 12, marginBottom: 12 }}>
                  Be honest — this protects your time ({dislikes.length}/5)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {DEALBREAKER_OPTIONS.map(d => {
                    const sel = dislikes.includes(d);
                    return (
                      <button key={d} onClick={() => setDislikes(prev =>
                        prev.includes(d) ? prev.filter(x => x !== d) : prev.length < 5 ? [...prev, d] : prev
                      )} style={{
                        borderRadius: 999, padding: '7px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        border: sel ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)',
                        background: sel ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)',
                        color: sel ? '#fca5a5' : 'rgba(240,235,255,0.55)',
                        transition: 'all 0.15s',
                      }}>
                        {sel && <span style={{ marginRight: 4 }}>✗</span>}{d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 6: First date answer ── */}
        {step === 6 && (
          <div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem,5vw,2rem)', fontWeight: 700, marginBottom: 8 }}>What would we do for our first date?</h2>
            <p style={{ color: 'rgba(240,235,255,0.48)', fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
              This is your opening move for anyone who wants to message you before matching. Make it intriguing — 10 to 240 characters.
            </p>

            <div style={{ position: 'relative' }}>
              <textarea className="input-dark" style={{ resize: 'none', paddingBottom: 36 }} rows={5}
                placeholder="e.g. Coffee at a bookshop tucked away from the world, then a slow walk where we lose track of time…"
                value={firstDate}
                onChange={e => setFirstDate(e.target.value.slice(0, 240))}
              />
              <div style={{
                position: 'absolute', bottom: 10, right: 14, fontSize: 12,
                color: firstDate.length > 220 ? '#c9815a' : 'rgba(240,235,255,0.28)',
              }}>
                {firstDate.length}/240
              </div>
            </div>

            {firstDate.length > 0 && firstDate.length < 10 && (
              <p style={{ color: '#e8b89a', fontSize: 12, marginTop: 8 }}>Please write at least 10 characters.</p>
            )}

            {/* Preview */}
            {firstDate.trim().length >= 10 && (
              <div className="glass-card" style={{ borderRadius: 16, padding: '16px 18px', marginTop: 16 }}>
                <div style={{ fontSize: 11, color: 'rgba(240,235,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>How this appears in your profile</div>
                <p style={{ color: 'rgba(240,235,255,0.78)', fontSize: 13.5, lineHeight: 1.7, fontStyle: 'italic' }}>"{firstDate}"</p>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 7: 3 Required Photos ── */}
        {step === 7 && (
          <div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem,5vw,2rem)', fontWeight: 700, marginBottom: 8 }}>Add your photos</h2>
            <p style={{ color: 'rgba(240,235,255,0.48)', fontSize: 13, marginBottom: 8, lineHeight: 1.6 }}>
              3 photos are required to create your profile. These help matches feel a real connection before saying hello.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: photos[i] ? '#10b981' : 'rgba(255,255,255,0.15)', transition: 'background 0.3s' }} />
              ))}
              <span style={{ color: 'rgba(240,235,255,0.35)', fontSize: 12, marginLeft: 4 }}>
                {photos.filter(Boolean).length} / 3 uploaded
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[0, 1, 2].map(i => (
                <div key={i} onClick={() => !photos[i] && uploadingSlot !== i && simulatePhotoUpload(i)}
                  style={{
                    aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden', cursor: photos[i] ? 'default' : 'pointer',
                    border: photos[i] ? '2px solid #10b981' : '2px dashed rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                    transition: 'border-color 0.2s',
                  }}>
                  {photos[i] ? (
                    <>
                      <img src={photos[i]} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} color="white" strokeWidth={3} />
                      </div>
                    </>
                  ) : uploadingSlot === i ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 28, height: 28, border: '2px solid rgba(201,129,90,0.3)', borderTopColor: '#c9815a', borderRadius: '50%', margin: '0 auto 8px', animation: 'spin 0.8s linear infinite' }} />
                      <div style={{ color: 'rgba(240,235,255,0.4)', fontSize: 11 }}>Uploading…</div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                        {i === 0 ? <Camera size={16} color="rgba(240,235,255,0.4)" /> : <Upload size={14} color="rgba(240,235,255,0.4)" />}
                      </div>
                      <div style={{ color: 'rgba(240,235,255,0.35)', fontSize: 11 }}>{i === 0 ? 'Main photo' : `Photo ${i + 1}`}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p style={{ color: 'rgba(240,235,255,0.25)', fontSize: 11, marginTop: 16, lineHeight: 1.6 }}>
              All photos are reviewed against our community guidelines. Tap each slot to upload.
            </p>
          </div>
        )}

        {/* ── STEP 8: ID Verification ── */}
        {step === 8 && (
          <div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem,5vw,2rem)', fontWeight: 700, marginBottom: 8 }}>Verify your identity</h2>
            <p style={{ color: 'rgba(240,235,255,0.48)', fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
              DateUs requires ID verification to keep everyone safe. Your document is encrypted and never shared with other users.
            </p>

            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
              {[
                { icon: '🔒', title: 'End-to-end encrypted', body: 'Your ID is never stored unencrypted.' },
                { icon: '🙈', title: 'Never shown to matches', body: 'Only used for age and identity check.' },
                { icon: '✅', title: 'Gets you the Verified badge', body: 'Stand out with a verified profile.' },
                { icon: '⚡', title: 'Instant review', body: 'Usually approved in under 60 seconds.' },
              ].map(b => (
                <div key={b.title} className="glass-card" style={{ borderRadius: 14, padding: '14px 16px' }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{b.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>{b.title}</div>
                  <div style={{ color: 'rgba(240,235,255,0.38)', fontSize: 11, lineHeight: 1.5 }}>{b.body}</div>
                </div>
              ))}
            </div>

            {idUploaded ? (
              <div style={{ borderRadius: 18, padding: '24px 20px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Check size={24} color="white" strokeWidth={3} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#6ee7b7', marginBottom: 4 }}>Identity Verified!</div>
                <div style={{ color: 'rgba(240,235,255,0.42)', fontSize: 12.5 }}>Your profile will show the Verified badge.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button onClick={simulateIdUpload} disabled={idUploading}
                  style={{
                    width: '100%', borderRadius: 16, padding: '20px', cursor: idUploading ? 'default' : 'pointer',
                    border: '2px dashed rgba(201,129,90,0.35)', background: 'rgba(201,129,90,0.06)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    transition: 'background 0.2s',
                  }}>
                  {idUploading ? (
                    <>
                      <div style={{ width: 28, height: 28, border: '2px solid rgba(201,129,90,0.3)', borderTopColor: '#c9815a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      <span style={{ color: '#e8b89a', fontSize: 13 }}>Verifying…</span>
                    </>
                  ) : (
                    <>
                      <Shield size={28} color="#c9815a" />
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#e8b89a' }}>Upload Government ID</span>
                      <span style={{ color: 'rgba(240,235,255,0.35)', fontSize: 12 }}>Driver's license, passport, or national ID</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 9: Done ── */}
        {step === 9 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'linear-gradient(135deg, #c9815a, #9b4468)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', animation: 'heartbeat 2.2s ease-in-out infinite',
            }}>
              <Heart size={38} fill="white" color="white" />
            </div>
            <h2 className="font-serif gradient-text-hero" style={{ fontSize: 'clamp(1.7rem,5vw,2.2rem)', fontWeight: 700, marginBottom: 12 }}>You're ready!</h2>
            <p style={{ color: 'rgba(240,235,255,0.48)', fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>
              Your profile is complete. Time to meet someone who truly speaks your language.
            </p>

            {/* Summary card */}
            <div className="glass-card" style={{ borderRadius: 22, padding: 24, textAlign: 'left', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'rgba(240,235,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Your Love Language Blueprint</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                {receive && (
                  <span className={`ll-badge-${receive}`} style={{ borderRadius: 999, padding: '7px 14px', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <LLIcon id={receive} size={14} />
                    I need {LOVE_LANGUAGES.find(l => l.id === receive)?.shortName}
                  </span>
                )}
                {give && (
                  <span className={`ll-badge-${give}`} style={{ borderRadius: 999, padding: '7px 14px', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <LLIcon id={give} size={14} />
                    I give {LOVE_LANGUAGES.find(l => l.id === give)?.shortName}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ borderRadius: 999, padding: '5px 12px', fontSize: 11, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  ✓ ID Verified
                </div>
                <div style={{ borderRadius: 999, padding: '5px 12px', fontSize: 11, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  ✓ {photos.filter(Boolean).length} Photos
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation (hidden on quiz steps 0 & 1) ── */}
        {step > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32 }}>
            <button className="btn-ghost" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }} onClick={prev}>
              <ArrowLeft size={15} /> Back
            </button>
            <button className="btn-primary" style={{ padding: '13px 32px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, opacity: canProceed() ? 1 : 0.38, cursor: canProceed() ? 'pointer' : 'default' }}
              onClick={next} disabled={!canProceed()}>
              {step === STEPS.length - 1 ? (
                <><Heart size={16} fill="white" color="white" /> Find My Matches</>
              ) : (
                <>Continue <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
