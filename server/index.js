require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const openAI = require("openai");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

/* cohere requirements */
console.log(process.env.COHERE_API_KEY);
const cohere = require("cohere-ai");

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const citySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   country: { type: String, required: true },
//   region: { type: String },
//   population: { type: Number },
//   timezone: { type: String, required: true },
//   currency: { type: String, required: true },
//   language: { type: String },
//   popular_attractions: [{ type: String }],
//   emergency_service_number: { type: Number, required: true },
//   local_customs: [{ type: String }],
//   local_cuisine: [{ type: String }],
// });

// const City = mongoose.model("City", citySchema);

// const newCity = new City({
//   name: "Paris",
//   country: "France",
//   region: "Île-de-France",
//   population: 2.14e6,
//   timezone: "CET",
//   currency: "Euro",
//   language: "French",
//   population_attractions: [
//     "Eiffel Tower",
//     "Louvre Museum",
//     "Notre-Dame Cathedral",
//   ],
//   emergency_service_number: 112,
//   local_customs: ["Kissing on the cheek", "No tipping in restaurants"],
//   local_cuisine: ["Croissants", "Escargots", "Macarons"],
// });
// newCity
//   .save()
//   .then((city) => {
//     console.log(`saved ${city.name} to the database`);
//   })
//   .catch((error) => {
//     console.error(`Error saving ${newCity.name} to the database: ${error}`);
//   });

app.get("/", (req, res) => {
  res.send("hey world, from methacks");
});

/* weather dependent model training */
const examples = [
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

const inputs = [
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

app.get("/trainingData", async (req, res) => {
  try {
    cohere.init(process.env.COHERE_API_KEY);
    const response = await cohere.classify({
      model: "small",
      inputs: inputs,
      examples: examples,
    });
    console.log(JSON.stringify(response, null, 3));
    res.send(JSON.stringify(response, null, 3));
  } catch (error) {
    console.error("Error classifying data:", error);
    res.status(500).json({ error: "An error occurred while classifying data" });
  }
});

const PORT = 3210;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
