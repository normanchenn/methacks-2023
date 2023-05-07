import React, {useState, useEffect} from 'react'
// import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Interests = () => {
    const [interests, setInterests] = useState([]);
    const [isDone, setIsDone] = useState(false);
    const [responses, setResponses] = useState([]);
    const navigate = useNavigate();
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
      const handleSubmit = () => {
        const promises = interests.map(interest =>
          fetch(`http://localhost:4321/api/cohere/hobbies/${interest}`)
            .then(response => response.json())
            .catch(error => console.error(error))
        );
        
        Promise.all(promises)
          .then(data => {
            console.log(data);
            setResponses(data);
            // sessionStorage.setItem('responses', JSON.stringify(responses));
            // navigate('/inputs');

          })
          .catch(error => console.error(error));
      }
      useEffect(() => {
        sessionStorage.setItem('responses', JSON.stringify(responses))
        if (isDone === true){
            navigate('/inputs');
        }
      }, [responses]);

  return (  
    <div className="flex flex-row h-screen bg-gradient-to-b from-cyan-800 to-gray-100 text-white">
        <div className="flex flex-col w-1/2">
            <div className="h-1/2 text-8xl p-12">Enter Keywords</div>
            <div className="h-1/2 text-6xl p-12">Tell us what you're interested in!</div>
        </div>
        <div className="flex-grow rounded-3xl m-24 bg-stone-300 justify-center text-center">
            <form onSubmit={addInterest} className="rounded-full w-95 h-10 text-black px-4 m-4 bg-white flex flex-row">
                <input type="text" placeholder="Enter Hobbies" name="interest" className="basis-10/12 outline-none"/>
                <button type="submit" className="px-2 text-gray-500">Add</button>
            </form>

            <div className="text-black grid grid-cols-2">
                {interests.map((interest) => (
                    <div key={interest} className="w-full p-6">
                        <Block word={interest} className=""/>
                    </div>
                ))}
            </div>
            {/* {isDone && <Link to="/inputs" className="flex justify-center"><div className="bg-white text-black rounded-lg h-20 w-1/2 flex items-center border-2 border-black"><p className="w-full">Done</p></div></Link>} */}
            {/* {isDone && <button className="flex justify-center"><div className="bg-white text-black rounded-lg h-20 w-1/2 flex items-center border-2 border-black"><p className="w-full">Done</p></div></button>} */}
            {isDone && <div className="flex justify-center"><button onClick={handleSubmit} className="bg-white text-black rounded-lg h-20 w-1/2 flex items-center border-2 border-black"><p className="w-full">Done</p></button></div>}
        </div>
        {/* <div className="mt-auto mb-5">
          <Link
            to="/inputs"
            className="text-black hover:underline bg-white rounded-full py-2 px-4 hover:scale-110 transition duration-500 ease-in-out">
            Skip
          </Link>
        </div> */}
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