require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
// const openAI = require("openai");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect(
    process.env.MONGODB_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    region: { type: String },
    population: { type: Number },
    timezone: { type: String, required: true },
    currency: { type: String, required: true },
    language: { type: String },
    popular_attractions: [{ type: String }],
    emergency_service_number: { type: Number, required: true },
    local_customs: [{ type: String }],
    local_cuisine: [{ type: String }]
});

const City = mongoose.model('City', citySchema);

const newCity = new City({
    name: 'Paris',
    country: 'France',
    region: 'Île-de-France',
    population: 2.14e6,
    timezone: 'CET',
    currency: 'Euro',
    language: 'French',
    population_attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral'],
    emergency_service_number: 112,
    local_customs: ['Kissing on the cheek', 'No tipping in restaurants'],
    local_cuisine: ['Croissants', 'Escargots', 'Macarons'],
});
// newCity.save()
//     .then(city => {
//         console.log(`saved ${city.name} to the database`);
//     })
//     .catch(error => {
//         console.error(`Error saving ${newCity.name} to the database: ${error}`);
//     });

app.get('/api/cities/:name', async (req, res) => {
    const { name } = req.params;
  
    try {
      const city = await City.findOne({ name });
  
      if (!city) {
        return res.status(404).json({ message: 'City not found' });
        // return res.status(404).json();
      }
  
      return res.json(city);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
});

app.get("/", (req, res) => {
  res.send("hey world, from methacks");
});

/* weather dependent model training */
const weatherLabel = [
  { text: "national park", label: "yes" },
  { text: "museum", label: "no" },
  { text: "church", label: "no" },
  { text: "town", label: "yes" },
  { text: "square", label: "yes" },
  { text: "camp", label: "yes" },
  { text: "lake", label: "yes" },
  { text: "mall", label: "no" },
  { text: "house", label: "no" },
  { text: "island", label: "yes" },
  { text: "beach", label: "yes" },
  { text: "hiking trail", label: "yes" },
  { text: "waterfall", label: "yes" },
  { text: "zoo", label: "no" },
  { text: "theme park", label: "no" },
  { text: "historic site", label: "no" },
  { text: "botanical garden", label: "no" },
  { text: "cruise", label: "yes" },
  { text: "vineyard", label: "no" },
  { text: "castle", label: "no" },
  { text: "castle", label: "no" },
  { text: "ski resort", label: "yes" },
  { text: "hot springs", label: "yes" },
  { text: "observatory", label: "no" },
  { text: "scenic drive", label: "yes" },
  { text: "food market", label: "no" },
  { text: "river rafting", label: "yes" },
  { text: "concert", label: "no" },
  { text: "farm visit", label: "no" },
  { text: "cultural festival", label: "no" },
  { text: "night market", label: "no" },
  { text: "cruise", label: "yes" },
  { text: "camping", label: "yes" },
  { text: "surfing", label: "yes" },
  { text: "kayaking", label: "yes" },
  { text: "parasailing", label: "yes" },
  { text: "snowboarding", label: "yes" },
  { text: "sailing", label: "yes" },
  { text: "rafting", label: "yes" },
  { text: "fishing", label: "yes" },
  { text: "snorkeling", label: "yes" },
  { text: "swimming", label: "yes" },
  { text: "picnic", label: "yes" },
  { text: "ice skating", label: "yes" },
  { text: "kiteboarding", label: "yes" },
  { text: "dog sledding", label: "yes" },
  { text: "whale watching", label: "yes" },
  { text: "hot air ballooning", label: "yes" },
  { text: "rock climbing", label: "yes" },
  { text: "cycling", label: "yes" },
  { text: "golfing", label: "yes" },
  { text: "horseback riding", label: "yes" },
  { text: "bird watching", label: "yes" },
  { text: "kayak fishing", label: "yes" },
  { text: "outdoor concerts", label: "yes" },
  { text: "gardens visit", label: "yes" },
  { text: "amusement parks", label: "yes" },
];

const weatherTest = [
  "Chitwan National Park",
  "Van Gogh Museum",
  "St. Peter's Basilica",
  "Times Square",
  "Yosemite National Park",
  "Louvre Museum",
  "Golden Gate Bridge",
  "Machu Picchu",
  "Eiffel Tower",
  "Great Barrier Reef",
  "beach vacation",
  "skiing in the mountains",
  "hiking in the national park",
  "visiting waterfalls",
  "cruising in the Caribbean",
  "camping in the forest",
  "surfing on the coast",
  "kayaking in the river",
  "parasailing at the beach",
  "snowboarding in the Alps",
  "sailing on the lake",
  "rafting in the rapids",
  "fishing in the river",
  "snorkeling in the coral reef",
  "swimming in the pool",
  "having a picnic in the park",
];

app.get("/weatherTraining", async (req, res) => {
  try {
    cohere.init(process.env.COHERE_API_KEY);
    const response = await cohere.classify({
      model: "small",
      inputs: weatherTest,
      examples: weatherLabel,
    });
    console.log(JSON.stringify(response, null, 3));
    res.send(JSON.stringify(response, null, 3));
  } catch (error) {
    console.error("Error classifying data:", error);
    res.status(400).json({ error: "An error occurred while classifying data" });
  }
});

/* best season of visit training */
const seasonLabel = [
  { text: "beach", label: "summer" },
  { text: "ski resort", label: "winter" },
  { text: "hiking trail", label: "spring" },
  { text: "waterfall", label: "spring" },
  { text: "cruise", label: "summer" },
  { text: "camping", label: "summer" },
  { text: "surfing", label: "summer" },
  { text: "kayaking", label: "summer" },
  { text: "parasailing", label: "summer" },
  { text: "snowboarding", label: "winter" },
  { text: "sailing", label: "summer" },
  { text: "rafting", label: "summer" },
  { text: "fishing", label: "summer" },
  { text: "snorkeling", label: "summer" },
  { text: "swimming", label: "summer" },
  { text: "picnic", label: "spring" },
  { text: "beach", label: "summer" },
  { text: "ski resort", label: "winter" },
  { text: "hiking trail", label: "spring" },
  { text: "waterfall", label: "spring" },
  { text: "cruise", label: "summer" },
  { text: "camping", label: "summer" },
  { text: "surfing", label: "summer" },
  { text: "kayaking", label: "summer" },
  { text: "parasailing", label: "summer" },
  { text: "snowboarding", label: "winter" },
  { text: "sailing", label: "summer" },
  { text: "rafting", label: "summer" },
  { text: "fishing", label: "summer" },
  { text: "snorkeling", label: "summer" },
  { text: "swimming", label: "summer" },
  { text: "picnic", label: "spring" },
  { text: "botanical garden", label: "spring" },
  { text: "wine tasting", label: "fall" },
  { text: "hot air ballooning", label: "fall" },
  { text: "cherry blossom viewing", label: "spring" },
  { text: "apple picking", label: "fall" },
  { text: "pumpkin patch visit", label: "fall" },
  { text: "ice skating", label: "winter" },
  { text: "horseback riding", label: "spring" },
  { text: "biking tour", label: "summer" },
  { text: "wildlife safari", label: "fall" },
  { text: "kite festival", label: "spring" },
  { text: "ski jumping", label: "winter" },
  { text: "harvest festival", label: "fall" },
  { text: "orchard visit", label: "fall" },
];

const seasonTest = [
    "beach",
    "ski resort",
    "hiking trail",
    "waterfall",
    "wine tasting",
    "camping",
    "surfing",
    "kayaking",
    "picnic",
    "orchard visit",
];

app.get("/seasonTraining", async (req, res) => {
  try {
    cohere.init(process.env.COHERE_API_KEY);
    const response = await cohere.classify({
      model: "small",
      inputs: seasonTest,
      examples: seasonLabel,
    });
    console.log(JSON.stringify(response, null, 3));
    res.send(JSON.stringify(response, null, 3));
  } catch (error) {
    console.error("Error classifying data:", error);
    res.status(400).json({ error: "An error occurred while classifying data" });
  }
});

const cohere = require('cohere-ai');
cohere.init('8GEb0w8gJW7TnKs6FLR45yWG0KSLIJNpeuIikuVF');
app.get('/api/cohere/:city', async (req, res) => {
    const { city } = req.params;
    const response = await cohere.generate({
        prompt: `Give me a summary of ${city}`,
        model: 'ca5f4bac-9c09-4770-bf7a-d043739e82a7-ft',
        max_tokens: 100,
    });
    console.log(response);
    res.send(response);
})

app.get('/', (req, res) => {
    res.send('Hello world, from methacks');
});

const PORT = 3210;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
