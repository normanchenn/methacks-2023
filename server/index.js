require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const cohere = require("cohere-ai");
const https = require("https");
const axios = require("axios");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ADD LONGITUDE AND LATITUDE COORDINATES
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
  local_cuisine: [{ type: String }],
  latitude: { type:Number, required: true},
  longitude: { type:Number, required: true},
});

const City = mongoose.model("City2", citySchema);

const newCity = new City({
    name: "Sydney",
    country: "Australia",
    region: "New South Wales",
    population: 5.31e6,
    timezone: "AEST",
    currency: "Australian dollar",
    language: "English",
    population_attractions: [
      "Sydney Opera House",
      "Bondi Beach",
      "Harbour Bridge",
    ],
    emergency_service_number: 000,
    local_customs: ["BBQs on the beach", "Surfing in the ocean"],
    local_cuisine: ["Meat pies", "Fish and chips", "Vegemite"],
    latitude: -33.8688,
    longitude: 151.2093
  });  
// newCity.save()
//     .then(city => {
//         console.log(`saved ${city.name} to the database`);
//     })
//     .catch(error => {
//         console.error(`Error saving ${newCity.name} to the database: ${error}`);
//     });

app.get("/api/mongodb/findCity/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const city = await City.findOne({ name });
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    return res.json(city);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send("hey world, from methacks");
});

app.get("/api/cohere/citySummary/:city", async (req, res) => {
  try {
    cohere.init(process.env.COHERE_API_KEY);
    const { city } = req.params;
    const response = await cohere.generate({
      prompt: `Give me a summary of ${city}`,
      model: "ca5f4bac-9c09-4770-bf7a-d043739e82a7-ft",
      max_tokens: 100,
    });
    console.log(JSON.stringify(response, null, 3));
    res.send(JSON.stringify(response, null, 3));
  } catch (error) {
    console.error("Error classifying data:", error);
    res.status(400).json({ error: "An error occurred while classifying data" });
  }
});

app.get("/api/cohere/hobbies/:interest", async (req, res) => {
    try {
      cohere.init(process.env.COHERE_API_KEY);
      const {interest} = req.params;
      const response = await cohere.generate({
        prompt: `${interest}`,
        model: "957224c1-311c-460f-ac83-71afb5ad6dc2-ft",
        max_tokens: 100,
      });
      console.log(JSON.stringify(response, null, 3));
      res.send(JSON.stringify(response, null, 3));
    } catch (error) {
      console.error("Error classifying data:", error);
      res.status(400).json({ error: "An error occurred while classifying data" });
    }
  });

app.get("/api/cohere/weatherPrediction", async (req, res) => {
  try {
    cohere.init(process.env.COHERE_API_KEY);
    const { activity } = req.params;
    const activityArray = [activity];
    const response = await cohere.classify({
      model: "09119595-f5d0-42b8-9ea5-02905414db32-ft",
      inputs: activityArray,
    });
    console.log(JSON.stringify(response, null, 3));
    res.send(JSON.stringify(response, null, 3));
  } catch (error) {
    console.error("Error classifying data:", error);
    res.status(400).json({ error: "An error occurred while classifying data" });
  }
});

app.get(
  "/api/amadeus/flightPlanner/:origin/:destination/:date",
  async (req, res) => {
    const { origin } = req.params;
    const { destination } = req.params;
    const { date } = req.params;
    const clientId = process.env.AMADEUS_API_KEY;
    const clientSecret = process.env.AMADEUS_API_SECRET;

    async function getAccessToken(apiKey, apiSecret) {
      const baseUrl = "https://test.api.amadeus.com/v1";
      const tokenEndpoint = "/security/oauth2/token";

      try {
        const response = await axios.post(
          `${baseUrl}${tokenEndpoint}`,
          `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        return response.data.access_token;
      } catch (error) {
        console.error(error.response.data);
        throw new Error("Failed to retrieve access token");
      }
    }

    async function searchFlightOffers() {
      const baseUrl = "https://test.api.amadeus.com/v2";

      try {
        const accessToken = await getAccessToken(clientId, clientSecret);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };
        const params = {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate: date,
          adults: 2,
        };
        const response = await axios.get(`${baseUrl}/shopping/flight-offers`, {
          headers,
          params,
        });

        const jsonData = response.data;
        const filteredFlights = jsonData.data
          .filter((flight) => flight.price && flight.price.grandTotal)
          .sort(
            (a, b) =>
              parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal)
          );

        // Get the three cheapest flights
        const cheapestFlights = filteredFlights.slice(0, 3);

        // Print information about the cheapest flights
        cheapestFlights.forEach((flight, index) => {
          console.log(`Flight ${index + 1}:`);
          for (const key in flight) {
            console.log(`${key}:`, flight[key]);
          }
          console.log("---------------------------------------");
        });

        res.json(JSON.stringify(response.data));
      } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Failed to retrieve flight offers" });
      }
    }

    try {
      await searchFlightOffers();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
);

app.get("/", (req, res) => {
  res.send("Hello world, from methacks");
});

const PORT = 3210;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
