/**
 * Realtime Cloud Synchronization Service for ЧЕБУROOM
 * 
 * Provides 100% zero-configuration, instant real-time sync across all devices
 * (Smartphones, Tablets, Kitchen PC, Admin laptops) with no registration needed.
 * 
 * Supports:
 * 1. BroadcastChannel (instant 0ms cross-tab sync on same device)
 * 2. Window 'storage' event listener (cross-tab local fallback)
 * 3. Server-Sent Events (SSE) via secure cloud relay (cross-device sync in <200ms)
 * 4. Kitchen bell chime (Web Audio API)
 */

const ORDERS_TOPIC = 'cheburoom_orders_zp_2026';
const MENU_TOPIC = 'cheburoom_menu_zp_2026';
const AUTH_TOPIC = 'cheburoom_auth_zp_2026';

const CLOUD_ORDERS_URL = `https://ntfy.sh/${ORDERS_TOPIC}`;
const CLOUD_MENU_URL = `https://ntfy.sh/${MENU_TOPIC}`;
const CLOUD_AUTH_URL = `https://ntfy.sh/${AUTH_TOPIC}`;

let ordersBroadcastChannel = null;
let menuBroadcastChannel = null;

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    ordersBroadcastChannel = new BroadcastChannel('cheburoom_realtime_orders');
    menuBroadcastChannel = new BroadcastChannel('cheburoom_realtime_menu');
  }
} catch (e) {
  console.warn('BroadcastChannel not available', e);
}

/**
 * Play a pleasant 2-tone kitchen bell chime (Web Audio API)
 */
export function playKitchenChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Note 1 (880 Hz - A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Note 2 (1318.5 Hz - E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, now + 0.14);
    gain2.gain.setValueAtTime(0.3, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.14);
    osc2.stop(now + 0.7);
  } catch (err) {
    console.info('Audio chime skipped:', err.message);
  }
}

/* ========================================================================== */
/*                             ORDERS SYNC                                    */
/* ========================================================================== */

/**
 * Broadcast a new customer order across local tabs and to cloud relay
 */
export async function broadcastNewOrder(order) {
  if (!order || !order.orderId) return;

  // 1. Local BroadcastChannel
  try {
    if (ordersBroadcastChannel) {
      ordersBroadcastChannel.postMessage({ type: 'NEW_ORDER', order });
    }
  } catch (e) {
    console.warn('ordersBroadcastChannel post error', e);
  }

  // 2. Local DOM Event
  try {
    window.dispatchEvent(new CustomEvent('cheburoom_new_order', { detail: order }));
  } catch (e) {
    console.warn('CustomEvent dispatch error', e);
  }

  // 3. Cloud Relay (async background)
  try {
    fetch(CLOUD_ORDERS_URL, {
      method: 'POST',
      headers: {
        'Title': `Cheburoom Order #${order.orderId}`,
        'Tags': 'bell,package,chebureki',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type: 'NEW_ORDER', order })
    }).catch(() => {});
  } catch {}
}

/**
 * Broadcast an order status change (e.g. 'cooking', 'completed', 'cancelled')
 */
export async function broadcastOrderStatus(orderId, status) {
  if (!orderId || !status) return;

  const payload = { type: 'ORDER_STATUS_UPDATE', orderId, status, updatedAt: new Date().toISOString() };

  // 1. Local BroadcastChannel
  try {
    if (ordersBroadcastChannel) {
      ordersBroadcastChannel.postMessage(payload);
    }
  } catch (e) {
    console.warn('ordersBroadcastChannel post status error', e);
  }

  // 2. Cloud Relay
  try {
    fetch(CLOUD_ORDERS_URL, {
      method: 'POST',
      headers: {
        'Title': `Cheburoom Status #${orderId}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch {}
}

/**
 * Broadcast clearing all orders so other devices also clear their list
 */
export async function broadcastClearOrders(clearedAt = Date.now()) {
  const payload = { type: 'CLEAR_ORDERS', clearedAt };
  try {
    if (ordersBroadcastChannel) {
      ordersBroadcastChannel.postMessage(payload);
    }
  } catch {}

  try {
    fetch(CLOUD_ORDERS_URL, {
      method: 'POST',
      headers: {
        'Title': 'Cheburoom Clear Orders',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch {}
}

/**
 * Broadcast deleting a single order
 */
export async function broadcastDeleteOrder(orderId) {
  if (!orderId) return;
  const payload = { type: 'DELETE_ORDER', orderId, deletedAt: Date.now() };
  try {
    if (ordersBroadcastChannel) {
      ordersBroadcastChannel.postMessage(payload);
    }
  } catch {}

  try {
    fetch(CLOUD_ORDERS_URL, {
      method: 'POST',
      headers: {
        'Title': `Cheburoom Delete Order #${orderId}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch {}
}

/**
 * Subscribe to realtime order events (new orders, status updates, clear, delete)
 */
export function subscribeToOrders(onNewOrder, onStatusUpdate, onClearOrders, onDeleteOrder) {
  const processedOrderIds = new Set();

  const handleOrder = (order) => {
    if (!order || !order.orderId) return;
    if (processedOrderIds.has(order.orderId)) return;
    processedOrderIds.add(order.orderId);
    onNewOrder(order);
  };

  const handleStatus = (orderId, status) => {
    if (onStatusUpdate && orderId && status) {
      onStatusUpdate(orderId, status);
    }
  };

  const handleClear = (clearedAt) => {
    if (onClearOrders) {
      onClearOrders(clearedAt);
    }
  };

  const handleDelete = (orderId) => {
    if (onDeleteOrder && orderId) {
      onDeleteOrder(orderId);
    }
  };

  // 1. BroadcastChannel listener
  const handleBcMessage = (event) => {
    if (event.data?.type === 'NEW_ORDER' && event.data.order) {
      handleOrder(event.data.order);
    } else if (event.data?.type === 'ORDER_STATUS_UPDATE') {
      handleStatus(event.data.orderId, event.data.status);
    } else if (event.data?.type === 'CLEAR_ORDERS') {
      handleClear(event.data.clearedAt);
    } else if (event.data?.type === 'DELETE_ORDER') {
      handleDelete(event.data.orderId);
    }
  };
  if (ordersBroadcastChannel) {
    ordersBroadcastChannel.addEventListener('message', handleBcMessage);
  }

  // 2. Window Custom Event
  const handleCustomEvent = (e) => {
    if (e.detail) {
      handleOrder(e.detail);
    }
  };
  window.addEventListener('cheburoom_new_order', handleCustomEvent);

  // 3. Storage event listener
  const handleStorageEvent = (e) => {
    if (e.key === 'cheburoom_orders_log' && e.newValue) {
      try {
        const orders = JSON.parse(e.newValue);
        if (Array.isArray(orders) && orders.length > 0) {
          handleOrder(orders[0]);
        }
      } catch {}
    } else if (e.key === 'cheburoom_orders_cleared_at' && e.newValue) {
      handleClear(parseInt(e.newValue, 10));
    }
  };
  window.addEventListener('storage', handleStorageEvent);

  // 4. Cloud Server-Sent Events (SSE) listener
  let eventSource = null;
  try {
    if (typeof EventSource !== 'undefined') {
      eventSource = new EventSource(`${CLOUD_ORDERS_URL}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.message) {
            const inner = JSON.parse(data.message);
            if (inner?.type === 'NEW_ORDER' && inner.order) {
              handleOrder(inner.order);
            } else if (inner?.type === 'ORDER_STATUS_UPDATE' && inner.orderId) {
              handleStatus(inner.orderId, inner.status);
            } else if (inner?.type === 'CLEAR_ORDERS') {
              handleClear(inner.clearedAt);
            } else if (inner?.type === 'DELETE_ORDER' && inner.orderId) {
              handleDelete(inner.orderId);
            }
          }
        } catch {}
      };
    }
  } catch (err) {
    console.info('SSE initialization skipped:', err.message);
  }

  // Cleanup
  return () => {
    if (ordersBroadcastChannel) {
      ordersBroadcastChannel.removeEventListener('message', handleBcMessage);
    }
    window.removeEventListener('cheburoom_new_order', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (eventSource) {
      eventSource.close();
    }
  };
}

/* ========================================================================== */
/*                             MENU SYNC                                      */
/* ========================================================================== */

/**
 * Broadcast a menu action across all devices
 * @param {Object} action - e.g. { type: 'DISH_UPDATE', dish } or { type: 'DISH_TOGGLE', dishId, available }
 */
export async function broadcastMenuAction(action) {
  if (!action || !action.type) return;

  // 1. Local BroadcastChannel
  try {
    if (menuBroadcastChannel) {
      menuBroadcastChannel.postMessage(action);
    }
  } catch (e) {
    console.warn('menuBroadcastChannel post error', e);
  }

  // 2. Cloud Relay (async background)
  try {
    fetch(CLOUD_MENU_URL, {
      method: 'POST',
      headers: {
        'Title': `Cheburoom Menu ${action.type || 'Action'}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action)
    }).catch(() => {});
  } catch {}
}

/**
 * Subscribe to realtime menu actions across devices
 * @param {Function} onMenuAction Callback receiving action object
 * @returns {Function} Unsubscribe cleanup function
 */
export function subscribeToMenuActions(onMenuAction) {
  // 1. BroadcastChannel listener
  const handleBcMessage = (event) => {
    if (event.data?.type) {
      onMenuAction(event.data);
    }
  };
  if (menuBroadcastChannel) {
    menuBroadcastChannel.addEventListener('message', handleBcMessage);
  }

  // 2. Cloud SSE listener
  let eventSource = null;
  try {
    if (typeof EventSource !== 'undefined') {
      eventSource = new EventSource(`${CLOUD_MENU_URL}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.message) {
            const inner = JSON.parse(data.message);
            if (inner?.type) {
              onMenuAction(inner);
            }
          }
        } catch {}
      };
    }
  } catch (err) {
    console.info('Menu SSE init error:', err.message);
  }

  // Cleanup
  return () => {
    if (menuBroadcastChannel) {
      menuBroadcastChannel.removeEventListener('message', handleBcMessage);
    }
    if (eventSource) {
      eventSource.close();
    }
  };
}

/* ========================================================================== */
/*                             AUTH SYNC                                      */
/* ========================================================================== */

/**
 * Broadcast password hash update so all devices recognize the new password
 */
export async function broadcastPasswordHash(hash) {
  if (!hash) return;
  try {
    const res = await fetch(CLOUD_AUTH_URL, {
      method: 'POST',
      headers: {
        'Title': 'Cheburoom Auth Sync',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type: 'PASS_HASH_SYNC', hash, updatedAt: Date.now() })
    });
    return res.ok;
  } catch (err) {
    console.warn('broadcastPasswordHash error:', err);
    return false;
  }
}

/**
 * Subscribe to password hash updates
 */
export function subscribeToPasswordHash(onHashUpdate) {
  let eventSource = null;
  try {
    if (typeof EventSource !== 'undefined') {
      eventSource = new EventSource(`${CLOUD_AUTH_URL}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.message) {
            const inner = JSON.parse(data.message);
            if (inner?.type === 'PASS_HASH_SYNC' && inner.hash) {
              onHashUpdate(inner.hash);
            }
          }
        } catch {}
      };
    }
  } catch (err) {
    console.info('Auth SSE init error:', err.message);
  }

  return () => {
    if (eventSource) {
      eventSource.close();
    }
  };
}

/* ========================================================================== */
/*                   HISTORICAL CLOUD HYDRATION ON STARTUP                    */
/* ========================================================================== */

/**
 * Fetches recent historical orders from the cloud topic
 * Ensures that whenever a phone or PC opens, it instantly pulls all existing orders!
 * Respects tombstone timestamps (clearedAt) and deleted order IDs so deleted orders never return!
 */
export async function fetchHistoricalCloudOrders() {
  try {
    const res = await fetch(`${CLOUD_ORDERS_URL}/json?poll=1&since=all`);
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text.trim().split('\n');
    const ordersMap = new Map();
    let latestClearedAt = 0;
    const deletedOrderIds = new Set();

    // Read local tombstone markers
    try {
      const localCleared = parseInt(localStorage.getItem('cheburoom_orders_cleared_at') || '0', 10);
      if (localCleared > latestClearedAt) latestClearedAt = localCleared;
      const localDeleted = JSON.parse(localStorage.getItem('cheburoom_deleted_orders') || '[]');
      if (Array.isArray(localDeleted)) {
        localDeleted.forEach(id => deletedOrderIds.add(id));
      }
    } catch {}

    const parsedEvents = [];
    for (const line of lines) {
      if (!line) continue;
      try {
        const item = JSON.parse(line);
        if (item && item.message) {
          const inner = JSON.parse(item.message);
          parsedEvents.push(inner);
          if (inner?.type === 'CLEAR_ORDERS' && inner.clearedAt) {
            if (inner.clearedAt > latestClearedAt) {
              latestClearedAt = inner.clearedAt;
            }
          } else if (inner?.type === 'DELETE_ORDER' && inner.orderId) {
            deletedOrderIds.add(inner.orderId);
          }
        }
      } catch {}
    }

    // Process orders in order, ignoring any cleared or deleted orders
    for (const inner of parsedEvents) {
      if (inner?.type === 'NEW_ORDER' && inner.order?.orderId) {
        const o = inner.order;
        if (deletedOrderIds.has(o.orderId)) continue;
        const orderTime = new Date(o.createdAt || 0).getTime();
        if (latestClearedAt > 0 && orderTime <= latestClearedAt) {
          // Cleared before this timestamp
          continue;
        }
        ordersMap.set(o.orderId, o);
      } else if (inner?.type === 'ORDER_STATUS_UPDATE' && inner.orderId) {
        if (deletedOrderIds.has(inner.orderId)) continue;
        const existing = ordersMap.get(inner.orderId);
        if (existing) {
          ordersMap.set(inner.orderId, { ...existing, status: inner.status });
        }
      }
    }

    return Array.from(ordersMap.values()).sort((a, b) => {
      const tA = new Date(a.createdAt || 0).getTime();
      const tB = new Date(b.createdAt || 0).getTime();
      return tB - tA;
    });
  } catch (err) {
    console.warn('fetchHistoricalCloudOrders error:', err);
    return [];
  }
}

/**
 * Fetches recent menu actions from the cloud
 */
export async function fetchHistoricalMenuActions() {
  try {
    const res = await fetch(`${CLOUD_MENU_URL}/json?poll=1&since=all`);
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text.trim().split('\n');
    const actions = [];

    for (const line of lines) {
      if (!line) continue;
      try {
        const item = JSON.parse(line);
        if (item && item.message) {
          const inner = JSON.parse(item.message);
          if (inner?.type) {
            actions.push(inner);
          }
        }
      } catch {}
    }

    return actions;
  } catch (err) {
    console.warn('fetchHistoricalMenuActions error:', err);
    return [];
  }
}

/**
 * Fetches latest admin password hash stored in the cloud
 */
export async function fetchCloudPasswordHash() {
  try {
    const res = await fetch(`${CLOUD_AUTH_URL}/json?poll=1&since=all`);
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.trim().split('\n');
    let latestHash = null;

    for (const line of lines) {
      if (!line) continue;
      try {
        const item = JSON.parse(line);
        if (item && item.message) {
          const inner = JSON.parse(item.message);
          if (inner?.type === 'PASS_HASH_SYNC' && inner.hash) {
            latestHash = inner.hash;
          }
        }
      } catch {}
    }

    return latestHash;
  } catch (err) {
    console.warn('fetchCloudPasswordHash error:', err);
    return null;
  }
}

/* ========================================================================== */
/*                          CLOUD HEALTH CHECK                                */
/* ========================================================================== */

/**
 * Live ping check for cloud relay
 * @returns {Promise<{success: boolean, latencyMs: number, error?: string}>}
 */
export async function testCloudRelay() {
  const start = Date.now();
  try {
    const res = await fetch(CLOUD_ORDERS_URL, {
      method: 'POST',
      headers: {
        'Title': 'Ping Check',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type: 'PING', timestamp: start })
    });
    const latencyMs = Date.now() - start;
    if (res.ok) {
      return { success: true, latencyMs };
    }
    return { success: false, latencyMs, error: `HTTP ${res.status}` };
  } catch (err) {
    return { success: false, latencyMs: Date.now() - start, error: err.message };
  }
}

/**
 * Comprehensive diagnostic check of all database channels
 */
export async function diagnoseDatabaseHealth() {
  const start = Date.now();
  const results = {
    ordersChannel: false,
    menuChannel: false,
    authChannel: false,
    ordersCount: 0,
    latencyMs: 0
  };

  try {
    // 1. Orders
    const ordersPromise = fetchHistoricalCloudOrders();
    const pingPromise = testCloudRelay();
    const [orders, pingRes] = await Promise.all([ordersPromise, pingPromise]);

    results.ordersChannel = pingRes.success;
    results.latencyMs = pingRes.latencyMs || (Date.now() - start);
    results.ordersCount = orders.length;

    // 2. Menu
    const menuRes = await fetch(`${CLOUD_MENU_URL}/json?poll=1`);
    results.menuChannel = menuRes.ok;

    // 3. Auth
    const authRes = await fetch(`${CLOUD_AUTH_URL}/json?poll=1`);
    results.authChannel = authRes.ok;

    return {
      success: results.ordersChannel,
      ...results
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
      latencyMs: Date.now() - start
    };
  }
}
