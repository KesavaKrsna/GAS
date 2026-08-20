import React from 'react';

const SPARKS = [
  { top: '12%', left: '8%', size: 5, delay: '0s', duration: '4.2s' },
  { top: '22%', left: '78%', size: 4, delay: '0.6s', duration: '5.1s' },
  { top: '38%', left: '18%', size: 6, delay: '1.1s', duration: '3.8s' },
  { top: '58%', left: '88%', size: 5, delay: '0.3s', duration: '4.8s' },
  { top: '70%', left: '12%', size: 3, delay: '1.8s', duration: '5.4s' },
  { top: '16%', left: '52%', size: 4, delay: '2.1s', duration: '4.4s' },
  { top: '46%', left: '64%', size: 7, delay: '0.9s', duration: '6s' },
  { top: '82%', left: '42%', size: 4, delay: '1.4s', duration: '3.6s' },
  { top: '28%', left: '92%', size: 3, delay: '2.4s', duration: '4.9s' },
  { top: '74%', left: '72%', size: 5, delay: '0.2s', duration: '5.7s' },
];

export function SparkField({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold animate-spark"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
            boxShadow: '0 0 10px rgba(251,178,38,0.85)',
          }}
        />
      ))}
    </div>
  );
}
