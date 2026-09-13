import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Clock, Percent, ArrowRight } from 'lucide-react';

export function PromoBanners() {
  const banners = [
    {
      id: 1,
      title: 'Хрусткі чебуреки за 25 хв',
      subtitle: 'Гарячі, соковиті, щойно з фритюру',
      tag: 'Швидка доставка',
      bgGradient: 'from-amber-500 via-amber-400 to-yellow-300 text-zinc-950',
      tagBg: 'bg-zinc-950 text-white',
      image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=400&q=80',
      badge: '🔥 ТОП'
    },
    {
      id: 2,
      title: '-10% при самовивозі',
      subtitle: 'Запоріжжя, пр. Соборний, 142',
      tag: 'Забирай сам',
      bgGradient: 'from-emerald-600 to-teal-500 text-white',
      tagBg: 'bg-white/20 text-white backdrop-blur-md',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80',
      badge: '💰 ЕКОНОМІЯ'
    },
    {
      id: 3,
      title: 'Кримські Янтики',
      subtitle: 'Суха пательня без краплі олії з маслом',
      tag: 'Крафтова фішка',
      bgGradient: 'from-zinc-900 via-zinc-800 to-zinc-900 text-white border border-zinc-700',
      tagBg: 'bg-amber-400 text-zinc-950 font-black',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      badge: '✨ ХІТ'
    }
  ];

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br ${banner.bgGradient} shadow-md hover:shadow-xl transition-shadow cursor-pointer group flex flex-col justify-between min-h-[170px] select-none`}
            onClick={() => {
              const el = document.getElementById('menu-catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {/* Top row with tags */}
            <div className="flex items-center justify-between z-10">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs transition-transform group-hover:scale-105 ${banner.tagBg}`}>
                {banner.tag}
              </span>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-md text-white">
                {banner.badge}
              </span>
            </div>

            {/* Middle Content */}
            <div className="z-10 mt-3 max-w-[65%]">
              <h3 className="font-display font-black text-lg sm:text-xl leading-tight">
                {banner.title}
              </h3>
              <p className="text-xs mt-1 opacity-90 leading-snug line-clamp-2">
                {banner.subtitle}
              </p>
            </div>

            {/* Bottom action link */}
            <div className="z-10 mt-4 flex items-center gap-1.5 text-xs font-bold text-current opacity-90 group-hover:opacity-100 transition-all">
              <span>Замовити зараз</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform duration-200" />
            </div>

            {/* Right food graphic cut-out */}
            <div className="absolute -right-6 -bottom-6 w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white/25 shadow-2xl pointer-events-none group-hover:scale-115 group-hover:rotate-6 transition-all duration-500 ease-out">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
