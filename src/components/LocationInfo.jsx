import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { MENU_DATA } from '../data/menuData';

export function LocationInfo() {
  return (
    <section className="py-10 sm:py-16 bg-white dark:bg-rnr-dark border-t border-zinc-200 dark:border-rnr-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          <div className="lg:col-span-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold mb-3 sm:mb-4 border border-pink-200 dark:border-pink-900/40 cursor-default"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@cheburoom.zp в Instagram</span>
            </motion.div>

            <h2 className="font-display text-2xl min-[360px]:text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white mb-3 sm:mb-4 leading-tight">
              Вулична їжа, якою пишаються.
            </h2>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-rnr-text leading-relaxed mb-5 sm:mb-6">
              Ми створили ЧЕБУROOM у центрі Запоріжжя з однією метою: показати, що чебуреки можуть бути вишуканою міською гастрономією. Чиста свіжа олія, тонке тісто без зайвого жиру та соковиті начинки зі 100% фермерського м'яса.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                href={MENU_DATA.info.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-11 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <InstagramIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">Instagram @cheburoom.zp</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                href={`tel:${MENU_DATA.info.phoneRaw}`}
                className="w-full sm:w-auto h-11 px-4 sm:px-5 rounded-2xl bg-zinc-100 dark:bg-rnr-card hover:bg-zinc-200 dark:hover:bg-rnr-surface text-zinc-950 dark:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-zinc-200 dark:border-rnr-border cursor-pointer shadow-xs"
              >
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{MENU_DATA.info.phone}</span>
              </motion.a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-zinc-50 dark:bg-rnr-card rounded-3xl p-4 sm:p-8 border border-zinc-200 dark:border-rnr-border space-y-4 text-xs">
              <h3 className="font-display font-bold text-base sm:text-lg text-zinc-950 dark:text-white flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span>Локація та режим роботи</span>
              </h3>

              {/* Interactive Google Map with exact point replacing written address */}
              <div className="relative rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-rnr-border shadow-xs">
                <iframe
                  title="ЧЕБУROOM на карті Google"
                  src="https://maps.google.com/maps?q=47.8226185,35.1722815+(%D0%A7%D0%B5%D0%B1%D1%83ROOM)&t=&z=18&ie=UTF8&iwloc=B&output=embed"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-56 block"
                />

                {/* Floating location tag banner over map */}
                <div className="absolute top-2.5 left-2.5 bg-white/95 dark:bg-rnr-dark/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-200/80 dark:border-rnr-border shadow-sm flex items-center gap-2 pointer-events-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block text-[11px] leading-tight">
                      ЧЕБУROOM • вул. Олександрівська, 75
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block leading-tight">
                      Запоріжжя
                    </span>
                  </div>
                </div>

                {/* Open in Google Maps link button */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  href="https://maps.app.goo.gl/9LYDJF5hJfDkPg2dA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2.5 right-2.5 bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-zinc-900 dark:text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-md backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Відкрити в Google Maps</span>
                </motion.a>
              </div>

              {/* Working hours */}
              <div className="p-4 bg-white dark:bg-rnr-dark rounded-2xl border border-zinc-200/80 dark:border-rnr-border">
                <div className="font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Графік роботи кухні:</span>
                </div>
                <div className="text-zinc-500 dark:text-rnr-text mt-1">{MENU_DATA.info.hours}</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
