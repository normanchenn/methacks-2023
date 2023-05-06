import { CitySummary } from "./components/CitySummary";
// import DynamicMap from "./components/DynamicMap";
import { UserPreferences } from "./components/UserPreferences";
import { GenerateRec } from "./components/GenerateRec";

function App() {
  return (
      <div>
        frontend
        <CitySummary />
        {/* <DynamicMap  /> */}
        <UserPreferences />
        <GenerateRec />
      </div>
      
  )
}

export default App
