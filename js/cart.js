/**
 * ЧЕБУROOM - Модуль керування кошиком
 */

const Cart = {
  items: [],
  storageKey: 'cheburoom_cart_v1',

  init() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.items = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load cart from localStorage', e);
      this.items = [];
    }

    this.updateUI();
    this.bindEvents();
  },

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
    this.updateUI();
  },

  addItem(dish, options = {}) {
    const crust = options.crust || (dish.options?.crust ? dish.options.crust[0].name : null);
    const extras = options.extras || []; // array of { id, name, price }
    
    // Calculate unit price with extras
    let unitPrice = dish.price;
    extras.forEach(ex => {
      unitPrice += (ex.price || 0);
    });

    // Unique key for item variations
    const extrasKey = extras.map(e => e.id).sort().join('_');
    const cartItemId = `${dish.id}_${crust || 'std'}_${extrasKey}`;

    const existingIndex = this.items.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += (options.quantity || 1);
    } else {
      this.items.push({
        cartItemId,
        id: dish.id,
        name: dish.name,
        basePrice: dish.price,
        unitPrice: unitPrice,
        quantity: options.quantity || 1,
        weight: dish.weight,
        image: dish.image,
        crust: crust,
        extras: extras
      });
    }

    this.save();
    this.showToast(`«${dish.name}» додано до кошика!`);
  },

  updateQuantity(cartItemId, delta) {
    const item = this.items.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(cartItemId);
    } else {
      this.save();
    }
  },

  removeItem(cartItemId) {
    this.items = this.items.filter(i => i.cartItemId !== cartItemId);
    this.save();
  },

  clearCart() {
    this.items = [];
    this.save();
  },

  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal() {
    return this.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  },

  getDeliveryFee(orderType = 'delivery') {
    if (orderType === 'pickup') return 0;
    const subtotal = this.getSubtotal();
    if (subtotal >= MENU_DATA.info.freeDeliveryThreshold || subtotal === 0) {
      return 0;
    }
    return MENU_DATA.info.deliveryCost;
  },

  getTotal(orderType = 'delivery') {
    return this.getSubtotal() + this.getDeliveryFee(orderType);
  },

  updateUI() {
    const count = this.getItemCount();
    const subtotal = this.getSubtotal();

    // Badges in header & floating bar
    const cartCountBadges = document.querySelectorAll('.cart-count-badge');
    cartCountBadges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
      
      // Pulse animation when count changes
      if (count > 0 && typeof gsap !== 'undefined') {
        gsap.fromTo(badge, { scale: 1.35 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
      }
    });

    const cartTotalDisplays = document.querySelectorAll('.cart-total-display');
    cartTotalDisplays.forEach(el => {
      el.textContent = `${subtotal} ₴`;
    });

    // Mobile bottom sticky bar visibility
    const mobileCartBar = document.getElementById('mobile-cart-bar');
    if (mobileCartBar) {
      if (count > 0) {
        mobileCartBar.classList.remove('translate-y-full');
        mobileCartBar.classList.add('translate-y-0');
      } else {
        mobileCartBar.classList.remove('translate-y-0');
        mobileCartBar.classList.add('translate-y-full');
      }
    }

    this.renderCartDrawer();
  },

  renderCartDrawer() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const footer = document.getElementById('cart-drawer-footer');
    const freeDeliveryNotice = document.getElementById('free-delivery-notice');
    const freeDeliveryProgress = document.getElementById('free-delivery-progress');

    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      if (footer) footer.classList.add('hidden');
      if (freeDeliveryNotice) freeDeliveryNotice.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (footer) footer.classList.remove('hidden');
    if (freeDeliveryNotice) freeDeliveryNotice.classList.remove('hidden');

    const subtotal = this.getSubtotal();
    const threshold = MENU_DATA.info.freeDeliveryThreshold;
    const diff = threshold - subtotal;

    if (diff > 0) {
      const percent = Math.min(100, Math.round((subtotal / threshold) * 100));
      if (freeDeliveryProgress) freeDeliveryProgress.style.width = `${percent}%`;
      if (freeDeliveryNotice) {
        freeDeliveryNotice.innerHTML = `
          <div class="flex items-center justify-between text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
            <span>До безкоштовної доставки:</span>
            <span class="text-amber-600 dark:text-amber-400 font-bold">${diff} ₴</span>
          </div>
          <div class="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div class="h-full bg-amber-500 rounded-full progress-bar-fill" style="width: ${percent}%"></div>
          </div>
        `;
      }
    } else {
      if (freeDeliveryProgress) freeDeliveryProgress.style.width = `100%`;
      if (freeDeliveryNotice) {
        freeDeliveryNotice.innerHTML = `
          <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <i data-lucide="check-circle-2" class="w-4 h-4"></i>
            <span>Вітаємо! У вас безкоштовна доставка по місту!</span>
          </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    }

    // Render list of items
    container.innerHTML = this.items.map(item => {
      const extrasText = item.extras && item.extras.length > 0
        ? `<div class="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">+ ${item.extras.map(e => e.name).join(', ')}</div>`
        : '';
      const crustText = item.crust
        ? `<div class="text-[11px] text-amber-600 dark:text-amber-400 font-medium">${item.crust}</div>`
        : '';

      return `
        <div class="flex items-start gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800/80 group">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover border border-zinc-100 dark:border-zinc-800 shrink-0" loading="lazy">
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-1">
              <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">${item.name}</h4>
              <button onclick="Cart.removeItem('${item.cartItemId}')" class="text-zinc-400 hover:text-red-500 p-1 -mr-1 transition-colors" title="Видалити" aria-label="Видалити ${item.name}">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
            ${crustText}
            ${extrasText}
            <div class="flex items-center justify-between mt-2">
              <span class="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">${item.unitPrice * item.quantity} ₴</span>
              <div class="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200/60 dark:border-zinc-700/60">
                <button onclick="Cart.updateQuantity('${item.cartItemId}', -1)" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors" aria-label="Зменшити кількість">
                  <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                </button>
                <span class="text-xs font-bold w-4 text-center text-zinc-900 dark:text-zinc-100">${item.quantity}</span>
                <button onclick="Cart.updateQuantity('${item.cartItemId}', 1)" class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors" aria-label="Збільшити кількість">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Update drawer footer totals
    const drawerSubtotal = document.getElementById('drawer-subtotal');
    if (drawerSubtotal) drawerSubtotal.textContent = `${subtotal} ₴`;

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast-alert';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
        <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
      </div>
      <span>${message}</span>
    `;

    if (typeof lucide !== 'undefined') lucide.createIcons();

    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  },

  bindEvents() {
    // Drawer open/close triggers
    const openBtns = document.querySelectorAll('.btn-open-cart');
    openBtns.forEach(btn => {
      btn.addEventListener('click', () => this.openDrawer());
    });

    const closeBtns = document.querySelectorAll('.btn-close-cart');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => this.closeDrawer());
    });

    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeDrawer());
    }
  },

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (!drawer) return;

    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    if (backdrop) {
      backdrop.classList.remove('hidden');
      requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
      });
    }
    document.body.style.overflow = 'hidden';
  },

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (!drawer) return;

    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');
    if (backdrop) {
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('opacity-0');
      setTimeout(() => {
        backdrop.classList.add('hidden');
      }, 300);
    }
    document.body.style.overflow = '';
  }
};
