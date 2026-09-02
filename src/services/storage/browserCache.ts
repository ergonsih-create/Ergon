/**
 * @license
 * GRAM-DISHA — Low-Bandwidth & Browser Cache Service
 * Provides client-side caching with explicit versioning and freshness stamps.
 */

export interface CachedEnvelope<T> {
  data: T;
  cachedAt: number;
  version: string;
  isStale: boolean;
}

export class BrowserCacheService {
  private static PREFIX = 'gram_disha_cache_';
  private static CACHE_VERSION = 'v1.0';
  private static DEFAULT_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours for reference data

  public static set<T>(key: string, data: T, ttlMs: number = this.DEFAULT_TTL_MS): void {
    try {
      const payload: CachedEnvelope<T> = {
        data,
        cachedAt: Date.now(),
        version: this.CACHE_VERSION,
        isStale: false,
      };
      localStorage.setItem(`${this.PREFIX}${key}`, JSON.stringify(payload));
    } catch (e) {
      console.warn('Browser storage quota exceeded or unavailable:', e);
    }
  }

  public static get<T>(key: string, maxAgeMs: number = this.DEFAULT_TTL_MS): CachedEnvelope<T> | null {
    try {
      const raw = localStorage.getItem(`${this.PREFIX}${key}`);
      if (!raw) return null;
      const parsed: CachedEnvelope<T> = JSON.parse(raw);
      if (parsed.version !== this.CACHE_VERSION) {
        localStorage.removeItem(`${this.PREFIX}${key}`);
        return null;
      }
      const isStale = (Date.now() - parsed.cachedAt) > maxAgeMs;
      return {
        ...parsed,
        isStale,
      };
    } catch (e) {
      return null;
    }
  }

  public static remove(key: string): void {
    try {
      localStorage.removeItem(`${this.PREFIX}${key}`);
    } catch (e) {}
  }

  public static clearAll(): void {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(this.PREFIX))
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }
}
