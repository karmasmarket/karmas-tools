function Toolbar({
  addText,
  addRectangle,
  addCircle,
  addTriangle,
  uploadImage,
  downloadPNG,
  changeColor,
  changeFont,
}) {
  const btnStyle = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#333",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "Arial",
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        alignItems: "center",
        background: "#222",
        padding: "15px",
        borderRadius: "15px",
        marginBottom: "20px",
      }}
    >
      <button style={btnStyle} onClick={addText}>
        ➕ Add Text
      </button>

      <button style={btnStyle} onClick={addRectangle}>
        ▭ Rectangle
      </button>

      <button style={btnStyle} onClick={addCircle}>
        ◯ Circle
      </button>

      <button style={btnStyle} onClick={addTriangle}>
        △ Triangle
      </button>

      <label
        style={{
          ...btnStyle,
          display: "inline-block",
          cursor: "pointer",
        }}
      >
        📷 Upload
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={uploadImage}
        />
      </label>

      <input
        type="color"
        onChange={changeColor}
        title="Change fill color of selected object"
        style={{
          width: "40px",
          height: "36px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          background: "none",
        }}
      />

      <select
        onChange={changeFont}
        style={{
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid #444",
          background: "#333",
          color: "#fff",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        <option>Arial</option>
        <option>Verdana</option>
        <option>Georgia</option>
        <option>Tahoma</option>
        <option>Courier New</option>
      </select>

      <button style={btnStyle} onClick={downloadPNG}>
        💾 Download PNG
      </button>
    </div>
  );
}

export default Toolbar;