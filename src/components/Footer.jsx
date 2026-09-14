import React from 'react';
import { motion } from 'framer-motion';
import { MENU_DATA } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { FileSpreadsheet } from 'lucide-react';
import { CheburoomLogo } from './CheburoomLogo';

export function Footer() {
  const { setIsAdminOpen, sheetId } = useCart();

  return (
    <footer className="bg-[#F8F9FA] dark:bg-[#09090B] border-t border-zinc-200 dark:border-[#23232E] py-10 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheburoomLogo showSubtitle={false} />
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            © 2026 ЧЕБУROOM (@cheburoom.zp) — Запоріжжя
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 text-zinc-600 dark:text-zinc-400 font-semibold">
          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-200/80 dark:bg-[#181820] hover:bg-amber-400 hover:text-zinc-950 dark:hover:bg-amber-400 dark:hover:text-zinc-950 text-zinc-700 dark:text-zinc-300 font-bold transition-all cursor-pointer shadow-2xs border border-zinc-300/60 dark:border-[#262632]"
            title="Керування меню через Google Таблиці"
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${sheetId ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-zinc-400'}`} />
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Google Таблиця</span>
          </button>

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
