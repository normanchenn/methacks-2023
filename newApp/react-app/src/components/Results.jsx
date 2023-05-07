import React from 'react';
import MapContainerWrapper from './DynamicMap';

export const Results = () => {
  const cityData = JSON.parse(sessionStorage.getItem("cityData"));

  return (
    <div className="flex flex-row h-screen bg-gradient-to-r from-cyan-800 to-gray-100 text-white">
      <MapContainerWrapper cityData={cityData} />
    </div>
  );
};


// Also need to add the flight options in here