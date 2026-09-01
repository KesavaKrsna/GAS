import React from 'react';

export function LotusMark({ className = 'w-24 h-24', gold = true }: { className?: string; gold?: boolean }) {
  const fill = gold ? 'rgba(251,178,38,0.9)' : 'currentColor';
  return (
    <svg viewBox="0 0 120 120" className={className} fill={fill} aria-hidden>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg}
          cx={60}
          cy={60}
          rx={9}
          ry={24}
          style={{ transformOrigin: '60px 60px', transform: `rotate(${deg}deg) translateY(-16px)` }}
        />
      ))}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={`i${deg}`}
          cx={60}
          cy={60}
          rx={6}
          ry={16}
          opacity={0.75}
          style={{ transformOrigin: '60px 60px', transform: `rotate(${deg}deg) translateY(-9px)` }}
        />
      ))}
      <circle cx={60} cy={60} r={9} />
    </svg>
  );
}

export function MandalaBackdrop({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vh] h-[85vh] rounded-full border border-gold/20 animate-ring" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[58vh] h-[58vh] rounded-full border border-gold/15" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32vh] h-[32vh] rounded-full border border-orange/20" />
      <div className="absolute inset-0 mandala-rings opacity-[0.07]" />
    </div>
  );
}
