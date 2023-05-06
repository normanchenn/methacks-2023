// npm install --save google-maps-react

import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const mapStyles = {
  width: '50%',
  height: '50%'
};

class MapContainer extends Component {
  render() {
    const { google } = this.props;
    return (
      <Map
        google={google}
        zoom={8}
        style={mapStyles}
        initialCenter={{ lat:  48.8566, lng: 2.3522 }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDSuUPMgyRXTIgpUIWtBfWOyavLBdXsEJE'
})(MapContainer);


