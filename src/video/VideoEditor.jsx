import { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

/* =====================================
    KARMA AD MAKER — VIDEO EDITOR
    Timeline-based video editor with:
    - Video/Image clip import
    - Trim per clip
    - Text overlays
    - Background music
    - MP4 export via ffmpeg.wasm
====================================== */

let ffmpegInstance = null;

async function getFFmpeg(onProgress) {
  if (ffmpegInstance) return ffmpegInstance;

  const ffmpeg = new FFmpeg();
  ffmpeg.on("progress", ({ progress }) => {
    if (onProgress) onProgress(Math.round(progress * 100));
  });

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}
function VideoEditor() {
  const [clips, setClips] = useState([]); // { id, type: 'video'|'image', file, url, duration, trimStart, trimEnd }
  const [textOverlays, setTextOverlays] = useState([]); // { id, text, start, end, x, y, color, fontSize }
  const [musicFile, setMusicFile] = useState(null);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedUrl, setExportedUrl] = useState(null);
  const [selectedClipId, setSelectedClipId] = useState(null);
  const [error, setError] = useState(null);

  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const musicInputRef = useRef(null);

  /* =====================================
      IMPORT CLIPS
  ====================================== */
  function handleVideoUpload(e) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const tempVideo = document.createElement("video");
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        const duration = tempVideo.duration;
        setClips((prev) => [
          ...prev,
          {
            id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: "video",
            file,
            url,
            duration,
            trimStart: 0,
            trimEnd: duration,
          },
        ]);
      };
    });
    e.target.value = "";
  }
  function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setClips((prev) => [
        ...prev,
        {
          id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          type: "image",
          file,
          url,
          duration: 3, // default 3 seconds per image
          trimStart: 0,
          trimEnd: 3,
        },
      ]);
    });
    e.target.value = "";
  }

  function handleMusicUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMusicFile(file);
  }

  /* =====================================
      CLIP MANAGEMENT
  ====================================== */
  function removeClip(id) {
    setClips((prev) => prev.filter((c) => c.id !== id));
    if (selectedClipId === id) setSelectedClipId(null);
  }

  function moveClip(id, direction) {
    setClips((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index === -1) return prev;
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated;
    });
  }

  function updateClipTrim(id, trimStart, trimEnd) {
    setClips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, trimStart, trimEnd } : c))
    );
  }

  function updateImageDuration(id, duration) {
    setClips((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, duration, trimEnd: duration } : c
      )
    );
  }

  /* =====================================
      TEXT OVERLAYS
  ====================================== */
  function addTextOverlay() {
    const totalDuration = getTotalDuration();
    setTextOverlays((prev) => [
      ...prev,
      {
        id: `text_${Date.now()}`,
        text: "Your Text Here",
        start: 0,
        end: Math.min(3, totalDuration || 3),
        x: 50, // percentage from left
        y: 80, // percentage from top
        color: "#ffffff",
        fontSize: 36,
      },
    ]);
  }

  function updateTextOverlay(id, updates) {
    setTextOverlays((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }

  function removeTextOverlay(id) {
    setTextOverlays((prev) => prev.filter((t) => t.id !== id));
  }

  /* =====================================
      HELPERS
  ====================================== */
  function getTotalDuration() {
    return clips.reduce((sum, c) => sum + (c.trimEnd - c.trimStart), 0);
  }

  /* =====================================
      EXPORT TO MP4
  ====================================== */
  async function exportVideo() {
    if (clips.length === 0) {
      setError("Add at least one video or image clip before exporting.");
      return;
    }

    setError(null);
    setExporting(true);
    setExportProgress(0);
    setExportedUrl(null);

    try {
      const ffmpeg = await getFFmpeg(setExportProgress);
      const segmentFiles = [];

      // Process each clip into a normalized segment (same resolution/fps)
      for (let i = 0; i < clips.length; i++) {
        const clip = clips[i];
        const inputName = `input_${i}.${clip.type === "video" ? "mp4" : "jpg"}`;
        const segmentName = `segment_${i}.mp4`;

        await ffmpeg.writeFile(inputName, await fetchFile(clip.file));

        if (clip.type === "video") {
          const trimDuration = clip.trimEnd - clip.trimStart;
          await ffmpeg.exec([
            "-i", inputName,
            "-ss", String(clip.trimStart),
            "-t", String(trimDuration),
            "-vf", "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,fps=30",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-an",
            segmentName,
          ]);
        } else {
          // image -> video clip
          await ffmpeg.exec([
            "-loop", "1",
            "-i", inputName,
            "-t", String(clip.duration),
            "-vf", "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,fps=30",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            segmentName,
          ]);
        }

        segmentFiles.push(segmentName);
      }

      // Build concat list
      const concatList = segmentFiles.map((f) => `file '${f}'`).join("\n");
      await ffmpeg.writeFile("concat_list.txt", concatList);

      await ffmpeg.exec([
        "-f", "concat",
        "-safe", "0",
        "-i", "concat_list.txt",
        "-c", "copy",
        "concatenated.mp4",
      ]);

      let currentOutput = "concatenated.mp4";

      // Add text overlays via drawtext filter chain
      if (textOverlays.length > 0) {
        const drawtextFilters = textOverlays
          .map((t) => {
            const safeText = t.text.replace(/'/g, "\\'").replace(/:/g, "\\:");
            return `drawtext=text='${safeText}':fontcolor=${t.color.replace("#", "0x")}:fontsize=${t.fontSize}:x=(w*${t.x / 100})-(text_w/2):y=(h*${t.y / 100})-(text_h/2):enable='between(t,${t.start},${t.end})'`;
          })
          .join(",");

        await ffmpeg.exec([
          "-i", currentOutput,
          "-vf", drawtextFilters,
          "-c:v", "libx264",
          "-pix_fmt", "yuv420p",
          "with_text.mp4",
        ]);
        currentOutput = "with_text.mp4";
      }

      // Add background music if provided
      if (musicFile) {
        await ffmpeg.writeFile("music.mp3", await fetchFile(musicFile));
        await ffmpeg.exec([
          "-i", currentOutput,
          "-i", "music.mp3",
          "-filter_complex", `[1:a]volume=${musicVolume}[a]`,
          "-map", "0:v",
          "-map", "[a]",
          "-shortest",
          "-c:v", "copy",
          "-c:a", "aac",
          "final_output.mp4",
        ]);
        currentOutput = "final_output.mp4";
      }

      const data = await ffmpeg.readFile(currentOutput);
      const blob = new Blob([data.buffer], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setExportedUrl(url);
    } catch (err) {
      console.error(err);
      setError("Export failed: " + err.message);
    } finally {
      setExporting(false);
    }
  }

  function downloadVideo() {
    if (!exportedUrl) return;
    const link = document.createElement("a");
    link.href = exportedUrl;
    link.download = "karma-video.mp4";
    link.click();
  }

  /* =====================================
      STYLES
  ====================================== */
  const sectionStyle = {
    background: "#1e1e1e",
    borderRadius: "15px",
    padding: "16px",
    marginBottom: "16px",
    color: "#fff",
    fontFamily: "Arial",
  };

  const titleStyle = {
    fontSize: "13px",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "10px",
    fontWeight: "bold",
  };

  const btn = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#333",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    marginRight: "8px",
    marginBottom: "8px",
  };

  const clipCardStyle = (isSelected) => ({
    background: isSelected ? "#FFD700" : "#2a2a2a",
    color: isSelected ? "#111" : "#fff",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "8px",
    cursor: "pointer",
    border: isSelected ? "2px solid #fff" : "1px solid #444",
  });

  return (
    <div style={{ background: "#111", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#ffffff", fontFamily: "Arial", fontSize: "32px", marginBottom: "20px" }}>
        Karma Video Editor
      </h1>

      {error && (
        <div style={{ background: "#b71c1c", color: "#fff", padding: "10px", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {/* IMPORT CONTROLS */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Import Media</div>
        <button style={btn} onClick={() => videoInputRef.current?.click()}>
          🎬 Add Video
        </button>
        <button style={btn} onClick={() => imageInputRef.current?.click()}>
          🖼️ Add Image(s)
        </button>
        <button style={btn} onClick={() => musicInputRef.current?.click()}>
          🎵 {musicFile ? "Change Music" : "Add Background Music"}
        </button>
        {musicFile && (
          <span style={{ fontSize: "12px", color: "#aaa", marginLeft: "8px" }}>
            🎵 {musicFile.name}
          </span>
        )}

        <input ref={videoInputRef} type="file" accept="video/*" multiple hidden onChange={handleVideoUpload} />
        <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
        <input ref={musicInputRef} type="file" accept="audio/*" hidden onChange={handleMusicUpload} />

        {musicFile && (
          <div style={{ marginTop: "10px" }}>
            <label style={{ fontSize: "12px", color: "#aaa" }}>Music Volume: {Math.round(musicVolume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        )}
      </div>

      {/* TIMELINE / CLIPS */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Timeline ({clips.length} clip{clips.length !== 1 ? "s" : ""} • {getTotalDuration().toFixed(1)}s total)</div>

        {clips.length === 0 && (
          <div style={{ color: "#666", fontSize: "13px" }}>No clips yet. Add a video or images above.</div>
        )}

        {clips.map((clip, index) => (
          <div
            key={clip.id}
            style={clipCardStyle(selectedClipId === clip.id)}
            onClick={() => setSelectedClipId(clip.id)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                {clip.type === "video" ? "🎬" : "🖼️"} Clip {index + 1} — {clip.type === "video" ? `${clip.duration.toFixed(1)}s` : `${clip.duration}s (image)`}
              </span>
              <div>
                <button style={{ ...btn, padding: "4px 8px", marginBottom: 0 }} onClick={(e) => { e.stopPropagation(); moveClip(clip.id, "up"); }}>↑</button>
                <button style={{ ...btn, padding: "4px 8px", marginBottom: 0 }} onClick={(e) => { e.stopPropagation(); moveClip(clip.id, "down"); }}>↓</button>
                <button style={{ ...btn, padding: "4px 8px", marginBottom: 0, background: "#b71c1c" }} onClick={(e) => { e.stopPropagation(); removeClip(clip.id); }}>🗑</button>
              </div>
            </div>

            {selectedClipId === clip.id && clip.type === "video" && (
              <div style={{ marginTop: "10px" }}>
                <label style={{ fontSize: "12px" }}>Trim Start: {clip.trimStart.toFixed(1)}s</label>
                <input
                  type="range"
                  min="0"
                  max={clip.duration}
                  step="0.1"
                  value={clip.trimStart}
                  onChange={(e) => updateClipTrim(clip.id, Math.min(parseFloat(e.target.value), clip.trimEnd - 0.1), clip.trimEnd)}
                  style={{ width: "100%" }}
                />
                <label style={{ fontSize: "12px" }}>Trim End: {clip.trimEnd.toFixed(1)}s</label>
                <input
                  type="range"
                  min="0"
                  max={clip.duration}
                  step="0.1"
                  value={clip.trimEnd}
                  onChange={(e) => updateClipTrim(clip.id, clip.trimStart, Math.max(parseFloat(e.target.value), clip.trimStart + 0.1))}
                  style={{ width: "100%" }}
                />
              </div>
            )}

            {selectedClipId === clip.id && clip.type === "image" && (
              <div style={{ marginTop: "10px" }}>
                <label style={{ fontSize: "12px" }}>Duration: {clip.duration}s</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={clip.duration}
                  onChange={(e) => updateImageDuration(clip.id, parseFloat(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* TEXT OVERLAYS */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Text Overlays</div>
        <button style={btn} onClick={addTextOverlay}>➕ Add Text Overlay</button>

        {textOverlays.map((t) => (
          <div key={t.id} style={{ background: "#2a2a2a", borderRadius: "10px", padding: "10px", marginTop: "8px" }}>
            <input
              type="text"
              value={t.text}
              onChange={(e) => updateTextOverlay(t.id, { text: e.target.value })}
              style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #444", background: "#1a1a1a", color: "#fff", marginBottom: "8px" }}
            />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "12px" }}>
              <label>Start: {t.start}s
                <input type="range" min="0" max={getTotalDuration() || 10} step="0.5" value={t.start}
                  onChange={(e) => updateTextOverlay(t.id, { start: parseFloat(e.target.value) })} />
              </label>
              <label>End: {t.end}s
                <input type="range" min="0" max={getTotalDuration() || 10} step="0.5" value={t.end}
                  onChange={(e) => updateTextOverlay(t.id, { end: parseFloat(e.target.value) })} />
              </label>
              <label>Color
                <input type="color" value={t.color} onChange={(e) => updateTextOverlay(t.id, { color: e.target.value })} />
              </label>
              <label>Size
                <input type="number" min="10" max="100" value={t.fontSize}
                  onChange={(e) => updateTextOverlay(t.id, { fontSize: parseInt(e.target.value) })}
                  style={{ width: "50px" }} />
              </label>
              <button style={{ ...btn, background: "#b71c1c", marginBottom: 0 }} onClick={() => removeTextOverlay(t.id)}>🗑 Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* EXPORT */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Export</div>
        <button
          style={{ ...btn, background: "#FFD700", color: "#111", fontWeight: "bold", padding: "12px 24px", fontSize: "15px" }}
          onClick={exportVideo}
          disabled={exporting}
        >
          {exporting ? `Exporting... ${exportProgress}%` : "🎬 Export as MP4"}
        </button>

        {exporting && (
          <div style={{ marginTop: "10px", background: "#333", borderRadius: "8px", height: "10px", overflow: "hidden" }}>
            <div style={{ width: `${exportProgress}%`, background: "#FFD700", height: "100%", transition: "width 0.2s" }} />
          </div>
        )}

        {exportedUrl && (
          <div style={{ marginTop: "16px" }}>
            <video src={exportedUrl} controls style={{ maxWidth: "100%", borderRadius: "10px", marginBottom: "10px" }} />
            <br />
            <button style={{ ...btn, background: "#1e8449" }} onClick={downloadVideo}>
              💾 Download MP4
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoEditor;