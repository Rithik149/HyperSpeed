// import { PI } from "three/tsl";
import { useRef } from "react";
import "./App.css";
import Hyperspeed from "./external/Hyperspeed.jsx";

export default function App() {
  const formRef=useRef(null);
  const fileChange=()=>{
    if(formRef.current){
      formRef.current.submit();
    }
  };
  return (
    <>
      <div className="app-container">
        {/* Hyperspeed Background - Interactive */}
        <Hyperspeed />

        <div className="glass-heading">
          <h1>Hyperspeed</h1>
        </div>
        <div className="main-container">
          <form action="/upload" method="POST" ref={formRef}>
            <div className="container">
              <div className="folder">
                <div className="front-side">
                  <div className="tip"></div>
                  <div className="cover"></div>
                </div>
                <div className="back-side cover"></div>
              </div>
              <label className="custom-file-upload">
                <input className="title" type="file" accept="image/*,video/*,audio/*,.zip" onChange={fileChange} />
                Upload a File
              </label>
            </div>
          </form>
          <form action="/download" method="POST">
            <div className="key">
              <label htmlFor="key">Receive</label>
              <input
                type="text"
                id="key"
                name="code"
                pattern="\d{6}"
                maxLength="6"
                placeholder="Enter key"
                title="Enter key"
              ></input>
              <button className="button" type="submit">
                <span className="button-content">Download </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
