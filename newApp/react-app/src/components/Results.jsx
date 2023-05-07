import React from 'react';
import MapContainerWrapper from './DynamicMap';

export const Results = () => {
  const cityData = JSON.parse(sessionStorage.getItem("cityData"));

  return (
    <div>
      <MapContainerWrapper cityData={cityData} />
    </div>
  );
};
