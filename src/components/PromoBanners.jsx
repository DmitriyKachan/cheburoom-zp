import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function PromoBanners({ onSelectCategory }) {
  const banners = [
    {
      id: 1,
      categoryId: 'chebureks',
      title: 'Фірмові чебуреки',
      subtitle: 'З рваною телятиною, 4 сири чи лососем — хрусткі, соковиті та гарячі',
      tag: 'Головний хіт',
      bgGradient: 'from-amber-500 via-amber-400 to-yellow-300 text-zinc-950',
      tagBg: 'bg-zinc-950 text-white',
      image: '/images/dishes/cheb-pulled-beef.jpg',
      badge: '🔥 ВІД 79 ₴'
    },
    {
      id: 2,
      categoryId: 'wok',
      title: 'Азійський WOK',
      subtitle: 'Локшина з ніжною телятиною, куркою або морепродуктами на вибір',
      tag: 'Гарячий вок',
      bgGradient: 'from-emerald-600 to-teal-500 text-white',
      tagBg: 'bg-white/20 text-white backdrop-blur-md',
      image: '/images/dishes/wok-pulled-beef.jpg',
      badge: '🥢 ВІД 155 ₴'
    },
    {
      id: 3,
      categoryId: 'breakfast',
      title: 'Ранкове меню щодня',
      subtitle: 'Пряна шакшука на сковороді, картопля з зеленню та яєчня з беконом',
      tag: 'Свіжі сніданки',
      bgGradient: 'from-zinc-900 via-zinc-800 to-zinc-900 text-white border border-zinc-700',
      tagBg: 'bg-amber-400 text-zinc-950 font-black',
      image: '/images/dishes/breakfast-shakshuka.jpg',
      badge: '🍳 ПО 95 ₴'
    }
  ];

  const handleBannerClick = (categoryId) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    } else {
      const el = document.getElementById('menu-catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            className={`relative overflow-hidden rounded-3xl p-4 sm:p-6 bg-gradient-to-br ${banner.bgGradient} shadow-md hover:shadow-xl transition-shadow cursor-pointer group flex flex-col justify-between min-h-[155px] sm:min-h-[170px] select-none`}
            onClick={() => handleBannerClick(banner.categoryId)}
          >
            {/* Top row with tags */}
            <div className="flex items-center justify-between z-10">
              <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs transition-transform group-hover:scale-105 whitespace-nowrap ${banner.tagBg}`}>
                {banner.tag}
              </span>
              <span className="text-[11px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-black/30 backdrop-blur-md text-white whitespace-nowrap">
                {banner.badge}
              </span>
            </div>

            {/* Middle Content */}
            <div className="z-10 mt-2.5 sm:mt-3 max-w-[70%] sm:max-w-[65%]">
              <h3 className="font-display font-black text-base sm:text-xl leading-tight">
                {banner.title}
              </h3>
              <p className="text-[11px] sm:text-xs mt-1 opacity-90 leading-snug line-clamp-2">
                {banner.subtitle}
              </p>
            </div>

            {/* Bottom action link */}
            <div className="z-10 mt-3 sm:mt-4 flex items-center gap-1.5 text-xs font-bold text-current opacity-90 group-hover:opacity-100 transition-all whitespace-nowrap">
              <span>Замовити зараз</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform duration-200" />
            </div>

            {/* Right food graphic cut-out */}
            <div className="absolute -right-5 -bottom-5 sm:-right-6 sm:-bottom-6 w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white/25 shadow-2xl pointer-events-none group-hover:scale-115 group-hover:rotate-6 transition-all duration-500 ease-out">
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
