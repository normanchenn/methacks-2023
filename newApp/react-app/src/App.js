import './App.css';
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CitySummary } from './components/CitySummary';
import { GenerateRec } from './components/GenerateRec';
import { UserPreferences } from './components/UserPreferences';
import { Welcome } from './components/Welcome';
import { Interests } from './components/Interests';
import { Inputs } from './components/Inputs';
import { Stats } from './components/Stats';
import { Results } from './components/Results';
import { About } from './components/About';


function App() {
  return (
    <Router>
      <nav className="border-b border-gray-300">
        <ul className="flex p-8">
          <li><Link to="/">Logo!</Link></li>
          {/* <li className="ml-auto"><Link to="/something">something</Link></li> */}
          <li className="ml-auto"><Link to="/about">About Us</Link></li>
        </ul>
      </nav>
      {/* <div className="text-red-500">
        test
      </div>
      <CitySummary />
      <GenerateRec />
      <UserPreferences /> */}
      <Routes>
        <Route exact path="/" element={<Welcome />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/inputs" element={<Inputs />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/results" element={<Results />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
