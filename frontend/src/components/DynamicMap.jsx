// npm install --save google-maps-react

import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '50%',
  height: '50%',
};

const MapContainer = (props) => {
  const { google, latitude, longitude } = props;

  return (
    <Map google={google} zoom={8} style={mapStyles} center={{ lat: latitude || 0, lng: longitude || 0 }}>
      <Marker position={{ lat: latitude || 0, lng: longitude || 0 }} />
    </Map>
  );
};

const MapContainerWrapper = GoogleApiWrapper({
  apiKey: 'AIzaSyDSuUPMgyRXTIgpUIWtBfWOyavLBdXsEJE',
})(MapContainer);

export default MapContainerWrapper;










