import { CitySummary } from "./components/CitySummary";
import { UserPreferences } from "./components/UserPreferences";
import { GenerateRec } from "./components/GenerateRec";
import MapContainerWrapper from "./components/DynamicMap"; // <-- Change here
import { Other } from "./components/Other";
import './index.css';

function App() {
  return (
      <div>
        frontend
        <CitySummary />
        <MapContainerWrapper />
        <UserPreferences />
        <GenerateRec />
      </div>
      
  )
}

export default App

