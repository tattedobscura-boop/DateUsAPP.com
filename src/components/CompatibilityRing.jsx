import { getCompatibilityScore, getCompatibilityLabel } from '../data/loveLangauges';

export default function CompatibilityRing({ give1, receive1, give2, receive2, size = 80, score: scoreProp, color: colorProp, label: labelProp }) {
  const score = scoreProp !== undefined ? scoreProp : getCompatibilityScore(give1, receive1, give2, receive2);
  const { label, color } = scoreProp !== undefined
    ? { label: labelProp || '', color: colorProp || '#c9815a' }
    : getCompatibilityLabel(score);

  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
          <circle
            cx={size/2} cy={size/2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={5}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-white" style={{ fontSize: size * 0.22 }}>{score}%</span>
        </div>
      </div>
      {label && <span className="text-xs font-medium" style={{ color }}>{label}</span>}
    </div>
  );
}
