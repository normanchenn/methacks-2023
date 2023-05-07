import React, {useState} from 'react'

export const Inputs = () => {
    const [name, setName] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`Name: ${name}`);
        fetch(`http://localhost:4321/api/cities/${name}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                sessionStorage.setItem("cityData", JSON.stringify(data));
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
    </div>
  )
}
