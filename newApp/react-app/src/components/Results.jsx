import React from 'react';
import MapContainerWrapper from './DynamicMap';

export const Results = () => {
  const cityData = JSON.parse(sessionStorage.getItem("cityData"));

  return (
    // <div className="flex flex-row h-screen bg-gradient-to-r from-cyan-800 to-orange-100 text-white">
    //   <MapContainerWrapper cityData={cityData} />
    // </div>
    <div className="flex flex-row h-screen bg-gradient-to-r from-cyan-800 to-orange-100 tex-white">
        <div className="flex flex-col w-1/2">
            <div className="h-1/2 text-8xl p-2">
                <div className="border-2 border-red-500 h-5/6 w-5/6 ml-12">
                    <MapContainerWrapper cityData={cityData}/>
                </div>
                <div className=" h-12 m-2 flex items-center justify-center rounded-full bg-opacity-50 bg-slate-400">
                    <p className="text-2xl text-white">
                       Map Location
                    </p>
                </div>
            </div>
            <div className="h-1/2 text-8xl">
                <div className="h-5/6 w-5/6 ml-12 border-2 border-red-500">
                    flight itinerary
                </div>
                <div className=" h-12 m-2 flex items-center justify-center rounded-full bg-opacity-50 bg-slate-400">
                    <p className="text-2xl text-white">
                       Flight Choices
                    </p>
                </div>
            </div>
        </div>
        <div className="flex-grow rounded-3xl m-12 bg-stone-300 justify-center text-center">
            itinerary
        </div>
    </div>
  )
};


// Also need to add the flight options in here