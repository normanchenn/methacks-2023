// npm install --save google-maps-react

import React, { useState, useEffect } from 'react';
import { Client } from '@googlemaps/google-maps-services-js';

const timezoneClient = new Client({})

function CityTimezone({ city, latitude, longitude }) {
  const [timeZone, setTimeZone] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    timezoneClient.timezone({
      params: {
        location: `${latitude},${longitude}`,
        timestamp: Math.floor(Date.now() / 1000),
        key: 'AIzaSyDSuUPMgyRXTIgpUIWtBfWOyavLBdXsEJE',
      },
    }).then((timezoneResponse) => {
      const timeZoneName = timezoneResponse.data.timeZoneName;
      setTimeZone(timeZoneName);
      setError(null);
    }).catch((timezoneError) => {
      setError(`Error retrieving time zone data: ${timezoneError.message}`);
    });
  }, [latitude, longitude]);

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <>
          <h1>{city}</h1>
          <h2>{timeZone}</h2>
        </>
      )}
    </div>
  );
}

export default CityTimezone;


