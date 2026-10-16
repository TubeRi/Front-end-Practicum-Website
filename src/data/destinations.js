import photo0 from '../front-end/assets/Photos/japan.jpeg';
import photo1 from '../front-end/assets/Photos/argentina.jpeg';
import photo2 from '../front-end/assets/Photos/moroco.jpeg';
import photo3 from '../front-end/assets/Photos/bali.jpeg';
import photo4 from '../front-end/assets/Photos/italy.jpeg';
import photo5 from '../front-end/assets/Photos/greece.jpeg';

// Shared by the full catalog and the homepage featured journeys.
export const destinations = [
{
  "id": "kyoto",
  "location": "Kyoto, Japan",
  "region": "asia",
  "regionLabel": "Asia",
  "title": "Quiet Temples & Tea",
  "description": "Ancient temples, private tea rituals, and slow mornings in the old capital.",
  "image": photo0,
  "imageAlt": "Kyoto city and mountains at sunset",
  "days": 8,
  "price": 2480,
  "featured": true
},
{
  "id": "patagonia",
  "location": "Patagonia, Argentina",
  "region": "south-america",
  "regionLabel": "South America",
  "title": "Edge of the Wild",
  "description": "Glacial lakes, granite peaks, and trails through the world’s wild southern edge.",
  "image": photo1,
  "imageAlt": "Patagonia mountains reflected in a clear blue lake",
  "days": 10,
  "price": 3260,
  "featured": true
},
{
  "id": "sahara",
  "location": "Sahara, Morocco",
  "region": "africa",
  "regionLabel": "Africa",
  "title": "Desert After Dark",
  "description": "Kasbah roads, golden dunes, and nights beneath an uninterrupted desert sky.",
  "image": photo2,
  "imageAlt": "Canvas desert camp beneath the stars in Morocco",
  "days": 6,
  "price": 1890,
  "featured": true
},
{
  "id": "ubud",
  "location": "Ubud, Bali",
  "region": "asia",
  "regionLabel": "Asia",
  "title": "Among the Rice Fields",
  "description": "A restorative week of village walks, green terraces, and island cooking.",
  "image": photo3,
  "imageAlt": "Green rice terraces and palms in Ubud, Bali",
  "days": 7,
  "price": 2120,
  "featured": false
},
{
  "id": "dolomites",
  "location": "The Dolomites, Italy",
  "region": "europe",
  "regionLabel": "Europe",
  "title": "Alpine Slow Days",
  "description": "Meadow paths, dramatic limestone peaks, and considered mountain hospitality.",
  "image": photo4,
  "imageAlt": "A mountain church beneath the Italian Dolomites",
  "days": 7,
  "price": 2740,
  "featured": false
},
{
  "id": "aegean",
  "location": "The Aegean, Greece",
  "region": "europe",
  "regionLabel": "Europe",
  "title": "Islands in Blue",
  "description": "Quiet coves, family tavernas, and a leisurely passage between lesser-known islands.",
  "image": photo5,
  "imageAlt": "Rocky Mediterranean coast meeting vivid blue water",
  "days": 9,
  "price": 2960,
  "featured": false
}
];
