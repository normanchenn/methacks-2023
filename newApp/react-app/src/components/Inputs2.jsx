import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

export const Inputs2 = () => {
    const [days, setDays] = useState(0);
    const [display, setDisplay] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`Days: ${days}`);
        sessionStorage.setItem("Days", JSON.stringify(days));
        navigate('/stats');
    }  
    const handleChange = (event) => {
        setDays(event.target.value);
    }
    useEffect(() => {
        if (days.toString().length > 0){
            setDisplay(true);
        }
        else {
            setDisplay(false);
        }
      }, [days]);
  return (

    <div className="bg-gradient-to-b from-orange-100 to-cyan-800 h-screen flex flex-col">
        <div className=" h-20 flex items-center justify-center m-24 rounded-full opacity-50 bg-slate-400"><p className="text-4xl text-white">How many days will you visit? (2/2)</p></div>
            {/* <input class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Enter text" /> */}
        <form className="flex items-center justify-center px-60" onSubmit={handleSubmit}>
            <input type="text" onChange={handleChange} className="border-b border-gray-500 outline-none bg-transparent w-full text-6xl p-4 text-center text-white" />
            {/* {display && <Link to="/stats" ><button type="submit" className="text-white border border-black bg-transparent p-2">Enter</button></Link>} */}
            {display && <button type="submit" className="text-white border border-black bg-transparent p-2">Enter</button>}
        </form>
    </div>
  )
}
