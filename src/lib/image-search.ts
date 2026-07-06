// Client-side wrapper around server-function image search. The actual HTTP
// calls to Wikipedia/Openverse happen on the server to avoid browser CORS
// flakiness and to keep results consistent. Results are cached in-memory.

import {
  searchDestinationImages,
  searchDestinationGallery,
} from "./image-search.functions";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80";

export const IMAGE_PLACEHOLDER = PLACEHOLDER;

const cache = new Map<string, string[]>();
const inflight = new Map<string, Promise<string[]>>();

function cacheKey(query: string, count: number) {
  return `${query.toLowerCase().trim()}::${count}`;
}

/** Search up to `count` images for a query. Returns [] on failure. */
export async function searchImages(query: string, count = 9): Promise<string[]> {
  const q = query.trim();
  if (!q) return [];
  const key = cacheKey(q, count);
  const cached = cache.get(key);
  if (cached) return cached;
  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const { urls } = await searchDestinationImages({ data: { query: q, count } });
      cache.set(key, urls);
      return urls;
    } catch (err) {
      console.error("[image-search] failed", err);
      return [];
    } finally {
      inflight.delete(key);
    }
  })();
  inflight.set(key, promise);
  return promise;
}

/** Fetch a themed gallery — one unique image per theme. */
export async function searchGallery(
  destination: string,
  themes: string[],
): Promise<string[]> {
  const key = cacheKey(`gallery::${destination}::${themes.join("|")}`, themes.length);
  const cached = cache.get(key);
  if (cached) return cached;
  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const { urls } = await searchDestinationGallery({
        data: { destination, themes },
      });
      cache.set(key, urls);
      return urls;
    } catch (err) {
      console.error("[image-search] gallery failed", err);
      return [];
    } finally {
      inflight.delete(key);
    }
  })();
  inflight.set(key, promise);
  return promise;
}

/** Get a single representative image for a destination. */
export async function findDestinationImage(query: string): Promise<string | null> {
  const results = await searchImages(query, 5);
  return results[0] ?? null;
}
