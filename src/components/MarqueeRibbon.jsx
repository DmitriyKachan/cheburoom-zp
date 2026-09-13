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
      title: "Готуємо під замовлення",
      desc: "смажимо щойно після вашого кліку, жодних розігрівів"
    },
    {
      icon: "🥟",
      title: "Фірмове пухирчасте тісто",
      desc: "ідеальний золотавий хрускіт та море гарячого бульйону"
    },
    {
      icon: "🍳",
      title: "Фритюр або Кримський янтик",
      desc: "хрусткі пухирці або суха пательня без краплі олії"
    },
    {
      icon: "🥩",
      title: "100% соковиті начинки",
      desc: "томлена рвана телятина, 4 сири, лосось та свіжа вишня"
    },
    {
      icon: "🥢",
      title: "Гарячий WOK та сніданки",
      desc: "азійська локшина, шакшука на сковороді й сир моцарела"
    },
    {
      icon: "🛵",
      title: "Доставка по Запоріжжю 25–40 хв",
      desc: "привозимо свіжим і гарячим у термобоксах"
    },
    {
      icon: "🎁",
      title: "Безкоштовна доставка від 450 ₴",
      desc: "вигідно для компанії або швидкого обіду"
    },
    {
      icon: "📍",
      title: "-10% на самовивіз",
      desc: "забирайте без черги у центрі: пр. Соборний, 142"
    },
    {
      icon: "☕",
      title: "Кава, Бамбл та десерти",
      desc: "горішки з ірискою та лінійка безлактозних напоїв"
    }
  ];

  return (
    <div className="relative bg-zinc-950 dark:bg-[#070709] text-white py-3 sm:py-3.5 border-y border-zinc-800 dark:border-[#1E1E26] overflow-hidden select-none pointer-events-none">
      {/* Subtle edge fades to make entrance and exit look elegant */}
      <div className="absolute left-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-r from-zinc-950 dark:from-[#070709] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-l from-zinc-950 dark:from-[#070709] to-transparent z-10 pointer-events-none" />

      <div className="flex overflow-hidden">
        <div className="animate-marquee-infinite flex items-center gap-8 sm:gap-10 shrink-0 pr-8 sm:pr-10">
          {/* First sequence */}
          {advantages.map((item, idx) => (
            <div key={`m1-${idx}`} className="flex items-center gap-3 whitespace-nowrap text-xs">
              <span className="text-sm">{item.icon}</span>
              <span className="font-extrabold text-amber-400 tracking-wide">
                {item.title}
              </span>
              <span className="text-zinc-300 font-normal">
                — {item.desc}
              </span>
              <span className="text-amber-500/60 font-bold ml-5 sm:ml-7">•</span>
            </div>
          ))}

          {/* Duplicate sequence for seamless infinite loop */}
          {advantages.map((item, idx) => (
            <div key={`m2-${idx}`} className="flex items-center gap-3 whitespace-nowrap text-xs">
              <span className="text-sm">{item.icon}</span>
              <span className="font-extrabold text-amber-400 tracking-wide">
                {item.title}
              </span>
              <span className="text-zinc-300 font-normal">
                — {item.desc}
              </span>
              <span className="text-amber-500/60 font-bold ml-5 sm:ml-7">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarqueeRibbon;
