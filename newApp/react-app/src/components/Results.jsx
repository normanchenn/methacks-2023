import React, {useState, useEffect} from 'react';
import MapContainerWrapper from './DynamicMap';
import ecoFriendly from "./ecoFriendly.png";
import money from "./money.png";
import dollar from "./dollar.svg";

export const Results = () => {
  const cityData = JSON.parse(sessionStorage.getItem("cityData"));
  const [flightOptions, setFlightOptions] = useState([]);
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    const fetchItinerary = async () => {
        if (cityData){

            try {
              const response = await fetch(`http://localhost:4321/api/itinerary/${cityData.country}`);
              const data = await response.json();
              setItinerary(data);
            } catch (error) {
              console.error(error);
            }
        }
    };
    fetchItinerary();
  }, [cityData]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(`http://localhost:4321/api/flights/${cityData.country}`);
        const data = await response.json();
        setFlightOptions(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFlights();
  }, [cityData]);
  return (
    // <div className="flex flex-row h-screen bg-gradient-to-r from-cyan-800 to-orange-100 text-white">
    //   <MapContainerWrapper cityData={cityData} />
    // </div>
    <div className="flex flex-row h-screen bg-gradient-to-r from-cyan-800 to-orange-100 tex-white">
        <div className="flex flex-col w-1/2">
            <div className="h-1/2 text-8xl p-2">
                <div className="h-5/6 w-5/6 ml-12">
                    <MapContainerWrapper cityData={cityData}/>
                </div>
                <div className=" h-12 m-2 flex items-center justify-center rounded-full bg-opacity-50 bg-slate-400">
                    <p className="text-2xl text-white">
                       Map Location
                    </p>
                </div>
            </div>
            <div className="h-1/2 text-lg">
                <div className="h-5/6 w-5/6 ml-12">
              {flightOptions.map((flightOption, index) => (
                <div key={index} className="grid grid-cols-4 h-1/2 bg-stone-300 rounded-lg border-2 border-black">
                    <div className="grid grid-rows-2 flex justify-center items-center p-2">
                        <div>
                            {flightOption.startTime.substring(flightOption.startTime.length - 8, flightOption.startTime.length - 3)} - {flightOption.endTime.substring(flightOption.endTime.length - 8, flightOption.endTime.length - 3)}
                        </div>
                        <div>
                            {flightOption.totalDuration.hours} hours {flightOption.totalDuration.minutes} minutes
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        with {flightOption.airline}
                    </div>
                    <div className="grid grid-rows-2 flex justify-center items-center">
                        <div>{flightOption.numberOfLayovers} Layover(s)</div>
                        <div>${flightOption.price}</div>
                    </div>
                    <div className="flex justify-center items-center">
                        {index === 0 ? (
                            // <i className="fa fa-plane-departure"></i>
                            <img src={dollar} className="h-24"/>
                            ) : (
                            <img src={ecoFriendly} className="w-24"/>
                            )}
                    </div>
                </div>
              ))}
                </div>
                <div className=" h-12 m-2 flex items-center justify-center rounded-full bg-opacity-50 bg-slate-400">
                    <p className="text-2xl text-white">
                       Flight Choices
                    </p>
                </div>
            </div>
        </div>
        <div className="flex-grow rounded-3xl m-12 bg-stone-300 justify-center text-center">
            {itinerary.map((item) => {
                <div>{item}</div>
            })}
        </div>
    </div>
  )
};


// Also need to add the flight options in here