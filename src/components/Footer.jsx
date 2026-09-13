import React from 'react';
import { MENU_DATA } from '../data/menuData';

export function Footer() {
  return (
    <footer className="bg-[#F8F9FA] dark:bg-[#09090B] border-t border-zinc-200 dark:border-[#23232E] py-10 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-glovo-yellow text-zinc-950 flex items-center justify-center font-display font-black text-xs shadow-xs">
            ЧР
          </div>
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            © 2026 ЧЕБУROOM (@cheburoom.zp) — Запоріжжя
          </span>
        </div>

        <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 font-semibold">
          <a
            href={MENU_DATA.info.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
          >
            Instagram
          </a>
          <span>•</span>
          <a
            href={`tel:${MENU_DATA.info.phoneRaw}`}
            className="hover:text-amber-500 transition-colors"
          >
            {MENU_DATA.info.phone}
          </a>
        </div>
      </div>
    </footer>
  );
}
