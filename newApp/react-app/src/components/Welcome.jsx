import React from 'react'
import homeBackground from "./homeBackground.png";
import { Link } from 'react-router-dom';

export const Welcome = () => {
  return (
    <div className="bg-cover bg-center h-screen z-0" style={{backgroundImage: `url(${homeBackground})`}} >
        <div className="flex flex-col font-mono text-white">
            <div className="text-6xl pt-24 pl-24">Hello!</div>
            <div className="text-8xl text-center pt-24">Explore with Journex</div>
            <Link to="/interests">
                <div className="text-4xl text-right pt-24 pr-24">A little bit far from home...?</div>
            </Link>
        </div>
    </div>
  )
}
