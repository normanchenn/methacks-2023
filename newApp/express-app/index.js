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

app.get("/api/itinerary/:countryName", async (req, res) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const currentSeason = getSeason(currentDate);
  console.log(`The current season is: ${currentSeason}`);

  const attractionPath = "./attractions.txt";
  const { countryName } = req.params;

  readFileToString(attractionPath, async (error, attractionContent) => {
    if (error) {
      console.error("Error reading file:", error);
      return;
    }
    const attractions = getTouristAttractions(attractionContent, countryName);
    // console.log(attractions);

    const weatherDependentAttractions = await suitableAttractions(attractions);
    // console.log("Weather-dependent attractions:", weatherDependentAttractions);

    const finalAttractions = await processAttractions(attractions);
    const attractionCoordinates = await getAttractionCoordinates(
      finalAttractions
    );
    // console.log(attractionCoordinates);

    const optimalOrderVisit = await getOptimalOrderOfVisit(
      attractionCoordinates
    );
    console.log(optimalOrderVisit);
    res.send(optimalOrderVisit);
  });
});

app.get("/api/flights/:countryName", async (req, res) => {
  const { countryName } = req.params;

  const airportPath = "./airports.txt";
  readFileToString(airportPath, async (error, airportContent) => {
    if (error) {
      console.error("Error reading file:", error);
      return;
    }

    const airports = await getInternationalAirportsByCountry(
      airportContent,
      countryName
    );
    console.log(airports);
    const nearestAirport = await getNearestAirport();
    console.log(nearestAirport);

    const airportArray = allAirports(airportContent);

    const match = findClosestMatch(nearestAirport, airportArray);
    console.log("the closest match is: " + match);

    const departureCode = findAirportCode(match, airportContent);
    console.log(departureCode);

    var availableFlights = [];
    var availableFlightsLeastLayover = [];
    for (let i = 0; i < airports.length; i++) {
      const curAirportCode = airports[i];
      try {
        const curFlights = await flightPlanner(
          departureCode,
          curAirportCode,
          "2023-05-08"
        );
        console.log(curFlights);
        availableFlights = availableFlights.concat(curFlights);
      } catch (error) {
        console.error(
          `Failed to retrieve flights for ${curAirportCode}: ${error}`
        );
      }
    }
    for (let i = 0; i < airports.length; i++) {
      const curAirportCode = airports[i];
      try {
        const curFlights = await flightPlannerLeastLayover(
          departureCode,
          curAirportCode,
          "2023-05-08"
        );
        console.log(curFlights);
        availableFlightsLeastLayover =
          availableFlightsLeastLayover.concat(curFlights);
      } catch (error) {
        console.error(
          `Failed to retrieve flights for ${curAirportCode}: ${error}`
        );
      }
    }

    function filterCheapestFlights(flights) {
      const sortedFlights = flights.sort((a, b) => {
        const priceA = parseFloat(a.price.total);
        const priceB = parseFloat(b.price.total);
        return priceA - priceB;
      });
      const cheapestFlights = sortedFlights.slice(0, 1);

      return cheapestFlights;
    }

    function filterFewestLayovers(flights) {
      const sortedFlights = flights.sort((a, b) => {
        const layoversA = a.itineraries[0].segments.length - 1; // Assuming itineraries always have at least one segment
        const layoversB = b.itineraries[0].segments.length - 1;
        return layoversA - layoversB;
      });
      const flightWithFewestLayovers = sortedFlights.slice(0, 1);
      return flightWithFewestLayovers;
    }

    const cheapestFlights = filterCheapestFlights(availableFlights);
    const leastLayoverFlights = filterFewestLayovers(
      availableFlightsLeastLayover
    );
    console.log(cheapestFlights);
    console.log(leastLayoverFlights);

    const combinedFlights = cheapestFlights.concat(leastLayoverFlights);
    res.send(combinedFlights);
  });
});

// fetch metadata for cities
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
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
    const { interest } = req.params;
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

        // res.json(JSON.stringify(response.data));
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
  res.send("Hello World!, from new app");
});

const PORT = 4321;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

/* helper functions */
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
    return "Fall";
  }
}

async function weatherDependent(attractionName) {
  try {
    cohere.init(process.env.COHERE_API_KEY);
    const activityArray = [attractionName];
    const response = await cohere.classify({
      model: "09119595-f5d0-42b8-9ea5-02905414db32-ft",
      inputs: activityArray,
    });
    const prediction = response.body.classifications[0].prediction;
    return prediction;
  } catch (error) {
    console.error("Error classifying data:", error);
  }
}

async function bestSeason(attractionName) {
  try {
    cohere.init(process.env.COHERE_API_KEY);
    const activityArray = [attractionName];
    const response = await cohere.classify({
      model: "4a6c58b4-7be4-4875-83dd-6a0f23248fec-ft",
      inputs: activityArray,
    });

    const prediction = response.body.classifications[0].prediction;
    return prediction;
  } catch (error) {
    console.error("Error classifying data:", error);
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

async function readFileToString(filePath, callback) {
  fs.readFile(filePath, "utf-8", (error, data) => {
    if (error) {
      callback(error, null);
      return;
    }

    const fileContent = data;
    callback(null, fileContent);
  });
}

async function suitableAttractions(attractions) {
  console.log("Started classifying");
  const weatherDependentAttractions = [];

  for (let i = 0; i < attractions.length; i++) {
    const attraction = attractions[i];
    try {
      const prediction = await weatherDependent(attraction);
      const season = await bestSeason(attraction);
      console.log(`Prediction for ${attraction}: ${prediction} ${season}`);
      if (prediction === " no") {
        weatherDependentAttractions.push(attraction);
      } else if (prediction === " yes") {
        const currentDate = new Date();
        const currentSeason = getSeason(currentDate);

        if (season === currentSeason) {
          console.log("was here");
          weatherDependentAttractions.push(attraction);
        }
      }
    } catch (error) {
      console.error(`Error classifying ${attraction}:`, error);
    }
  }
  return weatherDependentAttractions;
}

async function processAttractions(attractions) {
  const weatherDependentAttractions = await suitableAttractions(attractions);
  console.log("Weather dependent attractions:", weatherDependentAttractions);
  return weatherDependentAttractions;
}

async function getInternationalAirportsByCountry(data, countryName) {
  var lines = data.split("\n");
  var result = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line !== "") {
      var parts = line.split(",");
      if (parts.length >= 3) {
        var country = parts[0].trim();
        var airportName = parts[1].trim();
        var airportCode = parts[2].trim();

        if (country === countryName) {
          result.push(airportCode);
        }
      }
    }
  }
  return result;
}

function allAirports(data) {
  var result = [];
  var lines = data.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const entry = lines[i];
    const [country = "", airport = "", code = ""] = entry.split(",");
    result.push(airport.trim());

    // console.log(`Country: ${country.trim()}`);
    // console.log(`Airport: ${airport.trim()}`);
    // console.log(`Code: ${code.trim()}`);
    // console.log("--------------------");
  }
  return result;
}

function findAirportCode(airportName, data) {
  var lines = data.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const entry = lines[i];
    const [country = "", airport = "", code = ""] = entry.split(",");
    const curAirport = airport.trim();
    if (curAirport === airportName) {
      return code;
    }
  }
  return null;
}

async function getNearestAirport() {
  const apiKey = process.env.GOOGLE_MAP_API_KEY;

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
        const airportName = airport.name;
        return airportName;
      } else {
        throw new Error("No airports found near the location.");
      }
    } catch (error) {
      console.error("Error retrieving nearest airport:", error);
    }
  } catch (error) {
    console.error("Error getting user location:", error);
  }
}

function findClosestMatch(str, arr) {
  let closestMatch = null;
  let closestDistance = Infinity;

  for (let i = 0; i < arr.length; i++) {
    const currentStr = arr[i];
    const distance = calculateLevenshteinDistance(str, currentStr);

    if (distance < closestDistance) {
      closestMatch = currentStr;
      closestDistance = distance;
    }
  }

  return closestMatch;
}

function calculateLevenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }
  return dp[m][n];
}

async function flightPlanner(origin, destination, date) {
  const clientId = process.env.AMADEUS_API_KEY;
  const clientSecret = process.env.AMADEUS_API_SECRET;

  try {
    const getAccessToken = async (apiKey, apiSecret) => {
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
    };

    const searchFlightOffers = async () => {
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
        return cheapestFlights;
      } catch (error) {
        console.error(error.response?.data || error.message);
        throw new Error("Failed to retrieve flight offers");
      }
    };

    const flights = await searchFlightOffers();
    return flights;
  } catch (error) {
    console.error(error);
    throw new Error("An unexpected error occurred");
  }
}

async function flightPlannerLeastLayover(origin, destination, date) {
  const clientId = process.env.AMADEUS_API_KEY;
  const clientSecret = process.env.AMADEUS_API_SECRET;

  try {
    const getAccessToken = async (apiKey, apiSecret) => {
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
    };

    const searchFlightOffers = async () => {
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
              a.itineraries[0].segments.length -
              b.itineraries[0].segments.length
          );
        const shortestLayoversFlights = filteredFlights.slice(0, 3);
        return shortestLayoversFlights;
      } catch (error) {
        console.error(error.response?.data || error.message);
        throw new Error("Failed to retrieve flight offers");
      }
    };

    const flights = await searchFlightOffers();
    return flights;
  } catch (error) {
    console.error(error);
    throw new Error("An unexpected error occurred");
  }
}

async function getAttractionCoordinates(attractionNames) {
  const apiKey = process.env.GOOGLE_MAP_API_KEY;
  const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";

  const attractionCoordinates = [];

  for (const attractionName of attractionNames) {
    try {
      const response = await axios.get(baseUrl, {
        params: {
          address: attractionName,
          key: apiKey,
        },
      });

      const results = response.data.results;
      if (results.length > 0) {
        const location = results[0].geometry.location;
        const latitude = location.lat;
        const longitude = location.lng;

        attractionCoordinates.push({
          attraction: attractionName,
          latitude,
          longitude,
        });
      } else {
        console.log(`Could not find coordinates for '${attractionName}'.`);
      }
    } catch (error) {
      console.error(
        `Error occurred while fetching coordinates for '${attractionName}': ${error}`
      );
    }
  }
  return attractionCoordinates;
}

function euclideanDistance(coordA, coordB) {
  const dx = coordA.longitude - coordB.longitude;
  const dy = coordA.latitude - coordB.latitude;
  return Math.sqrt(dx * dx + dy * dy);
}

async function getOptimalOrderOfVisit(attractionCoordinates) {
  const numAttractions = attractionCoordinates.length;
  const visited = Array(numAttractions).fill(false);

  const startIndex = 0;
  visited[startIndex] = true;

  const optimalOrder = [startIndex];
  while (optimalOrder.length < numAttractions) {
    let nearestNeighborIndex = -1;
    let nearestNeighborDistance = Infinity;

    const currentCoord =
      attractionCoordinates[optimalOrder[optimalOrder.length - 1]];
    for (let i = 0; i < numAttractions; i++) {
      if (!visited[i]) {
        const distance = euclideanDistance(
          currentCoord,
          attractionCoordinates[i]
        );
        if (distance < nearestNeighborDistance) {
          nearestNeighborDistance = distance;
          nearestNeighborIndex = i;
        }
      }
    }
    visited[nearestNeighborIndex] = true;
    optimalOrder.push(nearestNeighborIndex);
  }
  const orderedAttractions = optimalOrder.map(
    (index, order) => `${order + 1}. ${attractionCoordinates[index].attraction}`
  );
  return orderedAttractions;
}
