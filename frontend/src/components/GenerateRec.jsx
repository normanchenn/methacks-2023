import React, {useState, useEffect} from 'react'

export const GenerateRec = () => {
  const [interests, setInterests] = useState([]);
  const [results, setResults] = useState([]);
  useEffect(() => {
    const storedInterests = JSON.parse(sessionStorage.getItem('interests'));
    setInterests(storedInterests || []);
    console.log(interests);
  }, []);

  const handleSubmit = async () => {
    const responses = await Promise.all(
      interests.map(async (interest) => {
        const url = `http://localhost:3210/api/cohere/hobbies3/${interest}`;
        const response = await fetch(url);
        return response.json();
      })
    );

    const data = responses.flatMap((response) => response.data);

    setResults(data);
  };

  return (
    <div>
      <h1>Generate Recommendations</h1>
      <ul>
        {interests.map((interest, index) => (
          <li key={index}>{interest}</li>
          ))}
      </ul>
      <button onSubmit={handleSubmit}>Generate Recommendation</button>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  )
}
