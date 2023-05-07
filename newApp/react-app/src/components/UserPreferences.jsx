import React, {useState, useEffect} from 'react'

export const UserPreferences = () => {
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
    <div>
        <h1>User Preferences</h1>
        <form onSubmit={addInterest}>
            <input type="text" name="interest" placeholder="add interests" />
            <button type="submit">Add</button>
        </form>
        <ul>
            {interests.map((interest, index) => (
                <li key={index}>{interest}</li>
            ))}
        </ul>
    </div>
  )
}
