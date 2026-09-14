// Cryptographic Auth Service for Cheburoom Admin

const STORAGE_KEYS = {
  PASS_HASH: 'cheburoom_admin_hash_v1',
  LOCKOUT_UNTIL: 'cheburoom_admin_lockout_until',
  FAILED_ATTEMPTS: 'cheburoom_admin_failed_attempts'
};

const SESSION_KEY = 'cheburoom_admin_session_token';
const DEFAULT_PASSWORD = 'chebu2026'; // Default initial password

/**
 * Computes SHA-256 hex string using browser native Web Crypto API
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_cheburoom_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Initializes default password hash if not set
 */
async function ensurePasswordInitialized() {
  const existing = localStorage.getItem(STORAGE_KEYS.PASS_HASH);
  if (!existing) {
    const defaultHash = await hashPassword(DEFAULT_PASSWORD);
    localStorage.setItem(STORAGE_KEYS.PASS_HASH, defaultHash);
  }
}

/**
 * Checks lockout state (returns seconds remaining if locked, or 0)
 */
export function getLockoutRemainingSeconds() {
  try {
    const lockoutUntil = localStorage.getItem(STORAGE_KEYS.LOCKOUT_UNTIL);
    if (!lockoutUntil) return 0;
    const diff = parseInt(lockoutUntil, 10) - Date.now();
    return diff > 0 ? Math.ceil(diff / 1000) : 0;
  } catch {
    return 0;
  }
}

/**
 * Authenticates user with entered password
 */
export async function authenticateAdmin(password) {
  const remaining = getLockoutRemainingSeconds();
  if (remaining > 0) {
    throw new Error(`Вхід тимчасово заблоковано. Зачекайте ${remaining} сек.`);
  }

  await ensurePasswordInitialized();
  const storedHash = localStorage.getItem(STORAGE_KEYS.PASS_HASH);
  const enteredHash = await hashPassword(password.trim());

  if (enteredHash === storedHash) {
    // Success: reset failed attempts, grant session
    localStorage.removeItem(STORAGE_KEYS.FAILED_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);

    const token = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    sessionStorage.setItem(SESSION_KEY, token);
    return true;
  } else {
    // Failure: increment attempt counter
    const currentAttempts = parseInt(localStorage.getItem(STORAGE_KEYS.FAILED_ATTEMPTS) || '0', 10) + 1;
    localStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, currentAttempts.toString());

    if (currentAttempts >= 5) {
      // Lockout for 10 minutes (600,000 ms)
      const lockUntil = Date.now() + 10 * 60 * 1000;
      localStorage.setItem(STORAGE_KEYS.LOCKOUT_UNTIL, lockUntil.toString());
      throw new Error('5 невірних спроб введення! Вхід заблоковано на 10 хвилин для захисту.');
    }

    const attemptsLeft = 5 - currentAttempts;
    throw new Error(`Невірний пароль! Залишилось спроб: ${attemptsLeft}`);
  }
}

/**
 * Checks if current browser tab has an active admin session
 */
export function isAdminAuthenticated() {
  try {
    const token = sessionStorage.getItem(SESSION_KEY);
    return Boolean(token && token.startsWith('session_'));
  } catch {
    return false;
  }
}

/**
 * Destroys current session
 */
export function logoutAdmin() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

/**
 * Changes admin password
 */
export async function changeAdminPassword(oldPassword, newPassword) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Новий пароль повинен містити щонайменше 6 символів');
  }

  const storedHash = localStorage.getItem(STORAGE_KEYS.PASS_HASH);
  const oldHash = await hashPassword(oldPassword.trim());

  if (storedHash && oldHash !== storedHash) {
    throw new Error('Поточний пароль вказано невірно');
  }

  const newHash = await hashPassword(newPassword.trim());
  localStorage.setItem(STORAGE_KEYS.PASS_HASH, newHash);
  return true;
}
