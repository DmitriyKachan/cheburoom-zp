import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MENU_DATA } from '../data/menuData';
import {
  broadcastNewOrder,
  broadcastOrderStatus,
  subscribeToOrders,
  broadcastMenuAction,
  subscribeToMenuActions,
  testCloudRelay,
  playKitchenChime
} from '../services/orderSyncService';
import {
  isFirebaseConfigured,
  subscribeToCloudMenu,
  subscribeToCloudOrders,
  saveDishToCloud,
  deleteDishFromCloud,
  sendOrderToCloud,
  updateCloudOrderStatus,
  uploadFullMenuToCloud
} from '../services/firebaseService';

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

  // Cloud Database connection status
  const [cloudVersion, setCloudVersion] = useState(0);
  const [isCloudConnected, setIsCloudConnected] = useState(true);
  const [cloudMode, setCloudMode] = useState(() => isFirebaseConfigured() ? 'firebase' : 'autocloud');

  const refreshCloudConnection = () => {
    const hasFb = isFirebaseConfigured();
    setCloudMode(hasFb ? 'firebase' : 'autocloud');
    setIsCloudConnected(true);
    setCloudVersion(v => v + 1);
  };

  // Real-time synchronization: AutoCloud SSE Relay + Cloud Firestore
  useEffect(() => {
    // 1. Subscribe to Orders (both new orders and status updates)
    const unsubscribeOrders = subscribeToOrders(
      (incomingOrder) => {
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
      },
      (orderId, newStatus) => {
        setOrdersHistory((prev) => {
          const updated = prev.map((o) => o.orderId === orderId ? { ...o, status: newStatus } : o);
          try {
            localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    );

    // 2. Subscribe to Menu actions (live price change, stop-list toggle, add dish)
    const unsubscribeMenu = subscribeToMenuActions((action) => {
      if (!action || !action.type) return;

      if (action.type === 'DISH_TOGGLE' && action.dishId) {
        setMenuItems((prev) => {
          const updated = prev.map((d) => d.id === action.dishId ? { ...d, available: action.available } : d);
          try { localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(updated)); } catch {}
          return updated;
        });
      } else if (action.type === 'DISH_UPDATE' && action.dish) {
        setMenuItems((prev) => {
          const updated = prev.map((d) => d.id === action.dish.id ? { ...d, ...action.dish } : d);
          try { localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(updated)); } catch {}
          return updated;
        });
      } else if (action.type === 'DISH_ADD' && action.dish) {
        setMenuItems((prev) => {
          if (prev.some((d) => d.id === action.dish.id)) return prev;
          const updated = [action.dish, ...prev];
          try { localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(updated)); } catch {}
          return updated;
        });
      } else if (action.type === 'DISH_DELETE' && action.dishId) {
        setMenuItems((prev) => {
          const updated = prev.filter((d) => d.id !== action.dishId);
          try { localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(updated)); } catch {}
          return updated;
        });
      } else if (action.type === 'FULL_MENU' && Array.isArray(action.items)) {
        setMenuItems(action.items);
        try { localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(action.items)); } catch {}
      }
    });

    // 3. Optional: Subscribe to Cloud Firestore if user entered Firebase keys
    let unsubscribeCloudMenu = null;
    let unsubscribeCloudOrders = null;

    if (isFirebaseConfigured()) {
      setCloudMode('firebase');

      unsubscribeCloudMenu = subscribeToCloudMenu((cloudItems) => {
        if (Array.isArray(cloudItems) && cloudItems.length > 0) {
          setMenuItems(cloudItems);
          try {
            localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(cloudItems));
          } catch (e) {
            console.warn('LocalStorage error', e);
          }
        }
      });

      unsubscribeCloudOrders = subscribeToCloudOrders((cloudOrders) => {
        if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
          setOrdersHistory((prev) => {
            const map = new Map();
            cloudOrders.forEach(o => { if (o.orderId) map.set(o.orderId, o); });
            prev.forEach(o => { if (o.orderId && !map.has(o.orderId)) map.set(o.orderId, o); });
            const merged = Array.from(map.values()).sort((a, b) => {
              const tA = new Date(a.createdAt || 0).getTime();
              const tB = new Date(b.createdAt || 0).getTime();
              return tB - tA;
            });

            try {
              localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      });
    }

    // 4. Heartbeat polling fallback (1.5s)
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
      unsubscribeOrders();
      unsubscribeMenu();
      if (unsubscribeCloudMenu) unsubscribeCloudMenu();
      if (unsubscribeCloudOrders) unsubscribeCloudOrders();
      clearInterval(pollTimer);
    };
  }, [cloudVersion]);

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
    saveDishToCloud(newDish);
    broadcastMenuAction({ type: 'DISH_ADD', dish: newDish });
    return newDish;
  };

  const updateDish = (id, updatedFields) => {
    let targetDish = null;
    const updated = menuItems.map(item => {
      if (item.id === id) {
        targetDish = {
          ...item,
          ...updatedFields,
          price: Number(updatedFields.price !== undefined ? updatedFields.price : item.price)
        };
        return targetDish;
      }
      return item;
    });
    saveMenuItems(updated);
    if (targetDish) {
      saveDishToCloud(targetDish);
      broadcastMenuAction({ type: 'DISH_UPDATE', dish: targetDish });
    }
  };

  const deleteDish = (id) => {
    const updated = menuItems.filter(item => item.id !== id);
    saveMenuItems(updated);
    deleteDishFromCloud(id);
    broadcastMenuAction({ type: 'DISH_DELETE', dishId: id });
  };

  const toggleDishAvailability = (dishId) => {
    let toggledDish = null;
    const updated = menuItems.map(d => {
      if (d.id === dishId) {
        const newAvail = d.available === false ? true : false;
        showToast(`«${d.name}» ${newAvail ? 'повернуто в наявність' : 'поставлено в стоп-лист'}`);
        toggledDish = { ...d, available: newAvail };
        return toggledDish;
      }
      return d;
    });
    saveMenuItems(updated);
    if (toggledDish) {
      saveDishToCloud(toggledDish);
      broadcastMenuAction({ type: 'DISH_TOGGLE', dishId, available: toggledDish.available });
    }
  };

  const updateDishImage = (dishId, newImageDataUrl) => {
    let updatedDish = null;
    const updated = menuItems.map(d => {
      if (d.id === dishId) {
        updatedDish = { ...d, image: newImageDataUrl };
        return updatedDish;
      }
      return d;
    });
    saveMenuItems(updated);
    if (updatedDish) {
      saveDishToCloud(updatedDish);
      broadcastMenuAction({ type: 'DISH_UPDATE', dish: updatedDish });
    }
    showToast('Фото страви успішно оновлено!');
  };

  const resetToDefaultMenu = () => {
    setMenuItems(MENU_DATA.items);
    try {
      localStorage.removeItem(STORAGE_KEY_MENU);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    broadcastMenuAction({ type: 'FULL_MENU', items: MENU_DATA.items });
    if (isFirebaseConfigured()) {
      uploadFullMenuToCloud(MENU_DATA.items).catch(() => {});
    }
  };

  const syncMenuToCloud = async () => {
    broadcastMenuAction({ type: 'FULL_MENU', items: menuItems });
    if (isFirebaseConfigured()) {
      const success = await uploadFullMenuToCloud(menuItems);
      if (success) {
        showToast('☁️ Усе меню успішно вивантажено в хмару Firestore!');
      }
      return success;
    } else {
      showToast('☁️ Меню оновлено та синхронізовано з усіма пристроями ресторану!');
      return true;
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
      if (isFirebaseConfigured()) {
        uploadFullMenuToCloud(data).catch(() => {});
      }
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

      // Broadcast order across all local tabs & cloud devices immediately
      broadcastNewOrder(newEntry);
      sendOrderToCloud(newEntry);
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
    sendOrderToCloud(testOrder);
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
    broadcastOrderStatus(orderId, status);
    updateCloudOrderStatus(orderId, status);
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
          price: unitPrice,
          unitPrice,
          basePrice: dish.price,
          quantity: options.quantity || 1,
          crust,
          extras,
          image: dish.image,
          category: dish.category
        }
      ];
    });

    showToast(`«${dish.name}» додано до кошика!`);
  };

  const removeItem = (cartItemId) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY_CART);
    } catch {}
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + ((item.unitPrice || item.price) * item.quantity), 0);
  const itemCount = totalCount;
  const subtotal = totalPrice;
  const getDeliveryFee = () => 0;
  const getDiscount = () => 0;
  const getTotal = () => subtotal;

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalPrice,
        itemCount,
        subtotal,
        getDeliveryFee,
        getDiscount,
        getTotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        currentPage,
        setCurrentPage,
        navigateTo,
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
        clearOrdersHistory,
        // Cloud Database
        isCloudConnected,
        cloudMode,
        refreshCloudConnection,
        syncMenuToCloud
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
