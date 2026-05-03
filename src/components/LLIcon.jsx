/**
 * LLIcon — 5 custom SVG icons, one per Love Language.
 * Each uses the brand color system. Size is passed as a number (px).
 * Used consistently everywhere: badges, cards, onboarding, profile, discovery.
 */

const ICONS = {
  words: ({ size, color, light }) => (
    // Words of Affirmation — speech bubble with a heart inside
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ll-words-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      {/* Bubble body */}
      <path d="M6 8C6 5.79 7.79 4 10 4H30C32.21 4 34 5.79 34 8V22C34 24.21 32.21 26 30 26H22L16 34V26H10C7.79 26 6 24.21 6 22V8Z"
        fill={`url(#ll-words-g)`} opacity="0.18" />
      <path d="M6 8C6 5.79 7.79 4 10 4H30C32.21 4 34 5.79 34 8V22C34 24.21 32.21 26 30 26H22L16 34V26H10C7.79 26 6 24.21 6 22V8Z"
        stroke={color} strokeWidth="1.8" fill="none" />
      {/* Heart inside bubble */}
      <path d="M20 21C20 21 13 16.5 13 12.5C13 10.57 14.57 9 16.5 9C17.74 9 18.82 9.66 19.5 10.67L20 11.38L20.5 10.67C21.18 9.66 22.26 9 23.5 9C25.43 9 27 10.57 27 12.5C27 16.5 20 21 20 21Z"
        fill={color} />
    </svg>
  ),

  acts: ({ size, color, light }) => (
    // Acts of Service — two hands reaching toward each other
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ll-acts-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      {/* Left hand reaching right */}
      <path d="M3 23C3 23 3 20 6 20C8 20 8.5 21 9 22C9.5 21 10 19.5 12 19.5C13.5 19.5 14.5 20.5 14.5 22V20.5C14.5 19 15.5 18 17 18C18.5 18 19 19 19 20.5V19C19 17.5 20 16.5 21.5 16.5"
        stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M3 23V27C3 28.5 4 30 5.5 30H17C18.5 30 19 29 19 27.5V20.5"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Right hand reaching left — mirrored */}
      <path d="M37 23C37 23 37 20 34 20C32 20 31.5 21 31 22C30.5 21 30 19.5 28 19.5C26.5 19.5 25.5 20.5 25.5 22V20.5C25.5 19 24.5 18 23 18C21.5 18 21 19 21 20.5V19C21 17.5 20 16.5 18.5 16.5"
        stroke={light} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M37 23V27C37 28.5 36 30 34.5 30H23C21.5 30 21 29 21 27.5V20.5"
        stroke={light} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Center spark */}
      <circle cx="20" cy="18" r="2.5" fill={`url(#ll-acts-g)`} />
    </svg>
  ),

  gifts: ({ size, color, light }) => (
    // Receiving Gifts — wrapped present with ribbon & bow
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ll-gifts-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      {/* Box body */}
      <rect x="6" y="18" width="28" height="18" rx="2" fill={`url(#ll-gifts-g)`} opacity="0.15" stroke={color} strokeWidth="1.8" />
      {/* Lid */}
      <rect x="4" y="13" width="32" height="7" rx="2" fill={`url(#ll-gifts-g)`} opacity="0.25" stroke={color} strokeWidth="1.8" />
      {/* Vertical ribbon */}
      <line x1="20" y1="13" x2="20" y2="36" stroke={color} strokeWidth="2.5" />
      {/* Horizontal ribbon on lid */}
      <line x1="4" y1="16.5" x2="36" y2="16.5" stroke={color} strokeWidth="2.5" />
      {/* Bow left loop */}
      <path d="M20 13C20 13 15 12 13 8C11.5 5 14 3 16 5C17.5 6.5 18.5 10 20 13Z"
        stroke={color} strokeWidth="1.8" fill={light} opacity="0.5" strokeLinejoin="round" />
      {/* Bow right loop */}
      <path d="M20 13C20 13 25 12 27 8C28.5 5 26 3 24 5C22.5 6.5 21.5 10 20 13Z"
        stroke={color} strokeWidth="1.8" fill={light} opacity="0.5" strokeLinejoin="round" />
      {/* Knot */}
      <circle cx="20" cy="13" r="2.2" fill={color} />
    </svg>
  ),

  time: ({ size, color, light }) => (
    // Quality Time — hourglass with heart sand
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ll-time-g" x1="20" y1="4" x2="20" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      {/* Top cap */}
      <rect x="9" y="4" width="22" height="3.5" rx="1.75" fill={color} opacity="0.7" />
      {/* Bottom cap */}
      <rect x="9" y="32.5" width="22" height="3.5" rx="1.75" fill={color} opacity="0.7" />
      {/* Hourglass outline */}
      <path d="M11 7.5L20 20L29 7.5" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      <path d="M11 32.5L20 20L29 32.5" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      {/* Upper sand fill */}
      <path d="M13 9L20 18L27 9Z" fill={`url(#ll-time-g)`} opacity="0.25" />
      {/* Lower sand pool */}
      <path d="M13.5 31L20 22L26.5 31Z" fill={`url(#ll-time-g)`} opacity="0.6" />
      {/* Heart falling in center */}
      <path d="M20 20C20 20 16.5 17 16.5 14.8C16.5 13.3 17.7 12 19 12C19.7 12 20.3 12.4 20.7 13L21 13.4L21.3 13C21.7 12.4 22.3 12 23 12C24.3 12 25.5 13.3 25.5 14.8C25.5 17 20 20 20 20Z"
        fill={light} opacity="0.9" />
    </svg>
  ),

  touch: ({ size, color, light }) => (
    // Physical Touch — two fingerprints/thumbs merging with a pulse
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ll-touch-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      {/* Left hand / palm */}
      <ellipse cx="14" cy="26" rx="7" ry="8" fill={`url(#ll-touch-g)`} opacity="0.15" stroke={color} strokeWidth="1.6" />
      {/* Left index finger */}
      <rect x="17" y="12" width="4" height="14" rx="2" fill={`url(#ll-touch-g)`} opacity="0.2" stroke={color} strokeWidth="1.6" />
      {/* Right hand / palm */}
      <ellipse cx="26" cy="26" rx="7" ry="8" fill={`url(#ll-touch-g)`} opacity="0.15" stroke={light} strokeWidth="1.6" />
      {/* Right index finger */}
      <rect x="19" y="12" width="4" height="14" rx="2" fill={`url(#ll-touch-g)`} opacity="0.2" stroke={light} strokeWidth="1.6" />
      {/* Touching point — pulse ring */}
      <circle cx="20" cy="12" r="4.5" stroke={color} strokeWidth="1.4" fill={color} opacity="0.15" />
      <circle cx="20" cy="12" r="2.5" fill={`url(#ll-touch-g)`} opacity="0.9" />
      {/* Pulse lines */}
      <path d="M4 20H10L12 15L16 25L18 20H22L24 17L26 23L28 20H36"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
    </svg>
  ),
};

export const LL_COLORS = {
  words: { color: '#c9815a', light: '#e8b89a', bg: 'rgba(201,129,90,0.12)', border: 'rgba(201,129,90,0.3)' },
  acts:  { color: '#3b82f6', light: '#93c5fd', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)' },
  gifts: { color: '#d4a843', light: '#f0d080', bg: 'rgba(212,168,67,0.12)',  border: 'rgba(212,168,67,0.3)' },
  time:  { color: '#10b981', light: '#6ee7b7', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)' },
  touch: { color: '#8b5cf6', light: '#c4b5fd', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.3)' },
};

/**
 * @param {string} id - one of: words | acts | gifts | time | touch
 * @param {number} size - icon size in px (default 28)
 * @param {boolean} showBg - wrap in a colored background tile
 */
export default function LLIcon({ id, size = 28, showBg = false, bgSize = 48 }) {
  const c = LL_COLORS[id];
  if (!c) return null;
  const Render = ICONS[id];
  if (!Render) return null;

  if (showBg) {
    return (
      <div
        style={{
          width: bgSize,
          height: bgSize,
          borderRadius: 14,
          background: c.bg,
          border: `1px solid ${c.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Render size={size} color={c.color} light={c.light} />
      </div>
    );
  }

  return <Render size={size} color={c.color} light={c.light} />;
}
