import React from 'react';
import { motion } from 'framer-motion';
import { NEON_SIGN } from './neonSignData';

/**
 * Authentic Cheburoom Neon Sign Component
 * 100% vector replica drawn directly from the restaurant's iconic physical neon signage (@cheburoom.zp)
 */
export function CheburoomLogo({ showTagline = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* The Illuminated Neon Sign Plate (matches the restaurant mesh wall & warm neon tubes) */}
      <motion.div
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        className="relative h-12 sm:h-13 px-2.5 py-1.5 rounded-2xl bg-[#0D0C10] border border-amber-500/40 shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/30 overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:border-amber-400 group-hover:shadow-amber-500/45 group-hover:ring-amber-400/50"
      >
        {/* Wire mesh texture matching the real photo background */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(245, 158, 11, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(245, 158, 11, 0.15) 1px, transparent 1px)`,
            backgroundSize: '6px 6px'
          }}
        />

        {/* Warm backlight radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.28),transparent_75%)] pointer-events-none" />

        {/* Vector Neon Tubes */}
        <svg
          viewBox={`0 0 ${NEON_SIGN.width} ${NEON_SIGN.height}`}
          className="h-full w-auto max-w-[85px] sm:max-w-[95px] overflow-visible relative z-10"
          fill="none"
          aria-label="ЧЕБУROOM"
        >
          <defs>
            <filter id="authentic-neon-glow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="10" result="blur2" />
              <feGaussianBlur stdDeviation="3" result="blur1" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Layer 1: Ambient Neon Bloom Glow */}
          <g filter="url(#authentic-neon-glow)" opacity="0.65" className="transition-opacity duration-300 group-hover:opacity-100">
            <path d={NEON_SIGN.che} stroke="#ea580c" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d={NEON_SIGN.e} stroke="#ea580c" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d={NEON_SIGN.b} stroke="#ea580c" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d={NEON_SIGN.bDot} stroke="#ea580c" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <path d={NEON_SIGN.u} stroke="#ea580c" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />

            <path d={NEON_SIGN.r} stroke="#d97706" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={NEON_SIGN.o1.cx} cy={NEON_SIGN.o1.cy} r={NEON_SIGN.o1.r} stroke="#d97706" strokeWidth="14" />
            <circle cx={NEON_SIGN.o2.cx} cy={NEON_SIGN.o2.cy} r={NEON_SIGN.o2.r} stroke="#d97706" strokeWidth="14" />
            <path d={NEON_SIGN.m} stroke="#d97706" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Layer 2: Warm Amber Glass Tubes */}
          <g>
            <path d={NEON_SIGN.che} stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <path d={NEON_SIGN.e} stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <path d={NEON_SIGN.b} stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <path d={NEON_SIGN.bDot} stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={NEON_SIGN.u} stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />

            <path d={NEON_SIGN.r} stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={NEON_SIGN.o1.cx} cy={NEON_SIGN.o1.cy} r={NEON_SIGN.o1.r} stroke="#fbbf24" strokeWidth="6" />
            <circle cx={NEON_SIGN.o2.cx} cy={NEON_SIGN.o2.cy} r={NEON_SIGN.o2.r} stroke="#fbbf24" strokeWidth="6" />
            <path d={NEON_SIGN.m} stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Layer 3: Hot Glowing White Gas Core */}
          <g opacity="0.95">
            <path d={NEON_SIGN.che} stroke="#fffbeb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={NEON_SIGN.e} stroke="#fffbeb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={NEON_SIGN.b} stroke="#fffbeb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={NEON_SIGN.bDot} stroke="#fffbeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d={NEON_SIGN.u} stroke="#fffbeb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            <path d={NEON_SIGN.r} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={NEON_SIGN.o1.cx} cy={NEON_SIGN.o1.cy} r={NEON_SIGN.o1.r} stroke="#ffffff" strokeWidth="2" />
            <circle cx={NEON_SIGN.o2.cx} cy={NEON_SIGN.o2.cy} r={NEON_SIGN.o2.r} stroke="#ffffff" strokeWidth="2" />
            <path d={NEON_SIGN.m} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>

        {/* Hover shimmer sheen */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      </motion.div>

      {/* Brand Name & Location Tagline */}
      {showTagline && (
        <div className="flex flex-col text-left">
          <span className="font-display font-black text-xl sm:text-2xl tracking-wide leading-none text-zinc-950 dark:text-white group-hover:text-amber-500 transition-colors">
            ЧЕБУ<span className="text-amber-500">ROOM</span>
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase mt-1 leading-none">
            Крафтова чебуречна • Запоріжжя
          </span>
        </div>
      )}
    </div>
  );
}

export default CheburoomLogo;
