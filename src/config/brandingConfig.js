import { useState, useEffect } from 'react';

/**
 * Dual-Mode Brand & White-Label Demo Configuration
 * 
 * DEMO MODE (default = true):
 * - Removes proprietary trademark name, neon signage logo, Instagram links, and personal phone numbers.
 * - Replaces with stylish neutral Gastro & Street Food branding ("КРАФТ & CHEBUR").
 * - Ideal for presenting to business buyers without copyright issues.
 * 
 * TO SWITCH BACK AT ANY MOMENT:
 * 1) In this file: set `DEFAULT_DEMO_MODE = false`
 * 2) OR in browser URL: open with `?brand=cheburoom` (or `?brand=demo`)
 * 3) OR in Admin Panel: toggle the brand mode switch in the top header
 * 4) OR in Footer: click the discreet demo toggle link
 */

export const DEFAULT_DEMO_MODE = true;

export const ORIGINAL_BRAND = {
  id: 'cheburoom',
  name: 'ЧЕБУROOM',
  shortName: 'ЧЕБУROOM',
  slogan: 'Гастрономічний street food',
  city: 'Запоріжжя',
  address: 'вулиця Олександрівська, 75, Запоріжжя',
  phone: '+380 (95) 199 15 99',
  phoneRaw: '+380951991599',
  hours: 'Щодня з 9:00 до 20:00',
  instagram: 'https://www.instagram.com/cheburoom.zp/',
  instagramUsername: 'cheburoom.zp',
  copyright: '© 2026 ЧЕБУROOM (@cheburoom.zp) — Запоріжжя',
  aboutText: 'Ми створили ЧЕБУROOM у центрі Запоріжжя з однією метою: показати, що чебуреки можуть бути вишуканою міською гастрономією. Чиста свіжа олія, тонке тісто без зайвого жиру та соковиті начинки зі 100% фермерського м\'яса.',
  pageTitle: 'ЧЕБУROOM Запоріжжя — Крафтовий street food | Справжні соковиті чебуреки',
  isDemo: false,
};

export const DEMO_BRAND = {
  id: 'demo',
  name: 'КРАФТ & CHEBUR',
  shortName: 'КРАФТ & CHEBUR',
  slogan: 'Крафтовий street food & чебуреки',
  city: 'Запоріжжя',
  address: 'вулиця Олександрівська, 75, Запоріжжя',
  phone: '+380 (800) 50 00 00',
  phoneRaw: '+380800500000',
  hours: 'Щодня з 9:00 до 20:00',
  instagram: null,
  instagramUsername: null,
  copyright: '© 2026 Крафтовий Street Food — Демонстраційна версія',
  aboutText: 'Ми створили сучасний міський street food у центрі Запоріжжя з однією метою: показати, що чебуреки можуть бути вишуканою міською гастрономією. Чиста свіжа олія, тонке тісто без зайвого жиру та соковиті начинки зі 100% фермерського м\'яса.',
  pageTitle: 'КРАФТ & CHEBUR Запоріжжя — Крафтовий street food | Справжні соковиті чебуреки',
  isDemo: true,
};

/**
 * Returns currently active brand based on URL override, localStorage, or default
 */
export function getActiveBrand() {
  if (typeof window === 'undefined') {
    return DEFAULT_DEMO_MODE ? DEMO_BRAND : ORIGINAL_BRAND;
  }

  // 1. URL parameter override
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('brand');
    if (param === 'cheburoom') {
      localStorage.setItem('cheburoom_brand_mode', 'cheburoom');
      return ORIGINAL_BRAND;
    }
    if (param === 'demo') {
      localStorage.setItem('cheburoom_brand_mode', 'demo');
      return DEMO_BRAND;
    }
    if (param === 'reset') {
      localStorage.removeItem('cheburoom_brand_mode');
    }
  } catch {}

  // 2. Local storage override
  try {
    const stored = localStorage.getItem('cheburoom_brand_mode');
    if (stored === 'cheburoom') return ORIGINAL_BRAND;
    if (stored === 'demo') return DEMO_BRAND;
  } catch {}

  // 3. Default fallback
  return DEFAULT_DEMO_MODE ? DEMO_BRAND : ORIGINAL_BRAND;
}

/**
 * Switches brand mode across the whole app
 */
export function setBrandMode(mode) {
  if (typeof window === 'undefined') return;
  try {
    if (mode === 'cheburoom' || mode === 'demo') {
      localStorage.setItem('cheburoom_brand_mode', mode);
      window.dispatchEvent(new CustomEvent('cheburoom_brand_change', { detail: mode }));
    }
  } catch {}
}

export function toggleBrandMode() {
  const current = getActiveBrand();
  const next = current.isDemo ? 'cheburoom' : 'demo';
  setBrandMode(next);
  return next;
}

/**
 * React hook to reactively track brand changes
 */
export function useBrand() {
  const [brand, setBrand] = useState(getActiveBrand);

  useEffect(() => {
    const sync = () => {
      const b = getActiveBrand();
      setBrand(b);
      if (typeof document !== 'undefined' && b.pageTitle) {
        document.title = b.pageTitle;
      }
    };

    sync();

    window.addEventListener('cheburoom_brand_change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('cheburoom_brand_change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return brand;
}
