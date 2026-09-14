import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Sparkles, Plus, Clock, Bike, ShieldCheck, ArrowRight } from 'lucide-react';
import { MENU_DATA } from '../data/menuData';

export function Hero() {
  const { addItem, setSelectedDishForModal } = useCart();
  const signatureDish = MENU_DATA.items.find(i => i.id === 'cheb-pulled-beef') || MENU_DATA.items[0];

  return (
    <section className="relative pt-6 pb-10 sm:py-12 bg-[#F8F9FA] dark:bg-[#09090B] border-b border-zinc-200 dark:border-[#23232E] overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Headline & Delivery Badges */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Quick Delivery Tag */}
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-glovo-yellow text-zinc-950 font-bold text-xs mb-5 shadow-sm animate-float select-none"
            >
              <Bike className="w-4 h-4 text-zinc-950" />
              <span>Швидка доставка по Запоріжжю за 25–40 хв</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-zinc-950 dark:text-white leading-[1.12] mb-4 tracking-tight"
            >
              Гарячі крафтові чебуреки прямо до дверей
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed mb-6"
            >
              Тонке пухирчасте тісто, багато соковитого рубаного м'яса та ароматного бульйону. Готуємо під ваше замовлення!
            </motion.p>

            {/* Delivery Info Chips (Glovo / RnR style) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 text-left">
              <motion.div 
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="bg-white dark:bg-[#121215] p-2.5 sm:p-3 rounded-2xl border border-zinc-200/80 dark:border-[#23232E] shadow-xs hover:shadow-md hover:border-amber-400/50 transition-colors cursor-pointer select-none group"
              >
                <Clock className="w-4 h-4 text-amber-500 mb-1 group-hover:scale-120 group-hover:rotate-12 transition-transform duration-300" />
                <div className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">Час доставки</div>
                <div className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white whitespace-nowrap">25-40 хв</div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="bg-white dark:bg-[#121215] p-2.5 sm:p-3 rounded-2xl border border-zinc-200/80 dark:border-[#23232E] shadow-xs hover:shadow-md hover:border-emerald-400/50 transition-colors cursor-pointer select-none group"
              >
                <Bike className="w-4 h-4 text-emerald-500 mb-1 group-hover:scale-120 group-hover:-rotate-12 transition-transform duration-300" />
                <div className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">Доставка</div>
                <div className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white whitespace-nowrap">від 0 ₴</div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="bg-white dark:bg-[#121215] p-2.5 sm:p-3 rounded-2xl border border-zinc-200/80 dark:border-[#23232E] shadow-xs hover:shadow-md hover:border-blue-400/50 transition-colors cursor-pointer select-none group"
              >
                <ShieldCheck className="w-4 h-4 text-blue-500 mb-1 group-hover:scale-120 group-hover:rotate-12 transition-transform duration-300" />
                <div className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">Фермерське</div>
                <div className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white whitespace-nowrap">100% м'ясо</div>
              </motion.div>
            </div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
            >
              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                href="#menu-catalog"
                className="h-12 px-7 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-extrabold text-sm btn-glow-yellow animate-shimmer flex items-center justify-center gap-2 w-full sm:w-auto group cursor-pointer shadow-sm whitespace-nowrap"
              >
                <span>Перейти до меню</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                href="tel:+380951991599"
                className="h-12 px-6 rounded-2xl bg-white dark:bg-[#121215] hover:bg-zinc-100 dark:hover:bg-[#1A1A22] text-zinc-900 dark:text-white border border-zinc-200 dark:border-[#23232E] hover:border-amber-400 dark:hover:border-amber-500/40 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 w-full sm:w-auto shadow-xs cursor-pointer whitespace-nowrap"
              >
                <span>Зателефонувати у заклад</span>
              </motion.a>
            </motion.div>

          </div>

          {/* Right Column: Hero Signature Dish Showcase */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-md mx-auto lg:max-w-none"
            >
              <div className="bg-white dark:bg-[#121215] p-4 sm:p-6 rounded-3xl shadow-xl border border-zinc-200/80 dark:border-[#23232E] relative overflow-hidden group card-interactive">
                
                {/* Visual Glow */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-colors" />

                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-zinc-950 shadow-xs group-hover:scale-105 transition-transform">
                    <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                    Хіт №1 продажу
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {signatureDish ? signatureDish.weight : '180 г'}
                  </span>
                </div>

                {/* Hero Product Image */}
                <div 
                  className="relative h-52 sm:h-64 rounded-2xl overflow-hidden mb-3.5 sm:mb-4 cursor-pointer bg-zinc-100 dark:bg-zinc-950"
                  onClick={() => signatureDish && setSelectedDishForModal(signatureDish)}
                >
                  <img
                    src={signatureDish?.image || '/images/dishes/cheb-pulled-beef.jpg'}
                    alt={signatureDish?.name || 'Чебурек з рваною телятиною'}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                    <span className="text-xs font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                      Томлена телятина &bull; Гарячий бульйон
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="min-w-0 pr-2">
                    <h3 className="font-display font-bold text-base sm:text-lg text-zinc-950 dark:text-white group-hover:text-amber-500 transition-colors truncate">
                      {signatureDish?.name || 'Чебурек з рваною телятиною'}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">
                      {signatureDish?.shortDesc || 'Тонке хрустке тісто з пухирцями'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-display text-xl sm:text-2xl font-black text-zinc-950 dark:text-white whitespace-nowrap">
                      {signatureDish ? signatureDish.price : 119} ₴
                    </span>
                  </div>
                </div>

                <div className="pt-3.5 sm:pt-4 border-t border-zinc-100 dark:border-[#23232E] flex items-center justify-between gap-2 sm:gap-3">
                  <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Фритюр або Янтик без олії</span>
                  </span>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    onClick={() => signatureDish && addItem(signatureDish)}
                    className="h-10 px-4 sm:px-5 rounded-xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 text-xs font-bold btn-glow-yellow flex items-center gap-1.5 cursor-pointer group/btn shadow-sm shrink-0 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 text-zinc-950 group-hover/btn:rotate-90 group-hover/btn:scale-125 transition-transform duration-200" />
                    <span>В кошик</span>
                  </motion.button>
                </div>

              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
