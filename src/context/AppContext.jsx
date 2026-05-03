import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockUsers';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const STORAGE_KEY = 'dateus_user';
const FREE_SWIPES = 10;   // per day for free users
const PASS_COOLDOWN_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

/* ── Plan definitions ──────────────────────────────────────────────────── */
export const PLANS = {
  free: {
    id: 'free', name: 'Free', price: null,
    swipesPerDay: FREE_SWIPES, likesTotal: 50, maxChats: 5,
    color: 'rgba(255,255,255,0.25)', colorLight: 'rgba(255,255,255,0.55)',
  },
  gold: {
    id: 'gold', name: 'Ardor', price: null,
    swipesPerDay: Infinity, likesTotal: Infinity, maxChats: Infinity,
    color: '#d4a843', colorLight: '#f0d080', canMessageFirst: true,
  },
  echelon: {
    id: 'echelon', name: 'Echelon', price: 33.33,
    swipesPerDay: Infinity, likesTotal: 250, maxChats: 50,
    color: '#8b5cf6', colorLight: '#c4b5fd', canMessageFirst: true,
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  },
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function AppProvider({ children }) {
  const [currentUser,    setCurrentUser]    = useState(null);
  const [page,           setPage]           = useState('landing');
  const [authMode,       setAuthMode]       = useState('signup');
  const [appTab,         setAppTab]         = useState('discover');
  const [matches,        setMatches]        = useState([]);
  const [likedProfiles,  setLikedProfiles]  = useState([]);
  // passedProfiles: { [profileId]: isoTimestamp } — 90-day cooldown
  const [passedProfiles, setPassedProfiles] = useState({});
  const [messages,       setMessages]       = useState({});
  const [notifications,  setNotifications]  = useState([]);
  const [activeChat,     setActiveChat]     = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [blockedUsers,   setBlockedUsers]   = useState([]);
  const [proximityLog,   setProximityLog]   = useState([]);
  const [reports,        setReports]        = useState([]);
  const [swipeQuota,     setSwipeQuota]     = useState({ date: todayKey(), used: 0 });
  const [firstMessages,  setFirstMessages]  = useState({});

  /* ── Load from storage ── */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setCurrentUser(d.user);
        setMatches(d.matches || []);
        setLikedProfiles(d.liked || []);
        setPassedProfiles(d.passed || {});
        setMessages(d.messages || {});
        setBlockedUsers(d.blocked || []);
        setProximityLog(d.proximityLog || []);
        setReports(d.reports || []);
        const q = d.swipeQuota || { date: todayKey(), used: 0 };
        setSwipeQuota(q.date === todayKey() ? q : { date: todayKey(), used: 0 });
        setFirstMessages(d.firstMessages || {});
        setPage('app');
      } catch {}
    }
  }, []);

  const save = (user, mList, liked, passed, msgs, blocked, pLog, reps, quota, fMsgs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user,
      matches: mList,
      liked,
      passed: passed ?? passedProfiles,
      messages: msgs,
      blocked,
      proximityLog: pLog,
      reports: reps,
      swipeQuota: quota,
      firstMessages: fMsgs ?? firstMessages,
    }));
  };

  /* ── Plan helpers ── */
  const userPlan = PLANS[currentUser?.plan] || (currentUser?.premium ? PLANS.gold : PLANS.free);
  const canMessageFirst = userPlan.canMessageFirst ?? false;

  const markFirstMessage = (toId) => {
    const updated = { ...firstMessages, [toId]: true };
    setFirstMessages(updated);
    save(currentUser, matches, likedProfiles, passedProfiles, messages, blockedUsers, proximityLog, reports, swipeQuota, updated);
  };

  const swipesLeft = userPlan.swipesPerDay === Infinity
    ? Infinity
    : Math.max(0, userPlan.swipesPerDay - (swipeQuota.date === todayKey() ? swipeQuota.used : 0));

  const likesUsed   = likedProfiles.length;
  const likeBudget  = userPlan.likesTotal;
  const likesLeft   = likeBudget === Infinity ? Infinity : Math.max(0, likeBudget - likesUsed);
  const maxChats    = userPlan.maxChats;
  const activeChats = Object.keys(messages).length;

  /* ── Proximity logging ── */
  const logProximity = (profileId) => {
    const profile = MOCK_USERS.find(u => u.id === profileId);
    if (!profile) return;
    const dist = parseFloat(profile.distance);
    if (!isNaN(dist) && dist <= 10) {
      const entry = { profileId, at: new Date().toISOString(), distance: profile.distance };
      const newLog = [...proximityLog, entry];
      setProximityLog(newLog);
      save(currentUser, matches, likedProfiles, passedProfiles, messages, blockedUsers, newLog, reports, swipeQuota);
    }
  };

  /* ── Demo login ── */
  const demoLogin = () => {
    const demo = {
      id: 'me', name: 'Alex Rivera', nickname: 'Lexie',
      email: 'demo@dateus.app', occupation: 'Creative Director',
      location: 'New York, NY', receive: 'words', give: 'time',
      bio: "I believe the most intimate thing two people can share is undivided presence. I'll plan the perfect evening — you just bring yourself.",
      interests: ['Travel', 'Music', 'Cooking', 'Film', 'Art'],
      photos: [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80',
      ],
      height: "5'7\"", looking: 'Long-term relationship', zodiac: 'Libra', mbti: 'ENFJ',
      drinks: 'Socially', smoke: 'Never', kids: 'Open to it',
      premium: false, verified: true, idVerified: true,
      firstDate: "Coffee at a hidden bookshop, then a walk through the city at dusk — I love finding beauty in small moments.",
      personalityQuiz: { pace: 'Slow burn', conflict: 'Talk it out immediately', weekend: 'Mix of both', role: 'The planner', priority: 'Emotional depth', interest: 'Show up consistently' },
      likes: ['Art', 'Music', 'Travel', 'Cooking', 'Film', 'Deep conversations', 'Coffee', 'Slow mornings'],
      dislikes: ['Ghosting', 'Flakiness', 'Negativity'],
      attractions: {
        vibe: ['Creative', 'Intellectual', 'Warm', 'Passionate', 'Empathetic'],
        dealmakers: ['Emotionally available', 'Creatively expressive', 'Growth mindset', 'Loves to travel'],
        dealbreakers: ['Dishonesty', 'Closed-mindedness', 'Flakiness'],
      },
      joinDate: new Date().toISOString(),
    };
    const autoMatches = MOCK_USERS.slice(0, 4).map(u => u.id);
    const quota = { date: todayKey(), used: 0 };
    setCurrentUser(demo);
    setMatches(autoMatches);
    setPassedProfiles({});
    setSwipeQuota(quota);
    save(demo, autoMatches, [], {}, {}, [], [], [], quota, {});
    setPage('app');
    setAppTab('discover');
  };

  /* ── Register ── */
  const register = (userData) => {
    const newUser = {
      id: 'me', ...userData,
      joinDate: new Date().toISOString(),
      photos: userData.photos || [],
      premium: false,
    };
    setCurrentUser(newUser);
    const autoMatches = MOCK_USERS.filter(u =>
      u.give === userData.receive || u.receive === userData.give
    ).slice(0, 4).map(u => u.id);
    const quota = { date: todayKey(), used: 0 };
    setMatches(autoMatches);
    setPassedProfiles({});
    setSwipeQuota(quota);
    save(newUser, autoMatches, [], {}, {}, [], [], [], quota, {});
    setPage('app');
    setAppTab('discover');
  };

  /* ── Logout ── */
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null); setMatches([]); setLikedProfiles([]);
    setPassedProfiles({}); setMessages({}); setBlockedUsers([]);
    setProximityLog([]); setPage('landing');
  };

  /* ── Like ── */
  const likeProfile = (profileId) => {
    if (likeBudget !== Infinity && likesUsed >= likeBudget) return false;
    let newQuota = swipeQuota;
    if (userPlan.swipesPerDay !== Infinity) {
      const today = todayKey();
      const used = (swipeQuota.date === today ? swipeQuota.used : 0) + 1;
      newQuota = { date: today, used };
      setSwipeQuota(newQuota);
    }
    const newLiked = [...likedProfiles, profileId];
    setLikedProfiles(newLiked);
    logProximity(profileId);
    const isMatch = Math.random() > 0.4;
    let newMatches = matches;
    if (isMatch && !matches.includes(profileId)) {
      newMatches = [...matches, profileId];
      setMatches(newMatches);
      setNotifications(prev => [...prev, {
        id: Date.now(), type: 'match', profileId,
        message: `You matched with ${MOCK_USERS.find(u => u.id === profileId)?.name?.split(' ')[0]}!`,
        read: false,
      }]);
    }
    save(currentUser, newMatches, newLiked, passedProfiles, messages, blockedUsers, proximityLog, reports, newQuota);
    return isMatch;
  };

  /* ── Pass — 90-day cooldown ── */
  const passProfile = (profileId) => {
    let newQuota = swipeQuota;
    if (userPlan.swipesPerDay !== Infinity) {
      const today = todayKey();
      const used = (swipeQuota.date === today ? swipeQuota.used : 0) + 1;
      newQuota = { date: today, used };
      setSwipeQuota(newQuota);
    }
    const newPassed = { ...passedProfiles, [profileId]: new Date().toISOString() };
    setPassedProfiles(newPassed);
    logProximity(profileId);
    save(currentUser, matches, likedProfiles, newPassed, messages, blockedUsers, proximityLog, reports, newQuota);
  };

  /* ── Check if a profile is still in 90-day cooldown ── */
  const isPassedRecently = (profileId) => {
    const at = passedProfiles[profileId];
    if (!at) return false;
    return Date.now() - new Date(at).getTime() < PASS_COOLDOWN_MS;
  };

  /* ── Recycle likes (Echelon only) ── */
  const recycleLikes = () => {
    setLikedProfiles([]);
    save(currentUser, matches, [], passedProfiles, messages, blockedUsers, proximityLog, reports, swipeQuota);
  };

  /* ── Upgrade plan ── */
  const upgradePlan = (planId) => {
    if (!PLANS[planId]) return;
    const updated = { ...currentUser, plan: planId, premium: planId !== 'free' };
    setCurrentUser(updated);
    save(updated, matches, likedProfiles, passedProfiles, messages, blockedUsers, proximityLog, reports, swipeQuota);
  };

  /* ── Send message ── */
  const sendMessage = (toId, text) => {
    const msg = { id: Date.now(), from: 'me', text, timestamp: new Date().toISOString() };
    const updated = { ...messages, [toId]: [...(messages[toId] || []), msg] };
    setMessages(updated);
    save(currentUser, matches, likedProfiles, passedProfiles, updated, blockedUsers, proximityLog, reports, swipeQuota);
    setTimeout(() => {
      const profile = MOCK_USERS.find(u => u.id === toId);
      if (!profile) return;
      const replies = profile.replies || ["I feel the same way 💫", "That's so sweet 🥰", "Tell me more!", "I love that about you ✨", "You're amazing 😍"];
      const reply = { id: Date.now() + 1, from: toId, text: replies[Math.floor(Math.random() * replies.length)], timestamp: new Date().toISOString() };
      setMessages(prev => ({ ...prev, [toId]: [...(prev[toId] || []), reply] }));
    }, 1200 + Math.random() * 1800);
  };

  /* ── Block ── */
  const blockUser = (userId) => {
    const newBlocked = [...blockedUsers, userId];
    setBlockedUsers(newBlocked);
    const newMatches = matches.filter(id => id !== userId);
    setMatches(newMatches);
    if (activeChat?.id === userId) setActiveChat(null);
    if (viewingProfile?.id === userId) setViewingProfile(null);
    save(currentUser, newMatches, likedProfiles, passedProfiles, messages, newBlocked, proximityLog, reports, swipeQuota);
  };

  const isBlocked = (userId) => blockedUsers.includes(userId);

  /* ── Report ── */
  const reportUser = (userId, reason) => {
    const entry = { userId, reason, at: new Date().toISOString() };
    const newReports = [...reports, entry];
    setReports(newReports);
    save(currentUser, matches, likedProfiles, passedProfiles, messages, blockedUsers, proximityLog, newReports, swipeQuota);
  };

  /* ── Misc ── */
  const markNotificationsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const updateProfile = (updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    save(updated, matches, likedProfiles, passedProfiles, messages, blockedUsers, proximityLog, reports, swipeQuota);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      currentUser, page, setPage,
      authMode, setAuthMode,
      appTab, setAppTab,
      matches, likedProfiles, passedProfiles,
      messages, notifications, unreadNotifications,
      activeChat, setActiveChat,
      viewingProfile, setViewingProfile,
      blockedUsers, proximityLog,
      swipesLeft, swipeQuota,
      userPlan, likesLeft, likesUsed, likeBudget, maxChats, activeChats,
      register, demoLogin, logout,
      likeProfile, passProfile, isPassedRecently, sendMessage,
      blockUser, isBlocked, reportUser,
      markNotificationsRead, updateProfile,
      recycleLikes, upgradePlan,
      canMessageFirst, firstMessages, markFirstMessage,
    }}>
      {children}
    </AppContext.Provider>
  );
}
