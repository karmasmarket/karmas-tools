function Sidebar({
  layers, selectedIds, zoom, gridEnabled, snapEnabled,
  onSelectLayer, onUndo, onRedo, onDuplicate, onDelete,
  onToggleLock, onAlign, onGroup, onUngroup,
  onZoomIn, onZoomOut, onZoomReset,
  onToggleGrid, onToggleSnap,
  onBringForward, onSendBackward,
}) {

  const sidebarStyle = {
    width: "100%",
    background: "#1e1e1e",
    borderRadius: "15px",
    padding: "14px",
    color: "#fff",
    fontFamily: "Arial",
    fontSize: "13px",
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    maxHeight: "none",
  };

  const sectionStyle = {
    background: "#2a2a2a",
    borderRadius: "10px",
    padding: "10px",
    minWidth: "180px",
    flex: "1 1 180px",
  };

  const sectionTitle = {
    fontSize: "11px",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "8px",
    fontWeight: "bold",
  };

  const btnRow = {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  };

  const btn = (active) => ({
    padding: "5px 9px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: active ? "#FFD700" : "#333",
    color: active ? "#111" : "#fff",
    cursor: "pointer",
    fontSize: "12px",
  });

  const getLabel = (obj) => {
    if (!obj) return "Object";
    if (obj.type === "textbox") return `✏️ ${(obj.text || "Text").slice(0, 15)}`;
    if (obj.type === "rect") return "▭ Rectangle";
    if (obj.type === "circle") return "◯ Circle";
    if (obj.type === "triangle") return "△ Triangle";
    if (obj.type === "group") return "📦 Group";
    if (obj.type === "image") return "🖼️ Image";
    return "🔷 Object";
  };

  return (
    <div style={sidebarStyle}>

      {/* UNDO / REDO */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>History</div>
        <div style={btnRow}>
          <button style={btn(false)} onClick={onUndo}>↩ Undo</button>
          <button style={btn(false)} onClick={onRedo}>↪ Redo</button>
        </div>
      </div>

      {/* OBJECT ACTIONS */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Object</div>
        <div style={btnRow}>
          <button style={btn(false)} onClick={onDuplicate}>⧉ Duplicate</button>
          <button style={{ ...btn(false), background: "#b71c1c" }} onClick={onDelete}>🗑 Delete</button>
          <button style={btn(false)} onClick={onToggleLock}>🔒 Lock/Unlock</button>
          <button style={btn(false)} onClick={onBringForward}>⬆ Forward</button>
          <button style={btn(false)} onClick={onSendBackward}>⬇ Backward</button>
        </div>
      </div>

      {/* GROUP */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Group</div>
        <div style={btnRow}>
          <button style={btn(false)} onClick={onGroup}>📦 Group</button>
          <button style={btn(false)} onClick={onUngroup}>📂 Ungroup</button>
        </div>
      </div>

      {/* ALIGN */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Align</div>
        <div style={btnRow}>
          <button style={btn(false)} title="Align Left" onClick={() => onAlign("left")}>⬛◻◻</button>
          <button style={btn(false)} title="Align Center H" onClick={() => onAlign("center")}>◻⬛◻</button>
          <button style={btn(false)} title="Align Right" onClick={() => onAlign("right")}>◻◻⬛</button>
          <button style={btn(false)} title="Align Top" onClick={() => onAlign("top")}>⬛↑</button>
          <button style={btn(false)} title="Align Middle V" onClick={() => onAlign("middle")}>⬛↕</button>
          <button style={btn(false)} title="Align Bottom" onClick={() => onAlign("bottom")}>⬛↓</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
          {["left","center","right","top","middle","bottom"].map((d) => (
            <button key={d} style={{ ...btn(false), fontSize: "11px" }} onClick={() => onAlign(d)}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ZOOM */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Zoom — {Math.round(zoom * 100)}%</div>
        <div style={btnRow}>
          <button style={btn(false)} onClick={onZoomOut}>− Out</button>
          <button style={btn(false)} onClick={onZoomReset}>↺ Reset</button>
          <button style={btn(false)} onClick={onZoomIn}>+ In</button>
        </div>
      </div>

      {/* GRID & SNAP */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Grid & Snap</div>
        <div style={btnRow}>
          <button style={btn(gridEnabled)} onClick={onToggleGrid}>
            {gridEnabled ? "✅ Grid On" : "⬜ Grid Off"}
          </button>
          <button style={btn(snapEnabled)} onClick={onToggleSnap}>
            {snapEnabled ? "🧲 Snap On" : "🔓 Snap Off"}
          </button>
        </div>
      </div>

      {/* LAYERS PANEL */}
      <div style={{ ...sectionStyle, flex: "1 1 280px", maxHeight: "220px", overflowY: "auto" }}>
        <div style={sectionTitle}>Layers ({layers.length})</div>
        {layers.length === 0 && (
          <div style={{ color: "#666", fontSize: "12px" }}>No objects yet</div>
        )}
        {layers.map((obj, i) => {
          const isSelected = selectedIds.includes(obj.id);
          return (
            <div
              key={obj.id || i}
              onClick={() => onSelectLayer(obj)}
              style={{
                padding: "6px 8px",
                borderRadius: "6px",
                marginBottom: "4px",
                background: isSelected ? "#FFD700" : "#333",
                color: isSelected ? "#111" : "#fff",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: isSelected ? "1px solid #FFF" : "1px solid #444",
              }}
            >
              <span>{getLabel(obj)}</span>
              {obj.locked && <span style={{ fontSize: "10px" }}>🔒</span>}
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Sidebar;