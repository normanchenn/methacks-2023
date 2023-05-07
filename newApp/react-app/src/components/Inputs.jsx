import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

export const Inputs = () => {
    const [name, setName] = useState("");
    const [display, setDisplay] = useState(false);
    const navigate = useNavigate();
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     console.log(`Name: ${name}`);
    //     fetch(`http://localhost:4321/api/cities/${name}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data);
    //             sessionStorage.setItem("cityData", JSON.stringify(data));

    //             navigate('/inputs2');
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    //     }  
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(`Name: ${name}`);
      
        try {
          const response = await fetch(`http://localhost:4321/api/cities/${name}`);
          const cityData = await response.json();
      
          console.log(cityData);
      
          sessionStorage.setItem("cityData", JSON.stringify(cityData));
      
          const summaryResponse = await fetch(`http://localhost:4321/api/cohere/citySummary/${name}`);
          const summaryData = await summaryResponse.json();
          
          console.log(summaryData);
          sessionStorage.setItem("summary", JSON.stringify(summaryData));
      
          navigate('/inputs2');
        } catch (error) {
          console.log(error);
        }
      };
      


    const handleChange = (event) => {
        setName(event.target.value);
    }
    useEffect(() => {
        if (name.length > 0){
            setDisplay(true);
        }
        else {
            setDisplay(false);
        }
      }, [name]);
  return (

    <div className="bg-gradient-to-b from-orange-100 to-cyan-800 h-screen flex flex-col">
        <div className=" h-20 flex items-center justify-center m-24 rounded-full bg-opacity-50 bg-slate-400"><p className="text-4xl text-white">Where's your destination?  (1/2)</p></div>
            {/* <input class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Enter text" /> */}
        <form className="flex items-center justify-center px-60" onSubmit={handleSubmit}>
            <input type="text" onChange={handleChange} className="border-b border-gray-500 outline-none bg-transparent w-full text-6xl p-4 text-center text-white" />
            {/* {display && <Link to="/stats" ><button type="submit" className="text-white border border-black bg-transparent p-2">Enter</button></Link>} */}
            {display && <button type="submit" className="text-white border border-black bg-transparent p-2">Enter</button>}
        </form>
    </div>
  )
}
