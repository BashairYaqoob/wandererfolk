import d1 from "@/assets/dest-1.jpg";
import d4 from "@/assets/dest-4.jpg";

export type JournalArticle = {
  slug: string;
  title: string;
  excerpt: string;
  destinationSlug: string;
  destinationName: string;
  country: string;
  author: string;
  date: string;
  readingTime: string;
  image: string;
  intro: string;
  body: string[];
  highlights: string[];
  hiddenGems: string[];
  tips: string[];
};

export const articles: JournalArticle[] = [
  {
    slug: "shadows-of-marrakech",
    title: "Chasing shadows through the alleys of Marrakech.",
    excerpt:
      "On finding the quiet inside a city that never quite sleeps — and the tea that made us stay another day.",
    destinationSlug: "marrakech",
    destinationName: "Marrakech",
    country: "Morocco",
    author: "Amélie Renard",
    date: "March 14, 2026",
    readingTime: "6 min read",
    image: d1,
    intro:
      "We arrived in Marrakech at the hour when everything is either just waking up or refusing to sleep at all. The medina smelled of orange blossom and diesel, and somewhere a call to prayer stitched the neighbourhoods back together.",
    body: [
      "The trick, we learned, is to walk without a map for the first afternoon. Not defiantly — just gently. Follow the shade. Turn down the alley the cat took. If a doorway is beaded with light, look inside; ninety percent of the time it's a riad with a fountain and a courtyard cat who has plans for your lap.",
      "By the third day we had a routine. Msemen and mint tea on a rooftop as the city warmed up. A slow hour at the Bahia Palace before the tour groups arrived. Late lunch of tagine, cooked so long the apricots dissolved into the sauce. Then, always, a nap.",
      "Evening belonged to Jemaa el-Fnaa. Snake charmers, storytellers, orange juice for a few dirham. We ate at stall 32 both nights — grilled sardines, warm bread, a small dish of olives we couldn't stop reaching for.",
    ],
    highlights: [
      "Sunrise on a Kasbah rooftop",
      "The tiny lantern shop on Rue Mouassine",
      "A day trip to the Ourika valley",
    ],
    hiddenGems: [
      "Le Jardin Secret at opening — you'll have it to yourself",
      "The bakery behind Ben Youssef; ask for the almond briouat",
      "Café Clock's storytelling nights (Thursdays)",
    ],
    tips: [
      "Wear soft-soled shoes — the medina is stone and it's long.",
      "Cash speaks louder than card in the souks. Small notes.",
      "Take the fixed-price petit taxi to Menara at sunset. Worth it.",
    ],
  },
  {
    slug: "iceland-slow-loop",
    title: "A week of waterfalls, wool and long, thoughtful drives.",
    excerpt:
      "A slow loop of the south coast, one hot spring at a time. What to pack, where to linger, and when to just pull over.",
    destinationSlug: "skogafoss",
    destinationName: "Skógafoss",
    country: "Iceland",
    author: "Jonas Ellingsen",
    date: "November 2, 2025",
    readingTime: "8 min read",
    image: d4,
    intro:
      "Iceland teaches you to plan less. The weather has its own opinions and the road is generous with detours you never asked for. We gave ourselves a week and did about half of what we intended, which turned out to be exactly right.",
    body: [
      "Start early. The light in Iceland is a slow, cinematic thing — pearl grey at 8am, gold by 10, silver again by lunch. Skógafoss is best before the coach parks fill. Stand close enough to feel the drift, then climb the stairs to the top for the view no one photographs.",
      "We slept in guesthouses run by farmers, ate lamb stew in kitchens that felt like living rooms, and stopped every time the ring road offered a viewpoint. Twice we pulled over just to sit on the shoulder and listen to the wind push the moss around.",
      "The hot springs did most of the emotional work. Seljavallalaug at dusk. A river-fed pool near Reykjadalur after a long hike. Each one felt like a small deposit into a quieter version of ourselves.",
    ],
    highlights: [
      "Skógafoss at 7am, entirely alone",
      "Sólheimajökull glacier walk with a local guide",
      "Reynisfjara from the safe overlook — those waves are serious",
    ],
    hiddenGems: [
      "The turf church at Núpsstaður",
      "A tiny café in Vík serving licorice ice-cream",
      "Seljavallalaug pool — bring a towel and a small offering of quiet",
    ],
    tips: [
      "Rent a 4x4 in winter. Non-negotiable.",
      "Petrol stations = groceries. Stock up when you can.",
      "Download offline maps. Reception disappears often.",
    ],
  },
];

export function getArticle(slug: string): JournalArticle | undefined {
  return articles.find((a) => a.slug === slug);
}
