import React from 'react';

/**
 * Infinite Marquee Ribbon
 * Features genuine, compelling restaurant benefits for Cheburoom (@cheburoom.zp)
 * Never pauses on hover to ensure smooth, unhindered kinetic flow.
 */
export function MarqueeRibbon() {
  const advantages = [
    {
      icon: "⚡",
      title: "Готуємо під замовлення"
    },
    {
      icon: "🥟",
      title: "Фірмове пухирчасте тісто"
    },
    {
      icon: "🥟",
      title: "Золотава пухирчаста скоринка"
    },
    {
      icon: "🥩",
      title: "100% соковиті начинки"
    },
    {
      icon: "🥢",
      title: "Гарячий WOK та сніданки"
    },
    {
      icon: "⏱️",
      title: "З-під ножа за 7–10 хвилин"
    },
    {
      icon: "🛍️",
      title: "Зручне замовлення з собою"
    },
    {
      icon: "📍",
      title: "-10% на самовивіз"
    },
    {
      icon: "☕",
      title: "Кава, Бамбл та десерти"
    }
  ];

  return (
    <div className="relative bg-zinc-950 dark:bg-[#070709] text-white py-3 sm:py-3.5 border-y border-zinc-800 dark:border-[#1E1E26] overflow-hidden select-none pointer-events-none">
      {/* Subtle edge fades to make entrance and exit look elegant */}
      <div className="absolute left-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-r from-zinc-950 dark:from-[#070709] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-l from-zinc-950 dark:from-[#070709] to-transparent z-10 pointer-events-none" />

      <div className="flex overflow-hidden">
        <div className="animate-marquee-infinite flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8">
          {/* First sequence */}
          {advantages.map((item, idx) => (
            <div key={`m1-${idx}`} className="flex items-center gap-2.5 whitespace-nowrap text-xs sm:text-sm">
              <span className="text-base">{item.icon}</span>
              <span className="font-extrabold text-amber-400 tracking-wide">
                {item.title}
              </span>
              <span className="text-amber-500/60 font-bold ml-4 sm:ml-6">•</span>
            </div>
          ))}

          {/* Duplicate sequence for seamless infinite loop */}
          {advantages.map((item, idx) => (
            <div key={`m2-${idx}`} className="flex items-center gap-2.5 whitespace-nowrap text-xs sm:text-sm">
              <span className="text-base">{item.icon}</span>
              <span className="font-extrabold text-amber-400 tracking-wide">
                {item.title}
              </span>
              <span className="text-amber-500/60 font-bold ml-4 sm:ml-6">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarqueeRibbon;
