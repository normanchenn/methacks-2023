import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

export const Stats = () => {
  const cityData = JSON.parse(sessionStorage.getItem("cityData"));
  const summary = JSON.parse(sessionStorage.getItem("summary"));


  return (
    <div className="bg-orange-100 h-screen relative">
        <div className="absolute top-10 left-10 h-4/6 w-4/6 rounded-xl bg-cyan-800 bg-opacity-50 text-2xl flex items-center justify-center w-full">
            <ul>
                <li>People from {cityData.name} speak {cityData.language}.</li>
                <li>They use {cityData.currency}.</li>
                <li>Call {cityData.emergency_service_number} if you are in trouble.</li>
                <li>You will have to adapt to the {cityData.timezone} timezone.</li>
                <li>
                    Locals like to eat the following:
                    <ul className="pl-4">
                        {cityData.local_cuisine.map((item, index) => (
                        <li key={index}>{item}</li>
                        ))}
                    </ul>
                </li>
                <li>
                    Be aware of these customs:
                     <ul className="pl-4">
                        {cityData.local_customs.map((item, index) => (
                        <li key={index}>{item}</li>
                        ))}
                    </ul>
                </li>
            </ul>
        </div>
        <div className="absolute bottom-14 left-10 h-1/6 w-3/6 rounded-xl bg-orange-200 opacity-75 text-lg flex items-center justify-center w-full z-10">
            Here's some basic information about {cityData.name}, {cityData.country}!
        </div>
        <div className="absolute bottom-10 right-10 h-2/6 w-3/6 rounded-xl bg-cyan-800 bg-opacity-50 text-xl flex items-center justify-center w-full">
            <div className="p-10 z-20">
                Here's a quick summary!
                {summary}
            </div>
        </div>
        <Link to="/results" className="absolute top-20 right-20 h-3/6 w-1/6 rounded-xl bg-orange-200 bg-opacity-75 flex items-center justify-center text-2xl">Go to Itinerary</Link>
    </div>
  );
};

