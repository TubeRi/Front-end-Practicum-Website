import photo0 from '../front-end/assets/Photos/japan.jpeg';
import photo1 from '../front-end/assets/Photos/argentina.jpeg';
import photo2 from '../front-end/assets/Photos/moroco.jpeg';
import photo3 from '../front-end/assets/Photos/bali.jpeg';
import photo4 from '../front-end/assets/Photos/italy.jpeg';
import photo5 from '../front-end/assets/Photos/greece.jpeg';

export const destinations = [
  {
    id: "kyoto-temples",
    name: "Quiet Temples & Tea",
    location: "Kyoto",
    country: "Japan",
    region: "Asia",
    image: photo0,
    alt: "Five-story pagoda framed by colorful autumn trees in Kyoto",
    price: 2480,
    rating: 4.9,
    duration: 8,
    category: "City",
    description:
      "Ancient temples, private tea rituals, and slow mornings in Japan’s old capital.",
    dates: ["2026-04-12", "2026-05-17", "2026-10-11"],
  },
  {
    id: "patagonia-wild",
    name: "Edge of the Wild",
    location: "Patagonia",
    country: "Argentina",
    region: "South America",
    image: photo1,
    alt: "Jagged Patagonia mountains reflected in a clear blue lake",
    price: 3260,
    rating: 4.8,
    duration: 10,
    category: "Adventure",
    description:
      "Glacial lakes, granite peaks, and trails through the world’s wild southern edge.",
    dates: ["2026-01-24", "2026-02-14", "2026-11-07"],
  },
  {
    id: "sahara-after-dark",
    name: "Desert After Dark",
    location: "Sahara",
    country: "Morocco",
    region: "Africa",
    image: photo2,
    alt: "Canvas desert camp beneath the stars in Morocco",
    price: 1890,
    rating: 4.7,
    duration: 6,
    category: "Adventure",
    description:
      "Kasbah roads, golden dunes, and nights beneath an uninterrupted desert sky.",
    dates: ["2026-03-08", "2026-04-19", "2026-10-18"],
  },
  {
    id: "ubud-rice-fields",
    name: "Among the Rice Fields",
    location: "Ubud",
    country: "Indonesia",
    region: "Asia",
    image: photo3,
    alt: "Lush green rice terraces and palms in Ubud, Bali",
    price: 2120,
    rating: 4.9,
    duration: 7,
    category: "Nature",
    description:
      "A restorative week of village walks, green terraces, and island cooking.",
    dates: ["2026-05-09", "2026-06-13", "2026-09-12"],
  },
  {
    id: "dolomites-slow-days",
    name: "Alpine Slow Days",
    location: "The Dolomites",
    country: "Italy",
    region: "Europe",
    image: photo4,
    alt: "A small mountain church beneath the Italian Dolomites",
    price: 2740,
    rating: 4.8,
    duration: 7,
    category: "Nature",
    description:
      "Meadow paths, limestone peaks, and considered mountain hospitality.",
    dates: ["2026-06-20", "2026-07-18", "2026-09-05"],
  },
  {
    id: "aegean-islands",
    name: "Islands in Blue",
    location: "The Aegean",
    country: "Greece",
    region: "Europe",
    image: photo5,
    alt: "Rocky Mediterranean coast meeting vivid blue water",
    price: 2960,
    rating: 4.9,
    duration: 9,
    category: "Beach",
    description:
      "Quiet coves, family tavernas, and a passage between lesser-known islands.",
    dates: ["2026-05-23", "2026-06-27", "2026-09-19"],
  },
  {
    id: "lisbon-stories",
    name: "Hills, Tiles & Tables",
    location: "Lisbon",
    country: "Portugal",
    region: "Europe",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    alt: "Warm tiled buildings on a sunlit Lisbon street",
    price: 1680,
    rating: 4.7,
    duration: 5,
    category: "City",
    description:
      "Tiled lanes, Atlantic light, and evenings around generous neighborhood tables.",
    dates: ["2026-03-21", "2026-05-16", "2026-10-03"],
  },
  {
    id: "costa-rica-canopy",
    name: "Between Forest & Sea",
    location: "Osa Peninsula",
    country: "Costa Rica",
    region: "Central America",
    image:
      "https://images.unsplash.com/photo-1518259102261-b40117eabbc9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    alt: "Dense Costa Rican rainforest meeting a quiet beach",
    price: 2390,
    rating: 4.8,
    duration: 8,
    category: "Nature",
    description:
      "Rainforest trails, wildlife-rich waterways, and barefoot Pacific mornings.",
    dates: ["2026-02-07", "2026-03-14", "2026-12-05"],
  },
  {
    id: "amalfi-coast",
    name: "The Coast at Ease",
    location: "Amalfi Coast",
    country: "Italy",
    region: "Europe",
    image:
      "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    alt: "Colorful cliffside villages above the Amalfi Coast",
    price: 3180,
    rating: 4.9,
    duration: 7,
    category: "Beach",
    description:
      "Cliffside villages, hidden swimming coves, and long lunches above the sea.",
    dates: ["2026-05-30", "2026-07-04", "2026-09-26"],
  },
  {
    id: "iceland-elements",
    name: "Land of the Elements",
    location: "South Coast",
    country: "Iceland",
    region: "Europe",
    image:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200",
    alt: "A waterfall descending through green Icelandic cliffs",
    price: 2890,
    rating: 4.8,
    duration: 6,
    category: "Adventure",
    description:
      "Waterfalls, black-sand shores, and geothermal calm beneath immense skies.",
    dates: ["2026-03-01", "2026-06-06", "2026-10-24"],
  },
]

export const destinationCategories = [
  "All Destinations",
  "Beach",
  "Adventure",
  "City",
  "Nature",
]
