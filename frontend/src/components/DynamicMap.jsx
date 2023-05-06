// npm install --save google-maps-react

import React, { useState, useEffect } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  position: 'fixed',
  top: '10%',
  left: '25%',
  width: '50%',
  height: '50%',
  zIndex: '1'
};

const MapContainer = (props) => {
  const { google, cityData } = props;
  const [showMap, setShowMap] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (cityData) {
      const { latitude, longitude } = cityData;
      setLatitude(parseFloat(latitude) || 0);
      setLongitude(parseFloat(longitude) || 0);
      setShowMap(true);
    }
  }, [cityData]);

  return (
    <>
      {showMap && (
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
      )}
    </>
  );
};

const MapContainerWrapper = GoogleApiWrapper({
  apiKey: 'AIzaSyDSuUPMgyRXTIgpUIWtBfWOyavLBdXsEJE'
})(MapContainer);

export default MapContainerWrapper;












