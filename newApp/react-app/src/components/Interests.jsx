import React, {useState, useEffect} from 'react'


export const Interests = () => {
    const [interests, setInterests] = useState([]);
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
      }, [interests]);
  return (
    <div className="flex flex-row h-screen bg-gradient-to-b from-cyan-800 to-gray-100 text-white">
        <div className="flex flex-col w-1/2">
            <div className="h-1/2 text-8xl p-12">Enter Keywords</div>
            <div className="h-1/2 text-6xl p-12">Tell us what you're interested in!</div>
        </div>
        <div className="flex-grow bg-red-500 rounded-3xl m-24 bg-stone-300 justify-center text-center">
            <form onSubmit={addInterest} className="rounded-full w-80 h-10 text-black px-4 m-4 bg-white flex flex-row">
                <input type="text" placeholder="Search" name="interest" className="basis-10/12"/>
                <button type="submit" className="px-2 text-gray-500">Add</button>
            </form>
            <ul>
            {interests.map((interest, index) => (
                <li key={index}>{interest}</li>
            ))}
        </ul>
        </div>
    </div>
  )
}