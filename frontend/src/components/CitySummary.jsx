import React, {useState} from 'react'

export const CitySummary = () => {
    const [name, setName] = useState("");
    const [info, setInfo] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`Name: ${name}`);
        fetch(`http://localhost:3210/api/cities/${name}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setInfo(data);
            })
            .catch(error => {
                console.log(error);
            })
    }  
  return (
    <div>
        <h1>City Summary</h1>
        <form onSubmit={handleSubmit}>
            <label>
                Enter City Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <button type="submit">Enter</button>
        </form>
        {info.country && <div>Country: {info.country}</div>}
        {info.currency && <div>Currency: {info.currency}</div>}
        {info.population && <div>Population: {info.population}</div>}
    </div>
  )
}
