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
  const [initialized, setInitialized] = useState(false); // new state variable

  useEffect(() => {
    if (cityData) {
      console.log('cityData:', cityData);
      const { latitude, longitude } = cityData;
      console.log('latitude:', latitude, 'longitude:', longitude);
      setLatitude(parseFloat(latitude) || 0);
      setLongitude(parseFloat(longitude) || 0);
      setInitialized(true); // update initialized state
      setShowMap(true); // set showMap to true after initializing the component
    }
  }, [cityData]);
  

  return (
    <>
      {initialized && showMap && ( // only render map if initialized and showMap are both true
        <Map
          google={google}
          zoom={8}  
          style={mapStyles}
          center={{ lat: latitude, lng: longitude}}
        >
          <Marker
            position={{ lat: latitude, lng: longitude}}
          />
        </Map>
      )}
    </>
  );
};

const LoadingContainer = () => (
  <div>Loading...</div>
);

const MapContainerWrapper = GoogleApiWrapper({
  apiKey: 'AIzaSyDSuUPMgyRXTIgpUIWtBfWOyavLBdXsEJE',
  LoadingContainer: LoadingContainer,
})(MapContainer);

export default MapContainerWrapper;
