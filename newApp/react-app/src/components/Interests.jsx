import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';

export const Interests = () => {
    const [interests, setInterests] = useState([]);
    const [isDone, setIsDone] = useState(false);
    const addInterest = (event) => {
        event.preventDefault();
        const newInterest = event.target.interest.value;
        if (!newInterest){
            return;
        }
        setInterests([...interests, newInterest]);
        sessionStorage.setItem('interests', JSON.stringify([...interests, newInterest]));
        event.target.interest.value = "";
    };
    useEffect(() => {
        console.log(interests);
        if (interests.length > 0){
            setIsDone(true);
        }
        else {
            setIsDone(false);
        }
      }, [interests]);
  return (
    <div className="flex flex-row h-screen bg-gradient-to-b from-cyan-800 to-orange-100 text-white">
        <div className="flex flex-col w-1/2">
            <div className="h-1/2 text-8xl p-12">Enter Keywords</div>
            <div className="h-1/2 text-6xl p-12">Tell us what you're interested in!</div>
        </div>
        <div className="flex-grow bg-red-500 rounded-3xl m-24 bg-stone-300 justify-center text-center">
            <form onSubmit={addInterest} className="rounded-full w-95 h-10 text-black px-4 m-4 bg-white flex flex-row">
                <input type="text" placeholder="Enter Hobbies" name="interest" className="basis-10/12"/>
                <button type="submit" className="px-2 text-gray-500">Add</button>
            </form>
            <div className="text-black grid grid-cols-2">
                {interests.map((interest) => (
                    <div key={interest} className="w-full p-6">
                        <Block word={interest} className=""/>
                    </div>
                ))}
            </div>
            {isDone && <Link to="/inputs" className="flex justify-center"><div className="bg-white text-black rounded-lg h-20 w-1/2 flex items-center"><p className="w-full">Done?</p></div></Link>}
        </div>
    </div>
  )
}

const Block = ({ word }) => {
    return (
        <div className="bg-white rounded-lg h-20 flex items-center">
            <p className="w-full">{word}</p>
        </div>
    )
}