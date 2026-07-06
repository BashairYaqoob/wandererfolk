// Dynamic image search using Openverse (free, no API key, CORS-enabled).
// https://api.openverse.org/v1/images/

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80";

export const IMAGE_PLACEHOLDER = PLACEHOLDER;

type OpenverseImage = {
  url?: string;
  thumbnail?: string;
  title?: string;
};

type OpenverseResponse = {
  results?: OpenverseImage[];
};

const cache = new Map<string, string[]>();
const inflight = new Map<string, Promise<string[]>>();

function cacheKey(query: string, count: number) {
  return `${query.toLowerCase().trim()}::${count}`;
}

async function fetchFromOpenverse(query: string, count: number): Promise<string[]> {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(
    query,
  )}&page_size=${count}&mature=false&license_type=all`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Openverse ${res.status}`);
  const data = (await res.json()) as OpenverseResponse;
  const urls = (data.results ?? [])
    .map((r) => r.url || r.thumbnail)
    .filter((u): u is string => Boolean(u));
  return urls;
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
      const urls = await fetchFromOpenverse(q, count);
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

/** Search a themed gallery: one image per theme, all unique. */
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
      // Fetch a large pool for the destination, then diversify with per-theme queries.
      const seen = new Set<string>();
      const gallery: string[] = [];
      // Per-theme queries first for topical variety.
      const perTheme = await Promise.all(
        themes.map((theme) =>
          fetchFromOpenverse(`${destination} ${theme}`, 3).catch(() => []),
        ),
      );
      for (const list of perTheme) {
        const pick = list.find((u) => !seen.has(u));
        if (pick) {
          seen.add(pick);
          gallery.push(pick);
        } else {
          gallery.push(""); // placeholder slot
        }
      }
      // Backfill any empty slots from a broader destination search.
      if (gallery.some((g) => !g)) {
        const pool = await fetchFromOpenverse(destination, themes.length * 3).catch(
          () => [],
        );
        for (let i = 0; i < gallery.length; i++) {
          if (gallery[i]) continue;
          const next = pool.find((u) => !seen.has(u));
          if (next) {
            seen.add(next);
            gallery[i] = next;
          }
        }
      }
      cache.set(key, gallery);
      return gallery;
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
