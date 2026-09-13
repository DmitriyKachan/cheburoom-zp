/**
 * ЧЕБУROOM - Модуль інтерактивних анімацій (Magic UI + GSAP)
 */

const App = {
  currentCategory: 'all',
  searchQuery: '',
  activeFilterTag: null,
  darkMode: false,

  init() {
    this.initTheme();
    this.renderCategories();
    this.renderDishes();
    this.bindControls();
    this.initSpotlightCards();
    this.initHeroAnimations();
  },

  initTheme() {
    const savedTheme = localStorage.getItem('cheburoom_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.setTheme(true);
    } else {
      this.setTheme(false);
    }

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setTheme(!this.darkMode);
      });
    });
  },

  setTheme(isDark) {
    this.darkMode = isDark;
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('cheburoom_theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('cheburoom_theme', 'light');
    }

    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
      icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  renderCategories() {
    const container = document.getElementById('category-pills-container');
    if (!container) return;

    container.innerHTML = MENU_DATA.categories.map(cat => `
      <button 
        type="button"
        onclick="App.selectCategory('${cat.id}')" 
        data-cat-id="${cat.id}"
        class="category-pill touch-target px-4 py-2.5 rounded-full text-xs font-bold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-2 ${cat.id === this.currentCategory ? 'active' : ''}">
        <i data-lucide="${cat.icon}" class="w-3.5 h-3.5"></i>
        <span>${cat.name}</span>
      </button>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  selectCategory(catId) {
    this.currentCategory = catId;

    document.querySelectorAll('.category-pill').forEach(pill => {
      if (pill.getAttribute('data-cat-id') === catId) {
        pill.classList.add('active');
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        pill.classList.remove('active');
      }
    });

    this.renderDishes();
  },

  filterByTag(tag) {
    if (this.activeFilterTag === tag) {
      this.activeFilterTag = null;
    } else {
      this.activeFilterTag = tag;
    }

    document.querySelectorAll('.filter-tag-btn').forEach(btn => {
      if (btn.getAttribute('data-tag') === this.activeFilterTag) {
        btn.classList.add('bg-zinc-900', 'text-white', 'dark:bg-white', 'dark:text-zinc-900', 'border-transparent');
        btn.classList.remove('bg-zinc-100', 'dark:bg-zinc-800', 'text-zinc-600', 'dark:text-zinc-300');
      } else {
        btn.classList.remove('bg-zinc-900', 'text-white', 'dark:bg-white', 'dark:text-zinc-900', 'border-transparent');
        btn.classList.add('bg-zinc-100', 'dark:bg-zinc-800', 'text-zinc-600', 'dark:text-zinc-300');
      }
    });

    this.renderDishes();
  },

  renderDishes() {
    const grid = document.getElementById('dishes-grid');
    const emptyNotice = document.getElementById('dishes-empty-state');
    if (!grid) return;

    let items = MENU_DATA.items;

    if (this.currentCategory !== 'all') {
      items = items.filter(i => i.category === this.currentCategory);
    }

    if (this.activeFilterTag === 'hit') {
      items = items.filter(i => i.isHit);
    } else if (this.activeFilterTag === 'spicy') {
      items = items.filter(i => i.isSpicy);
    } else if (this.activeFilterTag === 'veg') {
      items = items.filter(i => i.isVegetarian);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      items = items.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.shortDesc.toLowerCase().includes(q) ||
        (i.desc && i.desc.toLowerCase().includes(q))
      );
    }

    if (items.length === 0) {
      grid.innerHTML = '';
      if (emptyNotice) emptyNotice.classList.remove('hidden');
      return;
    }

    if (emptyNotice) emptyNotice.classList.add('hidden');

    grid.innerHTML = items.map(dish => {
      const isSignature = dish.id === 'cheb-beef';
      
      let badgeHtml = '';
      if (dish.badge) {
        let badgeColorClass = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40';
        if (dish.badgeColor === 'red') {
          badgeColorClass = 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40';
        } else if (dish.badgeColor === 'emerald' || dish.badgeColor === 'green') {
          badgeColorClass = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40';
        }
        badgeHtml = `<span class="absolute top-3 left-3 z-10 px-2.5 py-1 text-[11px] font-bold rounded-full border backdrop-blur-md ${badgeColorClass}">${dish.badge}</span>`;
      }

      const cardInner = `
        <article class="magic-card flex flex-col h-full bg-white dark:bg-[#18181C] relative">
          ${isSignature ? '<div class="border-beam"></div>' : ''}
          ${badgeHtml}
          
          <div class="relative h-48 sm:h-52 w-full bg-zinc-100 dark:bg-zinc-800/80 cursor-pointer overflow-hidden" onclick="Order.openDishModal('${dish.id}')">
            <img 
              src="${dish.image}" 
              alt="${dish.name}" 
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            <div class="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-medium flex items-center gap-1">
              <i data-lucide="scale" class="w-3 h-3 text-amber-400"></i>
              <span>${dish.weight}</span>
            </div>
          </div>

          <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between z-10">
            <div>
              <h3 class="font-display font-bold text-base text-zinc-900 dark:text-zinc-100 leading-snug hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer mb-1.5" onclick="Order.openDishModal('${dish.id}')">
                ${dish.name}
              </h3>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                ${dish.shortDesc}
              </p>
            </div>

            <div class="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span class="text-xl font-display font-bold text-zinc-900 dark:text-white">${dish.price} ₴</span>
              </div>

              <div class="flex items-center gap-2">
                ${dish.customizable ? `
                  <button 
                    type="button" 
                    onclick="Order.openDishModal('${dish.id}')"
                    class="touch-target px-3 py-2 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
                    title="Обрати начинку або янтик"
                    aria-label="Налаштувати ${dish.name}">
                    <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5"></i>
                    <span class="hidden sm:inline">Склад</span>
                  </button>
                ` : ''}

                <button 
                  type="button" 
                  onclick="App.handleAddToCart(event, '${dish.id}')"
                  class="btn-flame touch-target px-3.5 py-2 text-xs flex items-center gap-1.5"
                  aria-label="Додати ${dish.name} до кошика">
                  <i data-lucide="plus" class="w-4 h-4"></i>
                  <span>В кошик</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;

      return isSignature ? `<div class="border-beam-container h-full">${cardInner}</div>` : cardInner;
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Re-bind spotlight listener to newly rendered cards
    this.initSpotlightCards();

    // Subtle GSAP entrance
    if (typeof gsap !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        gsap.from('#dishes-grid .magic-card', {
          opacity: 0,
          y: 12,
          duration: 0.3,
          stagger: 0.03,
          ease: 'power2.out'
        });
      }
    }
  },

  // MAGIC UI Spotlight Tracker
  initSpotlightCards() {
    document.querySelectorAll('.magic-card').forEach(card => {
      card.onmousemove = (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      };
      card.onmouseleave = () => {
        card.style.setProperty('--mouse-x', `-999px`);
        card.style.setProperty('--mouse-y', `-999px`);
      };
    });
  },

  handleAddToCart(event, dishId) {
    const dish = MENU_DATA.items.find(i => i.id === dishId);
    if (!dish) return;

    this.animateFlyToCart(event.currentTarget);
    Cart.addItem(dish);
  },

  animateFlyToCart(sourceElement) {
    const targetCart = document.querySelector('.header-cart-icon') || document.querySelector('.btn-open-cart');
    if (!sourceElement || !targetCart) return;

    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetCart.getBoundingClientRect();

    const particle = document.createElement('div');
    particle.className = 'flying-particle';
    particle.style.left = `${sourceRect.left + sourceRect.width / 2 - 11}px`;
    particle.style.top = `${sourceRect.top + sourceRect.height / 2 - 11}px`;
    document.body.appendChild(particle);

    if (typeof gsap !== 'undefined') {
      gsap.to(particle, {
        x: targetRect.left - sourceRect.left,
        y: targetRect.top - sourceRect.top,
        scale: 0.3,
        opacity: 0.9,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          particle.remove();
          gsap.fromTo(targetCart, { scale: 1.3 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
        }
      });
    } else {
      setTimeout(() => particle.remove(), 400);
    }
  },

  bindControls() {
    const searchInput = document.getElementById('search-dish-input');
    const searchClear = document.getElementById('search-dish-clear');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        if (searchClear) {
          searchClear.classList.toggle('hidden', !this.searchQuery);
        }
        this.renderDishes();
      });
    }
    if (searchClear && searchInput) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        this.searchQuery = '';
        searchClear.classList.add('hidden');
        this.renderDishes();
      });
    }

    document.querySelectorAll('.filter-tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        this.filterByTag(tag);
      });
    });
  },

  initHeroAnimations() {
    if (typeof gsap === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.from('.hero-headline', { opacity: 0, y: 24, duration: 0.7, ease: 'power2.out' });
    gsap.from('.hero-statement', { opacity: 0, y: 16, duration: 0.6, delay: 0.2, ease: 'power2.out' });
    gsap.from('.hero-interactive-card', { opacity: 0, scale: 0.96, duration: 0.7, delay: 0.3, ease: 'power2.out' });
  }
};
