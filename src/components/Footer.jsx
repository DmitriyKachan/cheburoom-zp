import React from 'react';
import { motion } from 'framer-motion';
import { MENU_DATA } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { Lock } from 'lucide-react';
import { CheburoomLogo } from './CheburoomLogo';

export function Footer() {
  const { navigateTo } = useCart();

  return (
    <footer className="bg-[#F8F9FA] dark:bg-[#09090B] border-t border-zinc-200 dark:border-[#23232E] py-10 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <CheburoomLogo showSubtitle={false} size="sm" />
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            © 2026 ЧЕБУROOM (@cheburoom.zp) — Запоріжжя
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-3.5 text-zinc-600 dark:text-zinc-400 font-semibold">
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

          <span>•</span>

          <motion.a
            whileHover={{ scale: 1.08, y: -1 }}
            whileTap={{ scale: 0.95 }}
            href={MENU_DATA.info.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors cursor-pointer"
          >
            Instagram
          </motion.a>
          <span>•</span>
          <motion.a
            whileHover={{ scale: 1.08, y: -1 }}
            whileTap={{ scale: 0.95 }}
            href={`tel:${MENU_DATA.info.phoneRaw}`}
            className="hover:text-amber-500 transition-colors cursor-pointer"
          >
            {MENU_DATA.info.phone}
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
