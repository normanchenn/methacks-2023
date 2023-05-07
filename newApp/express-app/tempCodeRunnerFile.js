async function getNearestAirport() {
  const apiKey = process.env.GOOGLE_MAP_API_KEY;
  const accessKey = process.env.AVIATION_STACK_API_KEY;
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
        return nearestAirport;
      } else {
        throw new Error("No airports found near the location.");
      }
    } catch (error) {
      console.error("Error retrieving nearest airport:", error);
      throw new Error("Error retrieving nearest airport");
    }
  } catch (error) {
    console.error("Error getting user location:", error);
    throw new Error("Error getting user location");
  }
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