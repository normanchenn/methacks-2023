import React from 'react';
import homeBackground from './homeBackground.png';
import { Link } from 'react-router-dom';

export const Welcome = () => {
  return (
    <div
      className="bg-cover bg-center h-screen z-0"
      style={{ backgroundImage: `url(${homeBackground})` }}
    >
      <div className="flex flex-col font-mono text-white">
        <div className="text-6xl pt-24 pl-24">Hello!</div>
        <div className="text-8xl text-center pt-24">Explore with Journex</div>
        <div className="text-right pt-24 pr-24">
          <Link to="/interests">
            <button
              className="text-4xl transform hover:-translate-y-1 animate-bounce inline-flex items-center"
              style={{
                animationDuration: '2s',
                animationIterationCount: 'infinite',
                justifyContent: 'flex-end',
                position: 'absolute',
                right: '50px',
              }}
            >
              <span>Let's go</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
