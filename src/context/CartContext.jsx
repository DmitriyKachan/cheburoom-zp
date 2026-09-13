import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENU_DATA } from '../data/menuData';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const storageKey = 'cheburoom_react_cart_v1';
  
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

  const getDeliveryFee = (type = 'delivery') => {
    if (type === 'pickup' || subtotal === 0 || subtotal >= MENU_DATA.info.freeDeliveryThreshold) {
      return 0;
    }
    return MENU_DATA.info.deliveryCost;
  };

  const getDiscount = (type = 'delivery') => {
    if (type === 'pickup') {
      return Math.round(subtotal * 0.10);
    }
    return 0;
  };

  const getTotal = (type = 'delivery') => {
    return Math.max(0, subtotal - getDiscount(type) + getDeliveryFee(type));
  };

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
        toggleTheme
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
