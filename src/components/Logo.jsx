/**
 * DateUs Logo
 *
 * LogoMark — a stylised "D" formed by two interlocking arcs that create
 * an implicit heart in the negative space.  Clean, memorable, scalable.
 *
 * Palette:
 *   Rose-champagne  #e8b89a → #c9815a (warm left arc)
 *   Deep rose       #c9815a → #9b4468 (right arc / overlap)
 *   Gold accent     #d4a843             (spark dot)
 */

export function LogoMark({ size = 36 }) {
  const id = `du-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DateUs"
    >
      <defs>
        {/* Left arc — warm champagne → rose */}
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#e8b89a" />
          <stop offset="100%" stopColor="#c9815a" />
        </linearGradient>
        {/* Right arc — rose → deep plum */}
        <linearGradient id={`${id}-b`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c9815a" />
          <stop offset="100%" stopColor="#9b4468" />
        </linearGradient>
        {/* Gold spark */}
        <linearGradient id={`${id}-c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#f0d080" />
          <stop offset="100%" stopColor="#d4a843" />
        </linearGradient>
        {/* Glow filter */}
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/*
        The mark reads as a bold "D" rotated ~10°.
        Two thick arcs lean into each other — the gap between them
        naturally forms a heart silhouette.
      */}

      {/* ── Left arc (opening of the D) ── */}
      <path
        d="M14 8
           C6 8 4 15 4 24
           C4 33 6 40 14 40
           L18 40
           C10 40 8 33 8 24
           C8 15 10 8 18 8
           Z"
        fill={`url(#${id}-a)`}
        opacity="0.95"
      />

      {/* ── Right arc (curve of the D) ── */}
      <path
        d="M18 8
           C30 8 44 14 44 24
           C44 34 30 40 18 40
           L22 40
           C32 40 40 34 40 24
           C40 14 32 8 22 8
           Z"
        fill={`url(#${id}-b)`}
        opacity="0.93"
      />

      {/* ── Heart cutout — negative-space heart formed by the two inner curves ── */}
      {/* We draw a white-ish heart over the overlap to create the illusion */}
      <path
        d="M24 36
           C24 36 12 27 12 20
           C12 15.5 15.5 13 19 13
           C21 13 23 14.5 24 16
           C25 14.5 27 13 29 13
           C32.5 13 36 15.5 36 20
           C36 27 24 36 24 36Z"
        fill="#120e1c"
        opacity="0.82"
      />

      {/* ── Inner heart fill — the actual visible heart ── */}
      <path
        d="M24 33
           C24 33 14.5 25.5 14.5 19.5
           C14.5 16.2 17 14.5 19.5 14.5
           C21.2 14.5 23 15.8 24 17.2
           C25 15.8 26.8 14.5 28.5 14.5
           C31 14.5 33.5 16.2 33.5 19.5
           C33.5 25.5 24 33 24 33Z"
        fill={`url(#${id}-a)`}
        filter={`url(#${id}-glow)`}
        opacity="0.9"
      />

      {/* ── Gold spark — top of heart dip ── */}
      <circle
        cx="24"
        cy="14"
        r="2.2"
        fill={`url(#${id}-c)`}
        opacity="0.95"
      />
    </svg>
  );
}

export function LogoFull({ size = 'md', className = '' }) {
  const sizes = {
    sm: { mark: 26, fontSize: 15 },
    md: { mark: 32, fontSize: 18 },
    lg: { mark: 40, fontSize: 22 },
    xl: { mark: 52, fontSize: 28 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className={className}>
      <LogoMark size={s.mark} />
      <span
        style={{
          fontFamily: 'Playfair Display, serif',
          fontWeight: 700,
          fontSize: s.fontSize,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          background: 'linear-gradient(135deg, #e8b89a 0%, #c9815a 40%, #d4a843 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          whiteSpace: 'nowrap',
        }}
      >
        DateUs
      </span>
    </div>
  );
}
