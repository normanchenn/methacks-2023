import React, {useState, useEffect} from 'react'

export const GenerateRec = () => {
  const [interests, setInterests] = useState([]);
  useEffect(() => {
    const storedInterests = JSON.parse(sessionStorage.getItem('interests'));
    setInterests(storedInterests || []);
    console.log(interests);
  }, []);
  return (
    <div>
      <h1>Generate Recommendations</h1>
      <ul>
        {interests.map((interest, index) => (
          <li key={index}>{interest}</li>
        ))}
      </ul>
    </div>
  )
}
