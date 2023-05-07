import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const StatsSection = ({ title, data }) => (
  <div className="p-2">
    <h2 className="font-bold text-lg">{title}</h2>
    <ul className="list-disc pl-4">
      {data.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

StatsSection.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export const Stats = () => {
  const cityData = JSON.parse(sessionStorage.getItem('cityData'));
  const summary = JSON.parse(sessionStorage.getItem('summary'));

  return (
    <div className="flex flex-col items-center justify-center h-full bg-orange-100">
      <div className="w-full md:w-4/6 lg:w-3/5 xl:w-3/5 bg-cyan-800 bg-opacity-50 text-lg text-center p-7 mb-8 rounded-xl">
        <h1 className="font-bold text-2xl mb-4">{cityData.name}, {cityData.country}</h1>
        <p className="mb-2">
          People from {cityData.name} speak {cityData.language} and use {cityData.currency}.
        </p>
        <p className="mb-2">
          Call {cityData.emergency_service_number} if you are in trouble.
        </p>
        <p className="mb-2">
          You will have to adapt to the {cityData.timezone} timezone.
        </p>
      </div>

      <div className="w-full md:w-4/6 lg:w-4/5 xl:w-3/5 bg-orange-200 opacity-75 text-lg text-center p-8 mb-8 rounded-x1">
        <p>
          Here's some basic information about {cityData.name}, {cityData.country}!
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full justify-between">
        <div className="w-full md:w-5/12 lg:w-1/2 xl:w-1/3 bg-cyan-800 bg-opacity-50 text-lg text-center p-8 mb-8 rounded-xl mx-auto md:mx-65">
            <StatsSection title="Local Cuisine" data={cityData.local_cuisine} />
        </div>
        <div className="w-full md:w-5/12 lg:w-1/2 xl:w-1/3 bg-cyan-800 bg-opacity-50 text-lg text-center p-8 mb-8 rounded-xl mx-auto md:mx-65">
            <StatsSection title="Local Customs" data={cityData.local_customs} />
        </div>
    </div>


    <div className="w-full md:w-4/6 lg:w-3/5 xl:w-3/5 bg-cyan-800 bg-opacity-50 text-lg text-center p-8 mb-8 rounded-xl">
        <h2 className="font-bold text-2xl mb-4">Quick Summary</h2>
        <p>{summary}</p>
    </div>

    <Link to="/results" className="w-1/3 md:w-1/6 rounded-xl bg-orange-200 bg-opacity-100 text-2xl text-center py-4 hover:transform hover:scale-110 transition duration-500
             transform hover:rotate-3 hover:-translate-y-3 hover:shadow-lg">
        Go to Itinerary
    </Link>


    </div>
  );
};