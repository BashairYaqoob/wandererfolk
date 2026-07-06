// Dynamic image search using the Wikipedia MediaWiki API — free, no API key,
// CORS-enabled via origin=*. Returns real thumbnail URLs from Wikimedia
// Commons pages that match the query.

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80";

export const IMAGE_PLACEHOLDER = PLACEHOLDER;

type MediaWikiPage = {
  pageid?: number;
  title?: string;
  index?: number;
  thumbnail?: { source: string; width: number; height: number };
  original?: { source: string };
};

type MediaWikiResponse = {
  query?: { pages?: Record<string, MediaWikiPage> };
};

const cache = new Map<string, string[]>();
const inflight = new Map<string, Promise<string[]>>();

function cacheKey(query: string, count: number) {
  return `${query.toLowerCase().trim()}::${count}`;
}

async function fetchFromWikipedia(query: string, count: number): Promise<string[]> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrlimit: String(Math.max(count, 3)),
    prop: "pageimages",
    piprop: "thumbnail|original",
    pithumbsize: "1200",
    format: "json",
    origin: "*",
  });
  const url = `https://en.wikipedia.org/w/api.php?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Wikipedia ${res.status}`);
  const data = (await res.json()) as MediaWikiResponse;
  const pages = Object.values(data.query?.pages ?? {}) as MediaWikiPage[];
  return pages
    .sort((a, b) => (a.index ?? 999) - (b.index ?? 999))
    .map((p) => p.thumbnail?.source || p.original?.source)
    .filter((u): u is string => Boolean(u))
    .slice(0, count);
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
      const urls = await fetchFromWikipedia(q, count);
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

/**
 * Fetch a themed gallery — one unique image per theme. Each theme runs its
 * own query so the result is diverse (landmarks, food, architecture, etc.).
 */
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
    const seen = new Set<string>();
    const gallery: string[] = new Array(themes.length).fill("");

    // Fire one search per theme, in parallel.
    const perTheme = await Promise.all(
      themes.map((theme) =>
        fetchFromWikipedia(`${destination} ${theme}`, 4).catch(() => [] as string[]),
      ),
    );
    for (let i = 0; i < themes.length; i++) {
      const pick = perTheme[i].find((u) => !seen.has(u));
      if (pick) {
        seen.add(pick);
        gallery[i] = pick;
      }
    }

    // Backfill any missing slots with broader destination searches.
    if (gallery.some((g) => !g)) {
      const pool = await fetchFromWikipedia(destination, themes.length * 3).catch(
        () => [] as string[],
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
  })();
  inflight.set(key, promise);
  return promise;
}

/** Get a single representative image for a destination. */
export async function findDestinationImage(query: string): Promise<string | null> {
  const results = await searchImages(query, 5);
  return results[0] ?? null;
}
