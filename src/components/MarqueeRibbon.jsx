import React from 'react';

export function MarqueeRibbon() {
  const items = [
    "🔥 Заміс тіста щоранку",
    "🥩 100% соковите фермерське м'ясо",
    "✨ Кримські янтики на сухій пательні без олії",
    "⚡ 7-12 хвилин від замовлення до хрусту",
    "📍 м. Запоріжжя, пр. Соборний, 142",
    "🚗 Швидка доставка по місту",
    "📦 Послуга «Візьми з собою» без черги"
  ];

  return (
    <div className="bg-castiron-950 text-white dark:bg-black dark:text-zinc-200 py-3.5 border-y border-castiron-800 overflow-hidden font-display text-xs font-semibold tracking-wide select-none">
      <div className="flex overflow-hidden">
        <div className="animate-marquee-infinite flex items-center gap-6 shrink-0 pr-6">
          {items.map((item, idx) => (
            <React.Fragment key={`m1-${idx}`}>
              <span className="whitespace-nowrap">{item}</span>
              <span className="text-warmtan-500">•</span>
            </React.Fragment>
          ))}
          {items.map((item, idx) => (
            <React.Fragment key={`m2-${idx}`}>
              <span className="whitespace-nowrap">{item}</span>
              <span className="text-warmtan-500">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
