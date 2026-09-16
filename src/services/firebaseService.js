/**
 * Firebase Firestore Cloud Service for ЧЕБУROOM
 * Provides real-time synchronization of menu, dishes, and orders across devices.
 * 
 * Free Tier (Spark Plan):
 * - 50,000 document reads / day
 * - 20,000 document writes / day
 * - 1 GB storage
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

const CONFIG_STORAGE_KEY = 'cheburoom_firebase_config';

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyA0Fjxp7YPbNWG0JOLGp8zF7AwXAbsqk3s",
  authDomain: "cheburoom-25fb6.firebaseapp.com",
  projectId: "cheburoom-25fb6",
  storageBucket: "cheburoom-25fb6.firebasestorage.app",
  messagingSenderId: "205431891685",
  appId: "1:205431891685:web:219b8ca0857b2deed2160c"
};

/**
 * Retrieves the currently active Firebase configuration object
 */
export function getStoredFirebaseConfig() {
  try {
    const custom = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse custom firebase config', e);
  }

  // Fallback to Vite environment variables if defined
  if (import.meta.env?.VITE_FIREBASE_API_KEY && import.meta.env?.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
    };
  }

  return DEFAULT_FIREBASE_CONFIG;
}

/**
 * Saves or updates Firebase configuration in localStorage
 */
export function saveFirebaseConfig(config) {
  if (!config || !config.apiKey || !config.projectId) {
    throw new Error('Конфігурація повинна містити щонайменше apiKey та projectId');
  }
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
}

/**
 * Removes custom Firebase configuration
 */
export function removeFirebaseConfig() {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
}

/**
 * Checks if Firebase is currently configured
 */
export function isFirebaseConfigured() {
  return Boolean(getStoredFirebaseConfig());
}

/**
 * Gets or initializes the Firebase app instance
 */
export function getFirebaseAppInstance() {
  const config = getStoredFirebaseConfig();
  if (!config) return null;

  try {
    if (getApps().length > 0) {
      return getApp();
    }
    return initializeApp(config);
  } catch (e) {
    console.error('Firebase initialization error:', e);
    return null;
  }
}

/**
 * Gets the Firestore database instance
 */
export function getFirestoreDb() {
  const app = getFirebaseAppInstance();
  if (!app) return null;
  try {
    return getFirestore(app);
  } catch (e) {
    console.error('Firestore get error:', e);
    return null;
  }
}

/**
 * Tests connection to Firestore with given or saved config
 */
export async function testFirebaseConnection(customConfig = null) {
  try {
    const configToTest = customConfig || getStoredFirebaseConfig();
    if (!configToTest || !configToTest.apiKey || !configToTest.projectId) {
      return { success: false, message: 'Ключі конфігурації Firebase не заповнено' };
    }

    // Initialize temporary app if custom
    let testApp;
    const existing = getApps().find(a => a.name === 'test_conn');
    if (existing) {
      testApp = existing;
    } else {
      testApp = initializeApp(configToTest, 'test_conn');
    }

    const testDb = getFirestore(testApp);
    const testRef = doc(testDb, 'system', 'connection_test');
    await setDoc(testRef, {
      status: 'connected',
      client: 'ЧЕБУROOM Admin',
      testedAt: serverTimestamp()
    }, { merge: true });

    return { success: true, message: 'Успішне підключення до Firebase Firestore!' };
  } catch (err) {
    console.error('Firebase test connection failed:', err);
    return {
      success: false,
      message: err.message || 'Не вдалося підключитися до бази даних. Перевірте правила доступу Firestore.'
    };
  }
}

/* ========================================================================== */
/*                              MENU OPERATIONS                               */
/* ========================================================================== */

const MENU_COLLECTION = 'restaurant_data';
const MENU_DOC = 'menu_catalog';

/**
 * Subscribes to real-time changes in the cloud menu
 * @param {Function} onMenuUpdate Callback with fresh array of dishes
 * @returns {Function|null} Unsubscribe function
 */
export function subscribeToCloudMenu(onMenuUpdate) {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const menuRef = doc(db, MENU_COLLECTION, MENU_DOC);
    return onSnapshot(menuRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.items) && data.items.length > 0) {
          onMenuUpdate(data.items);
        }
      }
    }, (err) => {
      console.warn('Cloud menu snapshot listener error:', err.message);
    });
  } catch (e) {
    console.warn('Failed to subscribe to cloud menu', e);
    return null;
  }
}

/**
 * Uploads/syncs the full menu array to Firestore
 */
export async function uploadFullMenuToCloud(items) {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firebase Firestore не налаштовано');

  const menuRef = doc(db, MENU_COLLECTION, MENU_DOC);
  await setDoc(menuRef, {
    items,
    updatedAt: new Date().toISOString(),
    totalItems: items.length
  });
  return true;
}

/**
 * Saves a single dish change to the cloud menu
 */
export async function saveDishToCloud(dish) {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const menuRef = doc(db, MENU_COLLECTION, MENU_DOC);
    const snap = await getDoc(menuRef);
    let items = [];
    if (snap.exists()) {
      items = snap.data().items || [];
    }

    const idx = items.findIndex(d => d.id === dish.id);
    if (idx > -1) {
      items[idx] = { ...items[idx], ...dish };
    } else {
      items.unshift(dish);
    }

    await setDoc(menuRef, { items, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (e) {
    console.warn('saveDishToCloud failed', e);
    return false;
  }
}

/**
 * Deletes a dish from the cloud menu
 */
export async function deleteDishFromCloud(dishId) {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const menuRef = doc(db, MENU_COLLECTION, MENU_DOC);
    const snap = await getDoc(menuRef);
    if (snap.exists()) {
      const items = (snap.data().items || []).filter(d => d.id !== dishId);
      await setDoc(menuRef, { items, updatedAt: new Date().toISOString() }, { merge: true });
      return true;
    }
  } catch (e) {
    console.warn('deleteDishFromCloud failed', e);
  }
  return false;
}

/* ========================================================================== */
/*                             ORDERS OPERATIONS                              */
/* ========================================================================== */

const ORDERS_COLLECTION = 'orders';

/**
 * Sends a customer order to Firestore
 */
export async function sendOrderToCloud(order) {
  const db = getFirestoreDb();
  if (!db || !order || !order.orderId) return false;

  try {
    const orderRef = doc(db, ORDERS_COLLECTION, order.orderId);
    await setDoc(orderRef, {
      ...order,
      cloudCreatedAt: serverTimestamp(),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (e) {
    console.warn('sendOrderToCloud error', e);
    return false;
  }
}

/**
 * Subscribes to realtime incoming orders from Firestore
 * @param {Function} onOrdersUpdate Callback receiving latest orders array
 * @returns {Function|null} Unsubscribe function
 */
export function subscribeToCloudOrders(onOrdersUpdate) {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);

    return onSnapshot(ordersRef, (snapshot) => {
      const orders = [];
      snapshot.forEach(d => {
        const data = d.data();
        if (data && data.orderId) {
          orders.push(data);
        }
      });
      orders.sort((a, b) => {
        const tA = new Date(a.createdAt || 0).getTime();
        const tB = new Date(b.createdAt || 0).getTime();
        return tB - tA;
      });
      onOrdersUpdate(orders);
    }, (err) => {
      console.warn('Cloud orders listener error:', err.message);
    });
  } catch (e) {
    console.warn('Failed to subscribe to cloud orders', e);
    return null;
  }
}

/**
 * Updates order status in Firestore
 */
export async function updateCloudOrderStatus(orderId, status) {
  const db = getFirestoreDb();
  if (!db || !orderId) return false;

  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      statusUpdatedAt: new Date().toISOString()
    });
    return true;
  } catch (e) {
    console.warn('updateCloudOrderStatus error', e);
    return false;
  }
}

/**
 * Deletes an order from Firestore
 */
export async function deleteCloudOrder(orderId) {
  const db = getFirestoreDb();
  if (!db || !orderId) return false;

  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(orderRef);
    return true;
  } catch (e) {
    console.warn('deleteCloudOrder error', e);
    return false;
  }
}

/**
 * Clears multiple orders from Firestore
 */
export async function clearCloudOrders(orders) {
  const db = getFirestoreDb();
  if (!db || !Array.isArray(orders)) return false;

  try {
    await Promise.all(orders.map(o => {
      if (o && o.orderId) {
        return deleteDoc(doc(db, ORDERS_COLLECTION, o.orderId)).catch(() => {});
      }
      return Promise.resolve();
    }));
    return true;
  } catch (e) {
    console.warn('clearCloudOrders error', e);
    return false;
  }
}
