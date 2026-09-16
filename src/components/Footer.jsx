import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Lock } from 'lucide-react';
import { CheburoomLogo } from './CheburoomLogo';
import { useBrand, toggleBrandMode } from '../config/brandingConfig';

export function Footer() {
  const brand = useBrand();
  const { navigateTo } = useCart();

  return (
    <footer className="bg-[#F8F9FA] dark:bg-[#09090B] border-t border-zinc-200 dark:border-[#23232E] py-10 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheburoomLogo size="sm" />
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            {brand.copyright}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 text-zinc-600 dark:text-zinc-400 font-semibold">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#admin"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('admin');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-200/80 dark:bg-[#181820] hover:bg-amber-400 hover:text-zinc-950 dark:hover:bg-amber-400 dark:hover:text-zinc-950 text-zinc-700 dark:text-zinc-300 font-bold transition-all cursor-pointer shadow-2xs border border-zinc-300/60 dark:border-[#262632]"
            title="Окреме посилання для персоналу ресторану"
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Вхід для персоналу</span>
          </motion.a>

          {brand.instagram && (
            <>
              <span>•</span>
              <motion.a
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.95 }}
                href={brand.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition-colors cursor-pointer"
              >
                Instagram
              </motion.a>
            </>
          )}

          {brand.phone && (
            <>
              <span>•</span>
              <motion.a
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${brand.phoneRaw}`}
                className="hover:text-amber-500 transition-colors cursor-pointer"
              >
                {brand.phone}
              </motion.a>
            </>
          )}

          <span>•</span>
          <button
            type="button"
            onClick={() => toggleBrandMode()}
            title="Перемкнути брендування (Демо / Чебуroom)"
            className="text-[10px] text-zinc-400 hover:text-amber-500 transition-colors opacity-50 hover:opacity-100 cursor-pointer"
          >
            🏷️ {brand.isDemo ? 'Демо' : 'Чебуroom'}
          </button>
        </div>
      </div>
    </footer>
  );
}
