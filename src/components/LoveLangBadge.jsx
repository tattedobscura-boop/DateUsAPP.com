import { LOVE_LANGUAGES } from '../data/loveLangauges';

export function LoveLangBadge({ id, size = 'md', showLabel = true, type = 'receive' }) {
  const ll = LOVE_LANGUAGES.find(l => l.id === id);
  if (!ll) return null;
  const sizes = {
    sm: 'px-2.5 py-1 text-xs gap-1',
    md: 'px-3.5 py-1.5 text-xs gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2',
  };
  return (
    <span className={`ll-badge-${id} rounded-full font-medium inline-flex items-center ${sizes[size]}`}>
      <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>{ll.emoji}</span>
      {showLabel && <span>{type === 'receive' ? 'Receives' : 'Gives'}: {ll.shortName}</span>}
    </span>
  );
}

export function LoveLangDot({ id, size = 8 }) {
  const ll = LOVE_LANGUAGES.find(l => l.id === id);
  if (!ll) return null;
  return (
    <span
      className="inline-block rounded-full"
      style={{ width: size, height: size, background: ll.color }}
      title={ll.name}
    />
  );
}
