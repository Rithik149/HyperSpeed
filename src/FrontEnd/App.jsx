// import { PI } from "three/tsl";
import { useRef, useState, useEffect } from "react";
import "./App.css";
import Hyperspeed from "./external/Hyperspeed.jsx";

function Background() {
  return <Hyperspeed />;
}
export default function App() {
  const formRef = useRef(null);
  const fileRef = useRef(null);
  const [status, setStatus] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    //sets timer only after upload
    if (!uploadResult) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExpired(true);
          setUploadResult(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [uploadResult]);

  async function uploadFile(file) {
    setExpired(false);
    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json(); //data collected from the backend
      console.log("The Response is : ", data);

      setUploadResult(data);

      const now = Date.now();
      const remainingSeconds = Math.max(
        Math.floor((data.expiresAt - now) / 1000),
        0
      );

      setTimeLeft(remainingSeconds);

      setStatus(`Uploaded: ${data.file.name}\nShare Code: ${data.code}`);
      console.log(status);
    } catch (err) {
      console.error(err);
      setStatus("Upload Failed");
    }
  }

  function handleReceive(e) {
    e.preventDefault();

    const rawCode = e.target.code.value;
    const code = rawCode.replace(/\s+/g, "");

    if (code.length !== 6) return;

    const iframe = document.getElementById("download-frame");
    iframe.src = `http://localhost:3000/download/${code}`;
  }

  return (
    <>
      <div className="app-container">
        <Background />

        <div className="glass-heading">
          <h1>Hyperspeed</h1>
        </div>
        <div className="main-container">
          {!uploadResult && (
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
          )}
          {uploadResult && (
            <div className="share-box">
              <p id="heading">Share this code</p>

              <h1 className="share-code">{uploadResult.code}</h1>

              <p className="timer">
                Expires in: {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </p>

              <p className="file-info">
                {uploadResult.file.type} <br />
                {Math.round(uploadResult.file.size / 1024)} KB
              </p>
            </div>
          )}
          {expired && (
            <p className="expired-msg">
              Code expired.Upload again to generate a new code
            </p>
          )}
          <form onSubmit={handleReceive}>
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
      <iframe
        id="download-frame"
        style={{ display: "none" }}
        title="download"
      />
    </>
  );
}
