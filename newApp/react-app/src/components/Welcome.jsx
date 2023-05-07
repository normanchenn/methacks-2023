import React from 'react'
// import home-background from
import {homeBackground} from "../pictures";

export const Welcome = () => {
  return (
    <div>
        {/* style={{
        backgroundImage: `url($../pictures/home-background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }} */}
        <div>Hello</div>
        <div>Explore with Journex</div>
        <div>A little bit far from home?</div>
        <img src={homeBackground} alt="my image" />
    </div>
  )
}
