import React from 'react';
import { motion } from 'framer-motion';
import { NEON_SIGN } from './neonSignData';
import { useBrand } from '../config/brandingConfig';

/**
 * Pure Neon Logo Component (Dual-Mode: White-Label Demo & Authentic Cheburoom)
 * Specifically optimized with dual-tone contrast layers to be 100% legible on both White and Black themes.
 */
export function CheburoomLogo({ size = 'md', className = '' }) {
  const brand = useBrand();

  const heightClasses = {
    sm: 'h-9 sm:h-10',
    md: 'h-11 sm:h-13',
    lg: 'h-14 sm:h-16'
  };

  const heightClass = heightClasses[size] || heightClasses.md;

  if (brand.isDemo) {
    return (
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        className={`relative inline-flex items-center gap-2.5 select-none cursor-pointer group ${heightClass} ${className}`}
        aria-label="Логотип КРАФТ & CHEBUR"
      >
        <div className={`rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-zinc-950 font-black shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all ${
          size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9 sm:w-10 sm:h-10'
        }`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-zinc-950" stroke="currentColor" strokeWidth="0.5">
            <path d="M3 16C4.5 9 10 4 19 3C19.5 7.5 18 13.5 13 18C8.5 22 4.5 20 3 16Z" />
            <circle cx="9" cy="11" r="1.1" fill="#FEF08A" />
            <circle cx="13" cy="9" r="1.3" fill="#FEF08A" />
            <circle cx="12" cy="13" r="1" fill="#FEF08A" />
          </svg>
        </div>
        <div className="flex flex-col text-left justify-center">
          <span className={`font-display font-black tracking-tight leading-none text-zinc-950 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors ${
            size === 'sm' ? 'text-xs sm:text-sm' : size === 'lg' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base font-black'
          }`}>
            КРАФТ <span className="text-amber-500">&</span> CHEBUR
          </span>
          <span className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 mt-0.5">
            Street Food Kitchen
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer group ${heightClass} ${className}`}
      aria-label="Логотип ЧЕБУROOM"
    >
      <svg
        viewBox={`0 0 ${NEON_SIGN.width} ${NEON_SIGN.height}`}
        className="h-full w-auto overflow-visible transition-all duration-300 drop-shadow-[0_1px_3px_rgba(120,53,15,0.3)] dark:drop-shadow-[0_0_14px_rgba(245,158,11,0.7)] group-hover:drop-shadow-[0_2px_8px_rgba(180,83,9,0.4)] dark:group-hover:drop-shadow-[0_0_22px_rgba(245,158,11,0.95)]"
        fill="none"
      >
        <defs>
          <filter id="neon-ambient-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" result="glowBlur" />
            <feMerge>
              <feMergeNode in="glowBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ========================================================================= */}
        {/* Layer 1: Contrast Outline (Ensures razor-sharp readability on WHITE theme) */}
        {/* ========================================================================= */}
        <g 
          className="text-[#7c2d12] dark:text-[#ea580c] opacity-90 dark:opacity-40 transition-colors"
          stroke="currentColor" 
          strokeWidth="11" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* ЧЕБУ */}
          <path d={NEON_SIGN.che} />
          <path d={NEON_SIGN.e} />
          <path d={NEON_SIGN.b} />
          <path d={NEON_SIGN.bDot} strokeWidth="8" />
          <path d={NEON_SIGN.u} />

          {/* ROOM */}
          <path d={NEON_SIGN.r} />
          <circle cx={NEON_SIGN.o1.cx} cy={NEON_SIGN.o1.cy} r={NEON_SIGN.o1.r} />
          <circle cx={NEON_SIGN.o2.cx} cy={NEON_SIGN.o2.cy} r={NEON_SIGN.o2.r} />
          <path d={NEON_SIGN.m} />
        </g>

        {/* ========================================================================= */}
        {/* Layer 2: Main Warm Amber Neon Glass Tube                                   */}
        {/* ========================================================================= */}
        <g 
          className="text-[#d97706] dark:text-[#f59e0b] transition-colors"
          stroke="currentColor" 
          strokeWidth="6.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* ЧЕБУ */}
          <path d={NEON_SIGN.che} />
          <path d={NEON_SIGN.e} />
          <path d={NEON_SIGN.b} />
          <path d={NEON_SIGN.bDot} strokeWidth="4.5" />
          <path d={NEON_SIGN.u} />

          {/* ROOM */}
          <path d={NEON_SIGN.r} strokeWidth="5.5" />
          <circle cx={NEON_SIGN.o1.cx} cy={NEON_SIGN.o1.cy} r={NEON_SIGN.o1.r} strokeWidth="5.5" />
          <circle cx={NEON_SIGN.o2.cx} cy={NEON_SIGN.o2.cy} r={NEON_SIGN.o2.r} strokeWidth="5.5" />
          <path d={NEON_SIGN.m} strokeWidth="5.5" />
        </g>

        {/* ========================================================================= */}
        {/* Layer 3: Vibrant Bright Golden Luster                                     */}
        {/* ========================================================================= */}
        <g 
          stroke="#fbbf24" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="opacity-95 dark:opacity-100"
        >
          {/* ЧЕБУ */}
          <path d={NEON_SIGN.che} />
          <path d={NEON_SIGN.e} />
          <path d={NEON_SIGN.b} />
          <path d={NEON_SIGN.bDot} strokeWidth="2.5" />
          <path d={NEON_SIGN.u} />

          {/* ROOM */}
          <path d={NEON_SIGN.r} strokeWidth="3" />
          <circle cx={NEON_SIGN.o1.cx} cy={NEON_SIGN.o1.cy} r={NEON_SIGN.o1.r} strokeWidth="3" />
          <circle cx={NEON_SIGN.o2.cx} cy={NEON_SIGN.o2.cy} r={NEON_SIGN.o2.r} strokeWidth="3" />
          <path d={NEON_SIGN.m} strokeWidth="3" />
        </g>

        {/* ========================================================================= */}
        {/* Layer 4: Hot Glowing White Gas Core (Pure Neon Light Center)              */}
        {/* ========================================================================= */}
        <g 
          stroke="#ffffff" 
          strokeWidth="1.6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          opacity="0.95"
        >
          {/* ЧЕБУ */}
          <path d={NEON_SIGN.che} />
          <path d={NEON_SIGN.e} />
          <path d={NEON_SIGN.b} />
          <path d={NEON_SIGN.bDot} strokeWidth="1.2" />
          <path d={NEON_SIGN.u} />

          {/* ROOM */}
          <path d={NEON_SIGN.r} strokeWidth="1.3" />
          <circle cx={NEON_SIGN.o1.cx} cy={NEON_SIGN.o1.cy} r={NEON_SIGN.o1.r} strokeWidth="1.3" />
          <circle cx={NEON_SIGN.o2.cx} cy={NEON_SIGN.o2.cy} r={NEON_SIGN.o2.r} strokeWidth="1.3" />
          <path d={NEON_SIGN.m} strokeWidth="1.3" />
        </g>
      </svg>
    </motion.div>
  );
}

export default CheburoomLogo;
