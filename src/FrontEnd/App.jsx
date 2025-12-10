import { PI } from "three/tsl";
import "./App.css";
import Hyperspeed from "./external/Hyperspeed.jsx";
export default function App() {
  return (
    <>
      <div className="app-container">
        {/* Hyperspeed Background - Interactive */}
        <Hyperspeed />

        <div className="glass-heading">
          <h1>Hyperspeed</h1>
        </div>
        <div className="upload">
          <div class="container">
            <div class="folder">
              <div class="front-side">
                <div class="tip"></div>
                <div class="cover"></div>
              </div>
              <div class="back-side cover"></div>
            </div>
            <label class="custom-file-upload">
              <input class="title" type="file" />
              Upload a File
            </label>
          </div>
        </div>
        <div className="key">
          <form action="/" method="POST">
            <label for="code" className="code-label">Receive</label>
            
          </form>
        </div>
      </div>
    </>
  );
}
