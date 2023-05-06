import React, { useState } from 'react';
import DynamicMap from './DynamicMap';

export const CitySummary = () => {
  const [name, setName] = useState('');
  const [info, setInfo] = useState({});
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Name: ${name}`);
    fetch(`http://localhost:3210/api/cities/${name}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setInfo(data);
        sessionStorage.setItem('cityData', JSON.stringify(data));
        setLatitude(parseFloat(data.latitude) || 0);
        setLongitude(parseFloat(data.longitude) || 0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>City Summary</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter City Name:{' '}
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="submit">Enter</button>
      </form>
      {info.country && <div>Country: {info.country}</div>}
      {info.currency && <div>Currency: {info.currency}</div>}
      {info.population && <div>Population: {info.population}</div>}
      {info.language && <div>Language: {info.language}</div>}
      {info.popular_attractions &&
        info.popular_attractions.map((attraction, index) => <p key={index}>{attraction}</p>)}
      {info.local_cuisine &&
        info.local_cuisine.map((dish, index) => (
          <div key={index}>Dish: {dish}</div>
        ))}
      <DynamicMap latitude={latitude} longitude={longitude} />
    </div>
  );
};
