import { useState } from "react";
import "./App.css";
import FlyerEditor from "./FlyerEditor";
import VideoEditor from "./video/VideoEditor";

function App() {
  const [activeTool, setActiveTool] = useState("flyer");

  const tabStyle = (active) => ({
    padding: "10px 28px",
    borderRadius: "25px",
    border: "none",
    background: active ? "#FFD700" : "#2a2a2a",
    color: active ? "#111" : "#aaa",
    fontWeight: active ? "bold" : "normal",
    cursor: "pointer",
    fontSize: "15px",
    fontFamily: "Arial",
    transition: "all 0.2s",
  });

  return (
    <div style={{ background: "#111", minHeight: "100vh" }}>
      {/* TAB SWITCHER */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        padding: "20px",
        background: "#1a1a1a",
        borderBottom: "2px solid #FFD700",
      }}>
        <button style={tabStyle(activeTool === "flyer")} onClick={() => setActiveTool("flyer")}>
          🖼️ Flyer Editor
        </button>
        <button style={tabStyle(activeTool === "video")} onClick={() => setActiveTool("video")}>
          🎬 Video Editor
        </button>
      </div>

      {/* ACTIVE TOOL */}
      {activeTool === "flyer" && <FlyerEditor />}
      {activeTool === "video" && <VideoEditor />}
    </div>
  );
}

export default App;