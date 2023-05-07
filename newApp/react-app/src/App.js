import './App.css';
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Welcome } from './components/Welcome';
import { Interests } from './components/Interests';
import { Inputs } from './components/Inputs';
import { Stats } from './components/Stats';
import { Results } from './components/Results';
import { About } from './components/About';
import Logo from '../src/Logo.png';

function App() {
  return (
    <div data-testid="app">
    <Router>
      <nav className="bg-cyan-800 border-b border-gray-300 z-10 text-white h-16 flex justify-between items-center">
        <a href="/" className="mx-4 inline-block">
          <img src={Logo} alt="My Logo" className="h-12 hover:rotate-180 transform origin-center transition duration-1000 ease-in-out" />
        </a>
        <ul className="flex justify-end items-center">
          <li className="mr-4"><Link to="/about">About Us</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route exact path="/" element={<Welcome />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/inputs" element={<Inputs />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/results" element={<Results />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;