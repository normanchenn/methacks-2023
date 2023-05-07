import React from 'react';

export const Stats = () => {
  const cityData = JSON.parse(sessionStorage.getItem("cityData"));

  return (
    <div>
      <h1>City Stats</h1>
      {cityData.country && <div>Country: {cityData.country}</div>}
      {cityData.currency && <div>Currency: {cityData.currency}</div>}
      {cityData.population && <div>Population: {cityData.population}</div>}
      {cityData.language && <div>Language: {cityData.language}</div>}
      {cityData.popular_attractions && cityData.popular_attractions.map((attraction, index) => (<p key={index}>{attraction}</p>))}
      {cityData.local_cuisine && cityData.local_cuisine.map((dish, index) => (<div key={index}>Dish: {dish}</div>))}
      {cityData.latitude && <div>Latitude: {cityData.latitude}</div>}
      {cityData.longitude && <div>Longitude: {cityData.longitude}</div>}
    </div>
  );
};

