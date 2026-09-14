/**
 * ЧЕБУROOM - Модуль кастомізації страв та оформлення замовлення
 */

const Order = {
  currentDish: null,
  currentCustomOptions: {
    crust: null,
    extras: []
  },
  orderType: 'delivery', // 'delivery' | 'pickup'

  init() {
    this.bindEvents();
    this.initPhoneMask();
  },

  bindEvents() {
    // Modal Close buttons
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });

    // Custom Dish modal "Add to cart"
    const addCustomBtn = document.getElementById('modal-add-to-cart-btn');
    if (addCustomBtn) {
      addCustomBtn.addEventListener('click', () => {
        if (!this.currentDish) return;
        Cart.addItem(this.currentDish, this.currentCustomOptions);
        this.closeAllModals();
      });
    }

    // Checkout button inside Cart Drawer
    const proceedCheckoutBtn = document.getElementById('btn-proceed-checkout');
    if (proceedCheckoutBtn) {
      proceedCheckoutBtn.addEventListener('click', () => {
        if (Cart.items.length === 0) {
          Cart.showToast('Ваш кошик порожній!');
          return;
        }
        Cart.closeDrawer();
        this.openCheckoutModal();
      });
    }

    // Order type tabs (delivery vs pickup)
    const typeBtns = document.querySelectorAll('.order-type-tab');
    typeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = btn.getAttribute('data-type');
        this.setOrderType(type);
      });
    });

    // Checkout form submit
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processOrder();
      });
    }

    // Close on backdrop click
    const dishModal = document.getElementById('dish-custom-modal');
    if (dishModal) {
      dishModal.addEventListener('click', (e) => {
        if (e.target === dishModal) this.closeAllModals();
      });
    }

    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
      checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) this.closeAllModals();
      });
    }

    const successModal = document.getElementById('order-success-modal');
    if (successModal) {
      successModal.addEventListener('click', (e) => {
        if (e.target === successModal) this.closeAllModals();
      });
    }
  },

  // Открытие модалки деталей/кастомизации блюда
  openDishModal(dishId) {
    const dish = MENU_DATA.items.find(i => i.id === dishId);
    if (!dish) return;

    this.currentDish = dish;
    this.currentCustomOptions = {
      crust: dish.options?.crust ? dish.options.crust[0].name : null,
      extras: [],
      quantity: 1
    };

    const modal = document.getElementById('dish-custom-modal');
    const title = document.getElementById('modal-dish-title');
    const desc = document.getElementById('modal-dish-desc');
    const img = document.getElementById('modal-dish-img');
    const weight = document.getElementById('modal-dish-weight');
    const optionsContainer = document.getElementById('modal-dish-options');
    const priceDisplay = document.getElementById('modal-dish-price');

    if (title) title.textContent = dish.name;
    if (desc) desc.textContent = dish.desc || dish.shortDesc;
    if (img) {
      img.src = dish.image;
      img.alt = dish.name;
    }
    if (weight) weight.textContent = dish.weight;

    // Render options (crust, extras)
    if (optionsContainer) {
      let html = '';

      // Crust choices (Фритюр чи Янтик на сухій пательні)
      if (dish.options?.crust && dish.options.crust.length > 0) {
        html += `
          <div class="mb-5">
            <h4 class="text-xs font-display font-bold text-zinc-700 dark:text-zinc-300 mb-2.5">Спосіб приготування:</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${dish.options.crust.map((c, idx) => `
                <label class="skillet-switch-label cursor-pointer gap-2.5">
                  <input type="radio" name="dish-crust" value="${c.name}" ${idx === 0 ? 'checked' : ''} onchange="Order.onCrustChange('${c.name}')" class="text-amber-600 focus:ring-amber-500 w-4 h-4">
                  <div class="min-w-0">
                    <span class="text-xs font-bold block text-zinc-900 dark:text-white">${c.name}</span>
                    <span class="text-[10px] text-zinc-500 dark:text-zinc-400 block">${idx === 0 ? 'Золотиста пухирчаста скоринка' : 'Без олії + фермерське масло'}</span>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>
        `;
      }

      // Extras choices
      if (dish.options?.extras && dish.options.extras.length > 0) {
        html += `
          <div class="mb-5">
            <h4 class="text-xs font-display font-bold text-zinc-700 dark:text-zinc-300 mb-2.5">Додати до начинки:</h4>
            <div class="space-y-2">
              ${dish.options.extras.map(extra => `
                <label class="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 cursor-pointer hover:border-amber-500 transition-colors has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/5">
                  <div class="flex items-center gap-2.5">
                    <input type="checkbox" value="${extra.id}" data-name="${extra.name}" data-price="${extra.price}" onchange="Order.onExtraToggle(this)" class="rounded text-amber-600 focus:ring-amber-500 w-4 h-4">
                    <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">${extra.name}</span>
                  </div>
                  <span class="text-xs font-extrabold text-amber-600 dark:text-amber-400">+${extra.price} ₴</span>
                </label>
              `).join('')}
            </div>
          </div>
        `;
      }

      optionsContainer.innerHTML = html;
    }

    this.updateDishModalPrice();

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      modal.classList.remove('opacity-0');
      const content = modal.querySelector('.modal-content-card');
      if (content) {
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
      }
    });
    document.body.style.overflow = 'hidden';

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  onCrustChange(crustName) {
    this.currentCustomOptions.crust = crustName;
    this.updateDishModalPrice();
  },

  onExtraToggle(checkbox) {
    const extraId = checkbox.value;
    const extraName = checkbox.getAttribute('data-name');
    const extraPrice = parseFloat(checkbox.getAttribute('data-price')) || 0;

    if (checkbox.checked) {
      this.currentCustomOptions.extras.push({ id: extraId, name: extraName, price: extraPrice });
    } else {
      this.currentCustomOptions.extras = this.currentCustomOptions.extras.filter(e => e.id !== extraId);
    }

    this.updateDishModalPrice();
  },

  updateDishModalPrice() {
    if (!this.currentDish) return;
    let total = this.currentDish.price;
    this.currentCustomOptions.extras.forEach(e => {
      total += e.price;
    });

    const priceDisplay = document.getElementById('modal-dish-price');
    if (priceDisplay) {
      priceDisplay.textContent = `${total} ₴`;
    }
  },

  // Оформлення замовлення
  openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    this.updateCheckoutSummary();

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      modal.classList.remove('opacity-0');
      const content = modal.querySelector('.modal-content-card');
      if (content) {
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
      }
    });
    document.body.style.overflow = 'hidden';
  },

  setOrderType(type) {
    this.orderType = type;

    // Update active tab styles
    document.querySelectorAll('.order-type-tab').forEach(btn => {
      const isSelected = btn.getAttribute('data-type') === type;
      if (isSelected) {
        btn.classList.add('bg-white', 'dark:bg-zinc-700', 'text-zinc-900', 'dark:text-zinc-100', 'shadow-sm');
        btn.classList.remove('text-zinc-500', 'dark:text-zinc-400');
      } else {
        btn.classList.remove('bg-white', 'dark:bg-zinc-700', 'text-zinc-900', 'dark:text-zinc-100', 'shadow-sm');
        btn.classList.add('text-zinc-500', 'dark:text-zinc-400');
      }
    });

    // Toggle fields for delivery vs pickup
    const deliveryFields = document.getElementById('delivery-address-group');
    const pickupNotice = document.getElementById('pickup-location-group');

    if (type === 'delivery') {
      if (deliveryFields) deliveryFields.classList.remove('hidden');
      if (pickupNotice) pickupNotice.classList.add('hidden');
    } else {
      if (deliveryFields) deliveryFields.classList.add('hidden');
      if (pickupNotice) pickupNotice.classList.remove('hidden');
    }

    this.updateCheckoutSummary();
  },

  updateCheckoutSummary() {
    const subtotal = Cart.getSubtotal();
    const deliveryFee = Cart.getDeliveryFee(this.orderType);
    const total = Cart.getTotal(this.orderType);

    const subtotalEl = document.getElementById('checkout-subtotal');
    const deliveryEl = document.getElementById('checkout-delivery-fee');
    const totalEl = document.getElementById('checkout-total');
    const orderItemsSummary = document.getElementById('checkout-items-summary');

    if (subtotalEl) subtotalEl.textContent = `${subtotal} ₴`;
    if (deliveryEl) {
      deliveryEl.textContent = deliveryFee === 0 ? 'Безкоштовно' : `${deliveryFee} ₴`;
      if (deliveryFee === 0) {
        deliveryEl.classList.add('text-emerald-600', 'dark:text-emerald-400', 'font-bold');
      } else {
        deliveryEl.classList.remove('text-emerald-600', 'dark:text-emerald-400', 'font-bold');
      }
    }
    if (totalEl) totalEl.textContent = `${total} ₴`;

    if (orderItemsSummary) {
      orderItemsSummary.innerHTML = Cart.items.map(item => `
        <div class="flex items-center justify-between text-xs py-1 border-b border-zinc-100 dark:border-zinc-800">
          <div class="truncate mr-2">
            <span class="font-bold">${item.quantity}×</span>
            <span>${item.name}</span>
            ${item.crust ? `<span class="text-zinc-400 text-[10px]">(${item.crust})</span>` : ''}
          </div>
          <span class="font-semibold shrink-0">${item.unitPrice * item.quantity} ₴</span>
        </div>
      `).join('');
    }
  },

  initPhoneMask() {
    const phoneInput = document.getElementById('order-phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', (e) => {
      let val = phoneInput.value.replace(/\D/g, '');
      if (val.startsWith('380')) {
        val = val.substring(3);
      } else if (val.startsWith('0')) {
        val = val.substring(1);
      }

      // Max 9 digits for UA phone after +380
      val = val.substring(0, 9);

      let formatted = '+380';
      if (val.length > 0) {
        formatted += ' (' + val.substring(0, 2);
      }
      if (val.length >= 2) {
        formatted += ') ' + val.substring(2, 5);
      }
      if (val.length >= 5) {
        formatted += ' ' + val.substring(5, 7);
      }
      if (val.length >= 7) {
        formatted += ' ' + val.substring(7, 9);
      }

      phoneInput.value = formatted;
    });

    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) {
        phoneInput.value = '+380 (';
      }
    });
  },

  processOrder() {
    const nameInput = document.getElementById('order-name');
    const phoneInput = document.getElementById('order-phone');
    const streetInput = document.getElementById('order-street');
    const houseInput = document.getElementById('order-house');
    const aptInput = document.getElementById('order-apt');
    const commentInput = document.getElementById('order-comment');
    const paymentRadio = document.querySelector('input[name="payment-method"]:checked');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const payment = paymentRadio ? paymentRadio.value : 'Готівка';
    const comment = commentInput ? commentInput.value.trim() : '';

    if (!name) {
      Cart.showToast('Вкажіть ваше ім\'я');
      if (nameInput) nameInput.focus();
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 12) { // 380 + 9 digits = 12
      Cart.showToast('Вкажіть коректний номер телефону (+380...)');
      if (phoneInput) phoneInput.focus();
      return;
    }

    let addressStr = '';
    if (this.orderType === 'delivery') {
      const street = streetInput ? streetInput.value.trim() : '';
      const house = houseInput ? houseInput.value.trim() : '';
      const apt = aptInput ? aptInput.value.trim() : '';

      if (!street || !house) {
        Cart.showToast('Будь ласка, вкажіть вулицю та номер будинку');
        if (streetInput) streetInput.focus();
        return;
      }
      addressStr = `м. Запоріжжя, вул. ${street}, буд. ${house}${apt ? ', кв./офіс ' + apt : ''}`;
    } else {
      addressStr = `Самовивіз з точки: ${MENU_DATA.info.address}`;
    }

    // Generate Order ID
    const orderId = 'CR-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = Cart.getSubtotal();
    const deliveryFee = Cart.getDeliveryFee(this.orderType);
    const total = Cart.getTotal(this.orderType);

    // Prepare structured message
    const itemsList = Cart.items.map((i, idx) => {
      let desc = `${idx + 1}. ${i.name} × ${i.quantity} шт = ${i.unitPrice * i.quantity} ₴`;
      if (i.crust) desc += `\n   ↳ ${i.crust}`;
      if (i.extras && i.extras.length > 0) {
        desc += `\n   ↳ Додатки: ${i.extras.map(e => e.name).join(', ')}`;
      }
      return desc;
    }).join('\n');

    const orderText = 
`🔔 НОВЕ ЗАМОВЛЕННЯ №${orderId}
🏛 Заклад: ЧЕБУROOM (@cheburoom.zp)
━━━━━━━━━━━━━━━━━━━━
👤 Клієнт: ${name}
📞 Телефон: ${phone}
📍 Отримання: ${this.orderType === 'delivery' ? '🚗 Доставка кур\'єром' : '🏃 Самовивіз'}
🏠 Адреса: ${addressStr}
💳 Оплата: ${payment}
${comment ? '💬 Коментар: ' + comment + '\n' : ''}━━━━━━━━━━━━━━━━━━━━
📋 ЗАМОВЛЕННЯ:
${itemsList}

💰 Разом за страви: ${subtotal} ₴
🚗 Доставка: ${deliveryFee === 0 ? 'Безкоштовно' : deliveryFee + ' ₴'}
🔥 ДО СПЛАТИ: ${total} ₴`;

    // Save order details for display
    this.lastOrder = {
      orderId,
      name,
      phone,
      orderText,
      total,
      type: this.orderType,
      itemsCount: Cart.getItemCount()
    };

    // Close checkout and show success
    this.closeAllModals();
    this.showSuccessModal();

    // Clear cart
    Cart.clearCart();
  },

  showSuccessModal() {
    const modal = document.getElementById('order-success-modal');
    if (!modal || !this.lastOrder) return;

    const orderIdEl = document.getElementById('success-order-id');
    const orderTotalEl = document.getElementById('success-order-total');
    const orderPhoneEl = document.getElementById('success-order-phone');
    const tgBtn = document.getElementById('success-send-telegram');
    const viberBtn = document.getElementById('success-send-viber');

    if (orderIdEl) orderIdEl.textContent = this.lastOrder.orderId;
    if (orderTotalEl) orderTotalEl.textContent = `${this.lastOrder.total} ₴`;
    if (orderPhoneEl) orderPhoneEl.textContent = this.lastOrder.phone;

    // Telegram link
    if (tgBtn) {
      const encodedMsg = encodeURIComponent(this.lastOrder.orderText);
      tgBtn.href = `https://t.me/cheburoom_zp_bot?start=${this.lastOrder.orderId}`;
      tgBtn.onclick = (e) => {
        // Fallback to direct telegram message or copy to clipboard
        navigator.clipboard?.writeText(this.lastOrder.orderText);
        Cart.showToast('Деталі замовлення скопійовано для Telegram!');
      };
    }

    if (viberBtn) {
      viberBtn.onclick = () => {
        navigator.clipboard?.writeText(this.lastOrder.orderText);
        Cart.showToast('Деталі замовлення скопійовано!');
      };
    }

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      modal.classList.remove('opacity-0');
      const content = modal.querySelector('.modal-content-card');
      if (content) {
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
      }
    });

    // Confetti animation disabled per user request
  },

  launchConfetti() {
    // Disabled
  },

  closeAllModals() {
    document.querySelectorAll('.app-modal').forEach(modal => {
      modal.classList.add('opacity-0');
      const content = modal.querySelector('.modal-content-card');
      if (content) {
        content.classList.add('scale-95');
        content.classList.remove('scale-100');
      }
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 250);
    });
    document.body.style.overflow = '';
  }
};
