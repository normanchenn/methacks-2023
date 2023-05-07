import './App.css';
import { CitySummary } from './components/CitySummary';
import { GenerateRec } from './components/GenerateRec';
import { UserPreferences } from './components/UserPreferences';

function App() {
  return (
    <div className="App">
      <div className="text-red-500">
        test
      </div>
      <CitySummary />
      <GenerateRec />
      <UserPreferences />
    </div>
  );
}

export default App;
