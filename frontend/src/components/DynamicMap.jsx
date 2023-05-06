// npm install --save google-maps-react

import React, { useState, useEffect } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '50%',
  height: '50%'
};

const MapContainer = (props) => {
  const { google } = props;
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    const storedCityData = sessionStorage.getItem('cityData');
    if (storedCityData) {
      const { latitude, longitude } = JSON.parse(storedCityData);
      setLatitude(parseFloat(latitude) || 0);
      setLongitude(parseFloat(longitude) || 0);
    }
  }, []);

  useEffect(() => {
    console.log(latitude);
  }, [latitude]);

  useEffect(() => {
    console.log(longitude);
  }, [longitude]);

  return (
    <Map
      google={google}
      zoom={8}  
      style={mapStyles}
      center={{ lat: latitude || 0, lng: longitude || 0 }}
    >
      <Marker
        position={{ lat: latitude || 0, lng: longitude || 0 }}
      />
    </Map>
  );
};

const MapContainerWrapper = GoogleApiWrapper({
  apiKey: 'AIzaSyDSuUPMgyRXTIgpUIWtBfWOyavLBdXsEJE'
})(MapContainer);

export default MapContainerWrapper;









