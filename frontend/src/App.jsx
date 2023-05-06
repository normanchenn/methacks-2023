import { CitySummary } from "./components/CitySummary";
import DynamicMap from "./components/DynamicMap";
import { UserPreferences } from "./components/UserPreferences";
import { GenerateRec } from "./components/GenerateRec";

function App() {
  return (
      <div>
        frontend
        <CitySummary />
        <UserPreferences />
        <GenerateRec />
        <DynamicMap />
      </div>
      
  )
}

export default App
