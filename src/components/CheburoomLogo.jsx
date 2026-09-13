import React from 'react';
import { motion } from 'framer-motion';

/**
 * Cheburoom Neon Logo Component
 * Recreates the iconic glowing amber neon sign from the restaurant (@cheburoom.zp)
 */
export function CheburoomLogo({ size = 'md', showText = true, className = '' }) {
  const sizeMap = {
    sm: {
      badge: 'w-9 h-9 rounded-xl',
      title: 'text-lg',
      sub: 'text-[9px]'
    },
    md: {
      badge: 'w-11 h-11 sm:w-12 sm:h-12 rounded-2xl',
      title: 'text-xl sm:text-2xl',
      sub: 'text-[10px]'
    },
    lg: {
      badge: 'w-16 h-16 rounded-3xl',
      title: 'text-3xl',
      sub: 'text-xs'
    }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Authentic Neon Sign Emblem Badge */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: 2 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={`relative ${currentSize.badge} bg-[#0D0D11] border border-amber-500/40 shadow-md shadow-amber-500/25 ring-1 ring-amber-400/30 overflow-hidden shrink-0 flex items-center justify-center select-none group-hover:border-amber-400 group-hover:shadow-amber-500/50 group-hover:ring-amber-400/60 transition-all duration-300`}
      >
        {/* Dark mesh grid texture overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)`,
            backgroundSize: '4px 4px'
          }}
        />

        {/* Ambient neon tube warm glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-600/20 via-orange-500/10 to-transparent pointer-events-none" />

        {/* Neon sign image */}
        <img
          src="/images/cheburoom-neon-badge.png"
          alt="ЧЕБУROOM Неон"
          className="w-full h-full object-cover relative z-10 transition-transform duration-300 group-hover:scale-105"
          loading="eager"
        />

        {/* Hover shimmer overlay */}
        <div className="absolute inset-0 bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20" />
      </motion.div>

      {/* Styled Neon Typography Wordmark */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-baseline leading-none">
            <span 
              className={`font-display font-black ${currentSize.title} tracking-wider text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.55)] transition-all`}
            >
              ЧЕБУ
            </span>
            <span 
              className={`font-display font-extrabold ${currentSize.title} tracking-widest text-zinc-950 dark:text-white ml-1 drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]`}
            >
              ROOM
            </span>
          </div>
          <span 
            className={`${currentSize.sub} text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase mt-1 leading-none select-none`}
          >
            Крафтова чебуречна • Запоріжжя
          </span>
        </div>
      )}
    </div>
  );
}

export default CheburoomLogo;
