// npm install @googlemaps/google-maps-services-js

const { Client } = require('@googlemaps/google-maps-services-js');

// Uses 2 APIs - Geocoding/TimeZone
const geocodingClient = new Client({});
const timezoneClient = new Client({});

const city = 'Toronto'; // replace with your desired city

// First, retrieve the coordinates of the city using the Geocoding API
geocodingClient.geocode({
  params: {
    address: city,
    key: 'AIzaSyDSuUPMgyRXTIgpUIWtBfWOyavLBdXsEJE', // replace with your Google Cloud API key
  },
}).then((geocodingResponse) => {
  const location = geocodingResponse.data.results[0].geometry.location;
  const latitude = location.lat;
  const longitude = location.lng;

  // Next, use the coordinates to retrieve the time zone of the city using the Time Zone API
  timezoneClient.timezone({
    params: {
      location: `${latitude},${longitude}`,
      timestamp: Math.floor(Date.now() / 1000),
      key: 'AIzaSyDSuUPMgyRXTIgpUIWtBfWOyavLBdXsEJE', // replace with your Google Cloud API key
    },
  }).then((timezoneResponse) => {
    const timeZoneName = timezoneResponse.data.timeZoneName;
    console.log(`The time zone of ${city} is ${timeZoneName}.`);
  }).catch((timezoneError) => {
    console.log(`Error retrieving time zone data: ${timezoneError.message}`);
  });

}).catch((geocodingError) => {
  console.log(`Error retrieving geocoding data: ${geocodingError.message}`);
});


