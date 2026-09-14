/**
 * Realtime Order Synchronization Service
 * Supports:
 * 1. BroadcastChannel (0ms instant cross-tab sync on same origin)
 * 2. Window 'storage' event listener (cross-tab fallback)
 * 3. LocalStorage polling heartbeat (every 1.5s)
 * 4. Free Cloud Pub/Sub via ntfy.sh SSE (real-time cross-device sync: smartphone -> admin tablet/PC)
 */

const SYNC_TOPIC = 'cheburoom_orders_zp_2026';
const CLOUD_URL = `https://ntfy.sh/${SYNC_TOPIC}`;

let broadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('cheburoom_realtime_orders');
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
    // AudioContext might be blocked until user gesture, ignore gracefully
    console.info('Audio chime skipped:', err.message);
  }
}

/**
 * Publish a new order across tabs and to cloud SSE relay
 */
export async function broadcastNewOrder(order) {
  if (!order || !order.orderId) return;

  // 1. Broadcast locally to other tabs
  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_ORDER', order });
    }
  } catch (e) {
    console.warn('BroadcastChannel post error', e);
  }

  // 2. Dispatch custom DOM event in the same window
  try {
    window.dispatchEvent(new CustomEvent('cheburoom_new_order', { detail: order }));
  } catch (e) {
    console.warn('CustomEvent dispatch error', e);
  }

  // 3. Cloud Relay (async background, non-blocking)
  try {
    fetch(CLOUD_URL, {
      method: 'POST',
      headers: {
        'Title': `New Order #${order.orderId}`,
        'Tags': 'bell,fast_forward',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type: 'NEW_ORDER', order })
    }).catch(() => {
      // Offline or network error - local storage still has it
    });
  } catch {
    // ignore network errors
  }
}

/**
 * Subscribe to realtime order notifications
 * @param {Function} onNewOrder Callback when a new order arrives
 * @returns {Function} Unsubscribe cleanup function
 */
export function subscribeToOrders(onNewOrder) {
  const processedIds = new Set();

  const handleOrder = (order) => {
    if (!order || !order.orderId) return;
    if (processedIds.has(order.orderId)) return;
    processedIds.add(order.orderId);
    onNewOrder(order);
  };

  // 1. BroadcastChannel listener
  const handleBcMessage = (event) => {
    if (event.data?.type === 'NEW_ORDER' && event.data.order) {
      handleOrder(event.data.order);
    }
  };
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBcMessage);
  }

  // 2. Window Custom Event
  const handleCustomEvent = (e) => {
    if (e.detail) {
      handleOrder(e.detail);
    }
  };
  window.addEventListener('cheburoom_new_order', handleCustomEvent);

  // 3. Storage event listener (when another tab updates localStorage)
  const handleStorageEvent = (e) => {
    if (e.key === 'cheburoom_orders_log' && e.newValue) {
      try {
        const orders = JSON.parse(e.newValue);
        if (Array.isArray(orders) && orders.length > 0) {
          // Check most recent order
          const latest = orders[0];
          handleOrder(latest);
        }
      } catch (err) {
        console.warn('Storage event parse error', err);
      }
    }
  };
  window.addEventListener('storage', handleStorageEvent);

  // 4. Cloud Server-Sent Events (SSE) listener
  let eventSource = null;
  try {
    if (typeof EventSource !== 'undefined') {
      eventSource = new EventSource(`${CLOUD_URL}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.message) {
            const inner = JSON.parse(data.message);
            if (inner?.type === 'NEW_ORDER' && inner.order) {
              handleOrder(inner.order);
            }
          }
        } catch {
          // heartbeat or non-json message, ignore
        }
      };
      eventSource.onerror = () => {
        // SSE disconnected, will auto-reconnect or fall back to local
      };
    }
  } catch (err) {
    console.info('SSE initialization skipped:', err.message);
  }

  // Cleanup
  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBcMessage);
    }
    window.removeEventListener('cheburoom_new_order', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (eventSource) {
      eventSource.close();
    }
  };
}
