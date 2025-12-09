import { PI } from "three/tsl";
import "./App.css";
import Hyperspeed from "./external/Hyperspeed.jsx";
export default function App() {
  return (
    <div className="app-container">
      {/* Hyperspeed Background - Interactive */}
      <Hyperspeed />

      <div className="glass-heading">
        <h1>Hyperspeed</h1>
      </div>
      
    </div>
  );
}