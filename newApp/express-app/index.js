require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const cohere = require("cohere-ai");
const https = require("https");
const axios = require("axios");
const fs = require("fs");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// fetch metadata for cities
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const airportSchema = new mongoose.Schema({
    name: { type: String, required: true},
    code:  {type: String, required: true},
  })
  const Airport = mongoose.model("Airports", airportSchema);
  app.get("api/airports/:name", async (req, res) => {
    const {name} = req.params;
    try{
        const code = await Airport.findOne({name});
        if (!code) {
            return res.status(404).json({message: "Airport not found"});
        }
        return res.json(code);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
  })
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
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  });
const City = mongoose.model("City2", citySchema);
app.get("/api/cities/:name", async (req, res) => {
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

//   getting a unique personalized summary for each city
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

//   generate what types of attractions the hobbies relate to
  app.get("/api/cohere/hobbies/:interest", async (req, res) => {
    try {
      cohere.init(process.env.COHERE_API_KEY);
      const {interest} = req.params;
      const response = await cohere.classify({
        inputs: [`${interest}`],
        model: "de9da453-d1be-4e48-a53e-2e3f6c479361-ft",
        max_tokens: 100,
      });
      console.log(JSON.stringify(response, null, 3));
      res.send(JSON.stringify(response, null, 3));
    } catch (error) {
      console.error("Error classifying data:", error);
      res.status(400).json({ error: "An error occurred while classifying data" });
    }
  });

// predicts whether an activity is weather dependent
  app.get("/api/cohere/weatherPrediction", async (req, res) => {
      try {
        cohere.init(process.env.COHERE_API_KEY);
        const { activity } = req.params;
        const activityArray = [activity];
        const response = await cohere.classify({
          model: "09119595-f5d0-42b8-9ea5-02905414db32-ft",
          inputs: activityArray,
        });
        // console.log(JSON.stringify(response, null, 3));
        // res.send(JSON.stringify(response, null, 3));
    
        const prediction = response.body.classifications[0].prediction;
    
        console.log("Prediction:", prediction);
        res.send(prediction);
      } catch (error) {
        console.error("Error classifying data:", error);
        res.status(400).json({ error: "An error occurred while classifying data" });
      }
    });

// takes in origin, destination, and date and returns 3 cheapest fllights
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
              const cheapestFlights = filteredFlights.slice(0, 3);
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


// takes your location, and outputs your nearest airport
      app.get("/api/googlemaps/neareastAirport", async (req, res) => {
        const apiKey = process.env.GOOGLE_MAP_API_KEY;
        const accessKey = process.env.AVIATION_STACK_API_KEY;
        // const airportName = "Toronto Pearson International Airport";
      
        try {
          const response = await axios.post(
            `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`
          );
          const { lat, lng } = response.data.location;
      
          const location = `${lat},${lng}`;
          const radius = 5000000;
          const keyword = "airport";
          const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&keyword=${keyword}&key=${apiKey}`;
      
          try {
            const response = await axios.get(placesUrl);
            const results = response.data.results;
      
            if (results.length > 0) {
              const airport = results[0];
              const airportCode = await getAirportIataCode(airport.name);
              console.log("Airport Code:", airportCode); // Log the airport code
              const nearestAirport = {
                name: airport.name,
                code: airportCode,
              };
              res.json(nearestAirport); // Send the response to the client
            } else {
              throw new Error("No airports found near the location.");
            }
          } catch (error) {
            console.error("Error retrieving nearest airport:", error);
            res.status(500).send("Error retrieving nearest airport");
          }
        } catch (error) {
          console.error("Error getting user location:", error);
          res.status(500).send("Error getting user location");
        }
      
        async function getAirportIataCode(airportName) {
          try {
            const response = await axios.get(
              "https://api.aviationstack.com/v1/airports",
              {
                params: {
                  access_key: accessKey,
                  search: airportName,
                },
              }
            );
      
            const airports = response.data.data;
            if (airports.length > 0) {
              const airport = airports[0];
              const iataCode = airport.iata_code;
              return iataCode;
            } else {
              throw new Error(`No airport found for the name "${airportName}"`);
            }
          } catch (error) {
            throw new Error("Error retrieving airport information: " + error.message);
          }
        }
      
        try {
          const iataCode = await getAirportIataCode(airportName);
          console.log(`The IATA code for ${airportName} is ${iataCode}`);
        } catch (error) {
          console.error(error.message);
        }
      });


// finds the suitable attractions
      app.get("/api/suitableAttractions", (req, res) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
      
        const currentSeason = getSeason(currentDate);
        console.log(`The current season is: ${currentSeason}`);
      
        const filePath = "./attractions.txt";
        readFileToString(filePath, (error, fileContent) => {
          if (error) {
            console.error("Error reading file:", error);
            return;
          }
      
          // console.log(fileContent);
      
          const countryName = "China";
      
          const attractions = getTouristAttractions(fileContent, countryName);
          console.log(attractions);
        });
      
        res.send(`Hello world, from methacks! Today's date is ${formattedDate}.`);
      });


      function getSeason(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        if ((month === 12 && day >= 21) || (month <= 2 && day < 20)) {
          return "Winter";
        } else if (month >= 3 && month <= 5) {
          return "Spring";
        } else if (month >= 6 && month <= 8) {
          return "Summer";
        } else {
          return "Autumn";
        }
      }
      
      function getTouristAttractions(text, countryName) {
        const lines = text.split("\n");
        const attractions = [];
      
        let isTargetCountry = false;
        for (let line of lines) {
          line = line.trim();
      
          if (line === countryName) {
            isTargetCountry = true;
          } else if (line.startsWith(countryName)) {
            isTargetCountry = false;
          } else if (isTargetCountry && line !== "") {
            const attraction = line.split(". ")[1];
            attractions.push(attraction);
          }
          if (attractions.length === 10) {
            break;
          }
        }
        return attractions;
      }
      
      function readFileToString(filePath, callback) {
        fs.readFile(filePath, "utf-8", (error, data) => {
          if (error) {
            callback(error, null);
            return;
          }
      
          const fileContent = data;
          callback(null, fileContent);
        });
      }
      
      function classifyAttractions(attractions) {
        const weatherDependentAttractions = [];
        for (let i = 0; i < attractions.length; i++) {
          const attraction = attractions[i];
          try {
            const response = axios.get(
              `/api/cohere/weatherPrediction/${attraction}`
            );
            const prediction = response.data;
      
            console.log(`Prediction for ${attraction}: ${prediction}`);
      
            if (prediction === "no") {
              weatherDependentAttractions.push(attraction);
            }
          } catch (error) {
            console.error(`Error classifying ${attraction}:`, error);
          }
        }
        return weatherDependentAttractions;
      }




// templates



app.get('/', (req, res) => {
    res.send('Hello World!, from new app');
  });

const PORT = 4321;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});