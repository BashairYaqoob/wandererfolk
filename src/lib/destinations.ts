import d1 from "@/assets/dest-1.jpg";
import d2 from "@/assets/dest-2.jpg";
import d3 from "@/assets/dest-3.jpg";
import d4 from "@/assets/dest-4.jpg";
import { destinationGalleryUrls } from "./destination-image";

const marrakechGallery = destinationGalleryUrls("Marrakech Morocco", [
  "medina",
  "souk market",
  "Bahia Palace",
  "Koutoubia mosque",
  "camel desert",
  "tagine food",
  "riad courtyard",
  "atlas mountains",
  "spice market",
]);
const santoriniGallery = destinationGalleryUrls("Santorini Greece", [
  "Oia sunset",
  "blue dome church",
  "white houses caldera",
  "aegean beach",
  "greek taverna food",
  "windmill",
  "cliffside village",
  "vineyard",
  "fishing port",
]);
const kyotoGallery = destinationGalleryUrls("Kyoto Japan", [
  "bamboo forest arashiyama",
  "fushimi inari shrine",
  "geisha gion",
  "kinkakuji golden pavilion",
  "cherry blossoms sakura",
  "tea ceremony matcha",
  "zen garden temple",
  "kaiseki cuisine",
  "traditional street",
]);
const skogafossGallery = destinationGalleryUrls("Iceland Skogafoss", [
  "Skogafoss waterfall",
  "black sand beach reynisfjara",
  "glacier ice",
  "northern lights aurora",
  "icelandic horse",
  "geothermal hot spring",
  "volcanic landscape",
  "moss lava field",
  "ring road",
]);


export type DestinationStyle =
  | "relaxed"
  | "adventure"
  | "cultural"
  | "foodie"
  | "luxury"
  | "budget";

export type Destination = {
  slug: string;
  name: string;
  country: string;
  tag: string;
  days: string;
  recommendedDurationDays: number;
  estimatedBudgetUsd: number;
  suggestedStyle: DestinationStyle;
  bestSeason: string;
  overview: string;
  attractions: string[];
  thingsToDo: string[];
  cuisine: string[];
  tips: string[];
  transport: string;
  weatherSummary: string;
  image: string;
  gallery: string[];
};

export const destinations: Destination[] = [
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    tag: "Desert & souks",
    days: "7 days",
    recommendedDurationDays: 7,
    estimatedBudgetUsd: 1400,
    suggestedStyle: "cultural",
    bestSeason: "March – May, September – November",
    overview:
      "A city that runs on colour, smoke and slow ceremony. Wander the medina at dawn, take mint tea on a rooftop at dusk, and let the Atlas mountains close the day in pink.",
    attractions: [
      "Jemaa el-Fnaa square",
      "Bahia Palace",
      "Majorelle Garden",
      "Ben Youssef Madrasa",
      "Koutoubia Mosque",
    ],
    thingsToDo: [
      "Get lost in the souks of the medina",
      "Overnight in a Sahara desert camp",
      "Cook a tagine with a local family",
      "Watch sunset from a rooftop in the Kasbah",
    ],
    cuisine: [
      "Slow-cooked lamb tagine",
      "Fresh msemen with honey",
      "Harira soup at dusk",
      "Mint tea, poured from height",
    ],
    tips: [
      "Bring small dirham notes for the souks.",
      "Dress modestly in the medina — light linens are your friend.",
      "Agree the price before hopping into a taxi.",
    ],
    transport:
      "Fly into Marrakech-Menara (RAK). Walk or grab petit taxis inside the medina; day trips to the Atlas mountains and desert are easiest with a hired driver.",
    weatherSummary:
      "Warm and dry most of the year. Spring and autumn hover around 24 °C; summers push past 38 °C.",
    image: d1,
    gallery: marrakechGallery,
  },
  {
    slug: "santorini",
    name: "Santorini",
    country: "Greece",
    tag: "Slow coastal",
    days: "5 days",
    recommendedDurationDays: 5,
    estimatedBudgetUsd: 1800,
    suggestedStyle: "relaxed",
    bestSeason: "May – June, September – October",
    overview:
      "White villages spilling down a caldera, blue domes catching the last of the light, and long, quiet meals of tomato fritters and cold wine.",
    attractions: [
      "Oia at sunset",
      "Ancient Akrotiri",
      "Red Beach",
      "Fira to Oia caldera walk",
      "Amoudi Bay",
    ],
    thingsToDo: [
      "Charter a small catamaran around the caldera",
      "Taste Assyrtiko at a family winery",
      "Swim in the volcanic hot springs",
      "Wander Pyrgos at golden hour",
    ],
    cuisine: [
      "Tomatokeftedes (tomato fritters)",
      "Fresh-grilled octopus",
      "Fava purée with capers",
      "Vinsanto dessert wine",
    ],
    tips: [
      "Book Oia sunset spots at least an hour ahead.",
      "Rent an ATV for hidden southern beaches — helmets on.",
      "Shoulder season means the same views for far less.",
    ],
    transport:
      "Fly into Santorini (JTR) or ferry from Athens. A small ATV or car makes the island effortless; Oia and Fira are walkable.",
    weatherSummary:
      "Mediterranean and mild. May–October: 22–28 °C, mostly sunny, cooling breezes on the caldera.",
    image: d2,
    gallery: santoriniGallery,
  },
  {
    slug: "kyoto",
    name: "Kyoto",
    country: "Japan",
    tag: "Temples & tea",
    days: "9 days",
    recommendedDurationDays: 9,
    estimatedBudgetUsd: 2600,
    suggestedStyle: "cultural",
    bestSeason: "Late March – April (sakura), November (koyo)",
    overview:
      "A city of slow doors and quiet gardens. Wooden teahouses, bamboo paths that hum in the wind, and small counter kitchens that will change how you think about a bowl of rice.",
    attractions: [
      "Fushimi Inari Shrine",
      "Arashiyama bamboo grove",
      "Kinkaku-ji (Golden Pavilion)",
      "Gion district",
      "Philosopher's Path",
    ],
    thingsToDo: [
      "Attend a proper tea ceremony",
      "Cycle the Kamo river at dawn",
      "Sleep one night in a ryokan with an onsen",
      "Kaiseki dinner tasting in Pontocho",
    ],
    cuisine: [
      "Kaiseki multi-course tasting",
      "Handmade soba and udon",
      "Yudofu (tofu hot pot)",
      "Matcha and warabi mochi",
    ],
    tips: [
      "Buy an IC card (Suica/ICOCA) for effortless transit.",
      "Temples open early — you'll have Fushimi to yourself before 7am.",
      "Be quiet in Gion. Photography of geiko is discouraged.",
    ],
    transport:
      "Fly into KIX (Osaka) or Tokyo + Shinkansen. Inside Kyoto: buses, subway and rented bicycles work beautifully.",
    weatherSummary:
      "Four distinct seasons. Spring/autumn 12–22 °C and golden; summer humid and hot; winter crisp and dry.",
    image: d3,
    gallery: kyotoGallery,
  },
  {
    slug: "skogafoss",
    name: "Skógafoss",
    country: "Iceland",
    tag: "Wild north",
    days: "6 days",
    recommendedDurationDays: 6,
    estimatedBudgetUsd: 2200,
    suggestedStyle: "adventure",
    bestSeason: "June – August (midnight sun), February – March (aurora)",
    overview:
      "A slow loop of the south coast: black-sand beaches, glacier tongues and waterfalls big enough to change the weather. Pull over often.",
    attractions: [
      "Skógafoss waterfall",
      "Reynisfjara black sand beach",
      "Sólheimajökull glacier",
      "Seljalandsfoss",
      "Jökulsárlón glacier lagoon",
    ],
    thingsToDo: [
      "Hike the Fimmvörðuháls trail above Skógafoss",
      "Soak in a wild hot spring at dusk",
      "Chase the aurora on a moonless winter night",
      "Walk on a glacier with a certified guide",
    ],
    cuisine: [
      "Slow-cooked lamb stew (kjötsúpa)",
      "Fresh Arctic char",
      "Rye bread baked in geothermal earth",
      "Skyr with wild berries",
    ],
    tips: [
      "Weather changes fast — layer, always.",
      "Fuel up whenever you see a station on the ring road.",
      "Respect closed paths; the moss takes decades to recover.",
    ],
    transport:
      "Fly into Keflavík (KEF) and rent a car — a 4x4 in winter. The Ring Road (Route 1) links every stop on the south coast.",
    weatherSummary:
      "Cool and moody. Summer 10–15 °C with long light; winter -2 to 4 °C with dramatic skies.",
    image: d4,
    gallery: skogafossGallery,
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
