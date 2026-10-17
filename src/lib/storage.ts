/*
 * Everything is stored in this browser on this phone only. Nothing is sent
 * anywhere. Reads and writes are wrapped because storage can be unavailable
 * (private browsing, storage full) and the app must keep working anyway.
 */

export const KEYS = {
  settings: 'fp.settings.v1',
  profile: 'fp.profile.v1',
  history: 'fp.history.v1',
} as const;

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked. The app keeps working for this visit.
  }
}

/** Ask the browser not to evict our data under storage pressure. */
export function requestPersistence(): void {
  navigator.storage?.persist?.().catch(() => {});
}
