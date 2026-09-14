import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MENU_DATA } from '../data/menuData';
import {
  broadcastNewOrder,
  subscribeToOrders,
  playKitchenChime
} from '../services/orderSyncService';

const CartContext = createContext(null);

const STORAGE_KEY_CART = 'cheburoom_react_cart_v1';
const STORAGE_KEY_MENU = 'cheburoom_custom_menu';
const STORAGE_KEY_ORDERS = 'cheburoom_orders_log';
const STORAGE_KEY_THEME = 'cheburoom_theme';

export function CartProvider({ children }) {
  // Menu items state (persisted locally with fallback to default MENU_DATA)
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MENU);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading saved menu', e);
    }
    return MENU_DATA.items;
  });

  // Orders history (persisted locally for kitchen / staff admin)
  const [ordersHistory, setOrdersHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading orders history', e);
    }
    return [];
  });

  // Cart items
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDishForModal, setSelectedDishForModal] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrderState] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Real-time synchronization across tabs & devices
  useEffect(() => {
    const unsubscribe = subscribeToOrders((incomingOrder) => {
      setOrdersHistory((prev) => {
        if (prev.some((o) => o.orderId === incomingOrder.orderId)) {
          return prev;
        }
        const updated = [incomingOrder, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
        } catch (e) {
          console.warn('LocalStorage error', e);
        }
        playKitchenChime();
        return updated;
      });
    });

    // 1.5s active storage polling heartbeat
    const pollTimer = setInterval(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setOrdersHistory((prev) => {
              if (parsed.length !== prev.length || (parsed[0]?.orderId !== prev[0]?.orderId)) {
                return parsed;
              }
              return prev;
            });
          }
        }
      } catch {}
    }, 1500);

    return () => {
      unsubscribe();
      clearInterval(pollTimer);
    };
  }, []);

  // Page Routing State ('menu' | 'checkout' | 'admin')
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#/admin') {
        return 'admin';
      }
      if (hash === '#checkout' || hash === '#cart' || hash === '#order') {
        return 'checkout';
      }
    }
    return 'menu';
  });

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      if (page === 'admin') {
        window.history.pushState({ page: 'admin' }, '', '#admin');
      } else if (page === 'checkout') {
        window.history.pushState({ page: 'checkout' }, '', '#checkout');
      } else {
        window.history.pushState({ page: 'menu' }, '', '#menu');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleHashOrPopState = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#/admin') {
        setCurrentPage('admin');
      } else if (hash === '#checkout' || hash === '#cart' || hash === '#order') {
        setCurrentPage('checkout');
      } else {
        setCurrentPage('menu');
      }
    };

    window.addEventListener('popstate', handleHashOrPopState);
    window.addEventListener('hashchange', handleHashOrPopState);
    return () => {
      window.removeEventListener('popstate', handleHashOrPopState);
      window.removeEventListener('hashchange', handleHashOrPopState);
    };
  }, []);

  // Theme management
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [items]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  }, []);

  // Dish management (Admin CRUD)
  const saveMenuItems = (newItems) => {
    setMenuItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(newItems));
    } catch (e) {
      console.warn('Failed to save menuItems to localStorage', e);
    }
  };

  const addDish = (dish) => {
    const newDish = {
      ...dish,
      id: dish.id || `dish_${Date.now()}`,
      price: Number(dish.price) || 0,
      available: dish.available !== false
    };
    const updated = [newDish, ...menuItems];
    saveMenuItems(updated);
    return newDish;
  };

  const updateDish = (id, updatedFields) => {
    const updated = menuItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...updatedFields,
          price: Number(updatedFields.price !== undefined ? updatedFields.price : item.price)
        };
      }
      return item;
    });
    saveMenuItems(updated);
  };

  const deleteDish = (id) => {
    const updated = menuItems.filter(item => item.id !== id);
    saveMenuItems(updated);
  };

  const toggleDishAvailability = (dishId) => {
    const updated = menuItems.map(d => {
      if (d.id === dishId) {
        const newAvail = d.available === false ? true : false;
        showToast(`«${d.name}» ${newAvail ? 'повернуто в наявність' : 'поставлено в стоп-лист'}`);
        return { ...d, available: newAvail };
      }
      return d;
    });
    saveMenuItems(updated);
  };

  const updateDishImage = (dishId, newImageDataUrl) => {
    const updated = menuItems.map(d => {
      if (d.id === dishId) {
        return { ...d, image: newImageDataUrl };
      }
      return d;
    });
    saveMenuItems(updated);
    showToast('Фото страви успішно оновлено!');
  };

  const resetToDefaultMenu = () => {
    setMenuItems(MENU_DATA.items);
    try {
      localStorage.removeItem(STORAGE_KEY_MENU);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  };

  const exportMenuBackup = () => {
    try {
      const jsonStr = JSON.stringify(menuItems, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cheburoom_menu_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Резервну копію збережено');
    } catch {
      showToast('Не вдалося зберегти резервну копію');
    }
  };

  const importMenuBackup = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      saveMenuItems(data);
      return true;
    }
    throw new Error('Некоректний формат файлу');
  };

  // Orders logging & management
  const setSuccessOrder = (order) => {
    setSuccessOrderState(order);
    if (order && order.orderId) {
      const newEntry = {
        ...order,
        status: order.status || 'new',
        createdAt: new Date().toISOString(),
        timing: order.timing || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setOrdersHistory(prev => {
        const filtered = prev.filter(o => o.orderId !== order.orderId);
        const updated = [newEntry, ...filtered];
        try {
          localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
        } catch (e) {
          console.warn('LocalStorage error', e);
        }
        return updated;
      });

      // Broadcast order across all tabs and cloud devices immediately
      broadcastNewOrder(newEntry);
      playKitchenChime();
    }
  };

  const createTestOrder = () => {
    const testId = 'CR-' + Math.floor(100000 + Math.random() * 900000);
    const testNames = ['Олександр (Тест)', 'Марія (Тест)', 'Дмитро (Тест)', 'Катерина (Тест)', 'Богдан (Тест)'];
    const randomName = testNames[Math.floor(Math.random() * testNames.length)];
    const randomPhone = '+380 ' + Math.floor(500000000 + Math.random() * 499999999);

    const dish1 = menuItems[0] || { id: 'ch1', name: 'Чебурек з телятиною', price: 90 };
    const dish2 = menuItems[1] || { id: 'df1', name: 'Картопля фрі', price: 65 };

    const testItems = [
      { id: dish1.id, name: dish1.name, quantity: 2, unitPrice: dish1.price, crust: 'Класичне' },
      { id: dish2.id, name: dish2.name, quantity: 1, unitPrice: dish2.price }
    ];
    const total = (dish1.price * 2) + dish2.price;

    const testOrder = {
      orderId: testId,
      name: randomName,
      phone: randomPhone,
      total,
      subtotal: total,
      discount: 0,
      orderType: 'pickup',
      address: `м. Запоріжжя, ${MENU_DATA.info.address}`,
      timing: '🔥 Якнайшвидше (~7-10 хв)',
      payment: 'Готівкою при отриманні',
      cutleryCount: 2,
      comment: 'Тестове замовлення для перевірки адмінки',
      items: testItems,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    setOrdersHistory(prev => {
      const updated = [testOrder, ...prev.filter(o => o.orderId !== testId)];
      try {
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage error', e);
      }
      return updated;
    });

    broadcastNewOrder(testOrder);
    playKitchenChime();
    showToast(`⚡ Створено тестове замовлення #${testId}!`);
    return testOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrdersHistory(prev => {
      const updated = prev.map(o => {
        if (o.orderId === orderId) {
          return { ...o, status };
        }
        return o;
      });
      try {
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage error', e);
      }
      return updated;
    });
    showToast(`Статус замовлення #${orderId} оновлено`);
  };

  const clearOrdersHistory = () => {
    setOrdersHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_ORDERS);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    showToast('Історію замовлень очищено');
  };

  // Cart operations
  const addItem = (dish, options = {}) => {
    const crust = options.crust || (dish.options?.crust ? dish.options.crust[0].name : null);
    const extras = options.extras || [];

    let unitPrice = dish.price;
    extras.forEach(e => {
      unitPrice += (e.price || 0);
    });

    const extrasKey = extras.map(e => e.id).sort().join('_');
    const cartItemId = `${dish.id}_${crust || 'std'}_${extrasKey}`;

    setItems(prevItems => {
      const existingIdx = prevItems.findIndex(i => i.cartItemId === cartItemId);
      if (existingIdx > -1) {
        const copy = [...prevItems];
        copy[existingIdx].quantity += (options.quantity || 1);
        return copy;
      }
      return [
        ...prevItems,
        {
          cartItemId,
          id: dish.id,
          name: dish.name,
          basePrice: dish.price,
          unitPrice,
          quantity: options.quantity || 1,
          weight: dish.weight,
          image: dish.image,
          crust,
          extras
        }
      ];
    });

    showToast(`«${dish.name}» додано до кошика!`);
  };

  const updateQuantity = (cartItemId, delta) => {
    setItems(prevItems => {
      return prevItems
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeItem = (cartItemId) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const getDeliveryFee = () => 0;
  const getDiscount = () => 0;
  const getTotal = () => subtotal;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        getDeliveryFee,
        getDiscount,
        getTotal,
        currentPage,
        setCurrentPage,
        navigateTo,
        isCartOpen,
        setIsCartOpen,
        selectedDishForModal,
        setSelectedDishForModal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        successOrder,
        setSuccessOrder,
        toastMessage,
        showToast,
        darkMode,
        toggleTheme,
        // Menu management (Admin CRUD)
        menuItems,
        addDish,
        updateDish,
        deleteDish,
        toggleDishAvailability,
        updateDishImage,
        resetToDefaultMenu,
        exportMenuBackup,
        importMenuBackup,
        // Orders logging & management
        ordersHistory,
        createTestOrder,
        updateOrderStatus,
        clearOrdersHistory
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
