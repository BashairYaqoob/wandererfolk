import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SearchInput = z.object({
  query: z.string().min(1).max(200),
  count: z.number().int().min(1).max(20).default(9),
});

const GalleryInput = z.object({
  destination: z.string().min(1).max(200),
  themes: z.array(z.string().min(1).max(120)).min(1).max(12),
});

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

async function fetchWikiImages(query: string, count: number): Promise<string[]> {
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
  const res = await fetch(url, {
    headers: {
      // Wikipedia asks for a descriptive UA on API requests.
      "User-Agent": "WanderfolkTravelApp/1.0 (image search)",
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`wikipedia ${res.status}`);
  const data = (await res.json()) as MediaWikiResponse;
  const pages = Object.values(data.query?.pages ?? {}) as MediaWikiPage[];
  return pages
    .sort((a, b) => (a.index ?? 999) - (b.index ?? 999))
    .map((p) => p.thumbnail?.source || p.original?.source)
    .filter((u): u is string => Boolean(u))
    .slice(0, count);
}

async function fetchOpenverseImages(query: string, count: number): Promise<string[]> {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=${count}&mature=false`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "WanderfolkTravelApp/1.0",
    },
  });
  if (!res.ok) throw new Error(`openverse ${res.status}`);
  const data = (await res.json()) as { results?: { url?: string; thumbnail?: string }[] };
  return (data.results ?? [])
    .map((r) => r.url || r.thumbnail)
    .filter((u): u is string => Boolean(u));
}

/** Try Wikipedia first, then fall back to Openverse if empty. */
async function fetchImages(query: string, count: number): Promise<string[]> {
  try {
    const wiki = await fetchWikiImages(query, count);
    if (wiki.length > 0) return wiki;
  } catch {
    /* fall through */
  }
  try {
    return await fetchOpenverseImages(query, count);
  } catch {
    return [];
  }
}

export const searchDestinationImages = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => SearchInput.parse(data))
  .handler(async ({ data }) => {
    const urls = await fetchImages(data.query, data.count);
    return { urls, fallback: urls.length === 0 } as const;
  });

export const searchDestinationGallery = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => GalleryInput.parse(data))
  .handler(async ({ data }) => {
    const { destination, themes } = data;
    const seen = new Set<string>();
    const gallery: string[] = new Array(themes.length).fill("");

    const perTheme = await Promise.all(
      themes.map((theme) => fetchImages(`${destination} ${theme}`, 4)),
    );
    for (let i = 0; i < themes.length; i++) {
      const pick = perTheme[i].find((u) => !seen.has(u));
      if (pick) {
        seen.add(pick);
        gallery[i] = pick;
      }
    }

    if (gallery.some((g) => !g)) {
      const pool = await fetchImages(destination, themes.length * 3);
      for (let i = 0; i < gallery.length; i++) {
        if (gallery[i]) continue;
        const next = pool.find((u) => !seen.has(u));
        if (next) {
          seen.add(next);
          gallery[i] = next;
        }
      }
    }

    return {
      urls: gallery,
      fallback: gallery.every((u) => !u),
    } as const;
  });
