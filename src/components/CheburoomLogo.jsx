import React from 'react';
import { motion } from 'framer-motion';
import { NEON_PATHS } from './neonPaths';

/**
 * Authentic Cheburoom Neon Logo
 * Hand-drawn vector replica based directly on the restaurant's physical neon signage (@cheburoom.zp)
 */
export function CheburoomLogo({ variant = 'horizontal', showSubtitle = true, className = '' }) {
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        <svg
          viewBox={`0 0 ${NEON_PATHS.stackedWidth} ${NEON_PATHS.stackedHeight}`}
          className="w-full h-auto max-w-[220px] drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
          fill="none"
        >
          <defs>
            <filter id="neon-glow-stacked" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feGaussianBlur stdDeviation="2.5" result="blur1" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ambient Glow */}
          <g filter="url(#neon-glow-stacked)" opacity="0.8">
            {NEON_PATHS.stackedPaths.map((d, i) => (
              <path key={`glow-${i}`} d={d} stroke="#d97706" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </g>

          {/* Warm Amber Tube */}
          <g>
            {NEON_PATHS.stackedPaths.map((d, i) => (
              <path key={`tube-${i}`} d={d} stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </g>

          {/* Bright Hot Core */}
          <g opacity="0.95">
            {NEON_PATHS.stackedPaths.map((d, i) => (
              <path key={`core-${i}`} d={d} stroke="#fffbeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </g>
        </svg>

        {showSubtitle && (
          <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 tracking-[0.2em] uppercase mt-1 text-center">
            Крафтова чебуречна • Запоріжжя
          </span>
        )}
      </div>
    );
  }

  // Default: Horizontal header brand logo
  return (
    <div className={`flex flex-col select-none group cursor-pointer ${className}`}>
      <div className="flex items-center gap-2">
        {/* The Drawn Vector Neon Sign */}
        <div className="relative h-9 sm:h-10 w-auto flex items-center">
          <svg
            viewBox={`0 0 ${NEON_PATHS.horizWidth} ${NEON_PATHS.horizHeight}`}
            className="h-full w-auto overflow-visible transition-all duration-300 group-hover:scale-[1.02]"
            fill="none"
            aria-label="ЧЕБУROOM"
          >
            <defs>
              <filter id="neon-glow-horiz" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur2" />
                <feGaussianBlur stdDeviation="2" result="blur1" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ambient Background Glow */}
            <g filter="url(#neon-glow-horiz)" opacity="0.75" className="transition-opacity duration-300 group-hover:opacity-100">
              {/* ЧЕБУ glow */}
              {NEON_PATHS.chebuPaths.map((d, i) => (
                <path key={`chebu-glow-${i}`} d={d} stroke="#d97706" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              ))}
              {/* ROOM glow */}
              {NEON_PATHS.roomPaths.map((d, i) => (
                <path key={`room-glow-${i}`} d={d} stroke="#b45309" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              ))}
            </g>

            {/* Neon Tube Outline Body */}
            <g>
              {/* ЧЕБУ: warm golden amber bubble tube */}
              {NEON_PATHS.chebuPaths.map((d, i) => (
                <path key={`chebu-tube-${i}`} d={d} stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              ))}
              {/* ROOM: sleek illuminated tube (adaptive in dark/light) */}
              {NEON_PATHS.roomPaths.map((d, i) => (
                <path 
                  key={`room-tube-${i}`} 
                  d={d} 
                  stroke="currentColor" 
                  className="text-amber-500 dark:text-amber-400"
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              ))}
            </g>

            {/* Bright Luminous Tube Core */}
            <g opacity="0.95">
              {/* ЧЕБУ core */}
              {NEON_PATHS.chebuPaths.map((d, i) => (
                <path key={`chebu-core-${i}`} d={d} stroke="#fffbeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              ))}
              {/* ROOM core */}
              {NEON_PATHS.roomPaths.map((d, i) => (
                <path key={`room-core-${i}`} d={d} stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {showSubtitle && (
        <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-[0.18em] uppercase -mt-0.5 leading-none transition-colors group-hover:text-amber-500">
          Крафтова чебуречна • Запоріжжя
        </span>
      )}
    </div>
  );
}

export default CheburoomLogo;
