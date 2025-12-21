// import { PI } from "three/tsl";
import { useRef, useState, useEffect } from "react";
import "./App.css";
import Hyperspeed from "./external/Hyperspeed.jsx";

export default function App() {
  const formRef = useRef(null);
  const fileRef = useRef(null);
  const [status, setStatus] = useState("");
  const [uploadResult, setUploadResult] = userState(null);
  const [timeLeft, setTimeLeft] = userState(0);

  async function uploadFile(file) {
    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      console.log("The Response is : ", data);

      setUploadResult(data);
      setTimeLeft(10 * 60);
      

      setStatus(`Uploaded: ${data.file.name}\nShare Code: ${data.code}`);
      console.log(status);
    } catch (err) {
      console.error(err);
      setStatus("Upload Failed");
    }
  }

  return (
    <>
      <div className="app-container">
        <Hyperspeed />

        <div className="glass-heading">
          <h1>Hyperspeed</h1>
        </div>
        <div className="main-container">
          <form ref={formRef}>
            <div className="container">
              <div className="folder">
                <div className="front-side">
                  <div className="tip"></div>
                  <div className="cover"></div>
                </div>
                <div className="back-side cover"></div>
              </div>
              <label className="custom-file-upload">
                <input
                  className="title"
                  type="file"
                  name="file"
                  ref={fileRef}
                  accept="image/*,video/*,audio/*,.zip"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) uploadFile(file);
                  }}
                />
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
