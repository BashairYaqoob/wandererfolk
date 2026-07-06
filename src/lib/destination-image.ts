// Fetches a themed image URL for a destination name using loremflickr,
// a free tag-based image service (no API key required).
// Returns a high-quality default travel placeholder if the query is empty.

const DEFAULT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80";

export function destinationImageUrl(
  query: string,
  size: { w?: number; h?: number } = {},
): string {
  const q = query.trim();
  if (!q) return DEFAULT_PLACEHOLDER;
  const w = size.w ?? 1200;
  const h = size.h ?? 800;
  // loremflickr accepts comma-separated tags. Add `travel,city` to bias
  // toward destination-style photos.
  const tags = encodeURIComponent(
    `${q.replace(/\s+/g, ",").toLowerCase()},travel,city`,
  );
  return `https://loremflickr.com/${w}/${h}/${tags}`;
}

export function destinationGalleryUrls(
  destination: string,
  themes: string[],
  size: { w?: number; h?: number } = { w: 800, h: 800 },
): string[] {
  return themes.map((theme, i) => {
    const tags = encodeURIComponent(
      `${destination.toLowerCase()},${theme.toLowerCase()}`.replace(/\s+/g, ","),
    );
    // add unique lock to each image so loremflickr returns distinct photos
    return `https://loremflickr.com/${size.w ?? 800}/${size.h ?? 800}/${tags}?lock=${i + 1}`;
  });
}

export const DEFAULT_TRIP_IMAGE = DEFAULT_PLACEHOLDER;
