import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENU_DATA } from '../data/menuData';
import {
  fetchMenuFromGoogleSheet,
  extractSheetId,
  STORAGE_KEYS
} from '../services/googleSheetsService';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const storageKey = 'cheburoom_react_cart_v1';
  
  // Menu items state (from Google Sheets or local default)
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading cached menu', e);
    }
    return MENU_DATA.items;
  });

  const [sheetId, setSheetId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SHEET_ID) || '';
    } catch {
      return '';
    }
  });

  const [lastSyncTime, setLastSyncTime] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || null;
    } catch {
      return null;
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Background auto-refresh from Google Sheets if configured
  useEffect(() => {
    if (!sheetId) return;
    let isMounted = true;

    async function silentBackgroundSync() {
      try {
        const freshDishes = await fetchMenuFromGoogleSheet(sheetId);
        if (isMounted && freshDishes && freshDishes.length > 0) {
          setMenuItems(freshDishes);
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastSyncTime(nowStr);
          localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(freshDishes));
          localStorage.setItem(STORAGE_KEYS.LAST_SYNC, nowStr);
        }
      } catch (err) {
        // Silently use cached menu if offline or error
        console.info('Background Google Sheet sync skipped or offline:', err.message);
      }
    }

    silentBackgroundSync();
    return () => { isMounted = false; };
  }, [sheetId]);

  const syncFromGoogleSheets = async (urlOrId) => {
    const cleanId = extractSheetId(urlOrId);
    if (!cleanId) {
      throw new Error('Некоректний URL або ID Google Таблиці');
    }

    setIsSyncing(true);
    try {
      const freshDishes = await fetchMenuFromGoogleSheet(cleanId);
      if (!freshDishes || freshDishes.length === 0) {
        throw new Error('Таблиця не містить валідних страв');
      }

      setMenuItems(freshDishes);
      setSheetId(cleanId);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(nowStr);

      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(freshDishes));
      localStorage.setItem(STORAGE_KEYS.SHEET_ID, cleanId);
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, nowStr);

      return freshDishes;
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleDishAvailability = (dishId) => {
    setMenuItems(prev => {
      const updated = prev.map(d => {
        if (d.id === dishId) {
          const newAvail = d.available === false ? true : false;
          showToast(`«${d.name}» ${newAvail ? 'повернуто в наявність' : 'поставлено в стоп-лист'}`);
          return { ...d, available: newAvail };
        }
        return d;
      });

      try {
        localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage error', e);
      }

      return updated;
    });
  };

  const resetToDefaultMenu = () => {
    setMenuItems(MENU_DATA.items);
    setSheetId('');
    setLastSyncTime(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.MENU_ITEMS);
      localStorage.removeItem(STORAGE_KEYS.SHEET_ID);
      localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  };

  const setSheetIdAndSave = (id) => {
    setSheetId(id);
    localStorage.setItem(STORAGE_KEYS.SHEET_ID, id);
  };
  
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDishForModal, setSelectedDishForModal] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Page Routing State ('menu' | 'checkout')
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#checkout' || hash === '#cart' || hash === '#order') {
        return 'checkout';
      }
    }
    return 'menu';
  });

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      if (page === 'checkout') {
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
      if (hash === '#checkout' || hash === '#cart' || hash === '#order') {
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
      const saved = localStorage.getItem('cheburoom_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [items]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('cheburoom_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('cheburoom_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

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
        // Menu management & Google Sheets sync
        menuItems,
        sheetId,
        lastSyncTime,
        isSyncing,
        isAdminOpen,
        setIsAdminOpen,
        syncFromGoogleSheets,
        setSheetIdAndSave,
        toggleDishAvailability,
        resetToDefaultMenu
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
