'use client';

import { ReactNode } from 'react';

export function Marquee({ children, speed = 30 }: { children: ReactNode; speed?: number }) {
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className="flex shrink-0 items-center gap-16 pr-16 [animation:marquee_var(--duration)_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ '--duration': `${speed}s` } as React.CSSProperties}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className="flex shrink-0 items-center gap-16 pr-16 [animation:marquee_var(--duration)_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ '--duration': `${speed}s` } as React.CSSProperties}
      >
        {children}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
