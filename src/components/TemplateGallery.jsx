import TEMPLATES from "../templates";

function TemplateGallery({ onSelectTemplate }) {
  const containerStyle = {
    width: "100%",
    background: "#1e1e1e",
    borderRadius: "15px",
    padding: "14px",
    marginBottom: "20px",
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

  const gridStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  };

  const cardStyle = (bg) => ({
    width: "140px",
    height: "90px",
    borderRadius: "10px",
    background: bg,
    border: "1px solid #444",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "8px",
    position: "relative",
    overflow: "hidden",
  });

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#fff",
    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
  };

  const categoryTag = {
    position: "absolute",
    top: "6px",
    left: "6px",
    fontSize: "10px",
    background: "rgba(0,0,0,0.5)",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: "4px",
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Flyer Templates ({TEMPLATES.length})</div>
      <div style={gridStyle}>
        {TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            style={cardStyle(tpl.background)}
            onClick={() => onSelectTemplate(tpl)}
            title={`Load ${tpl.name}`}
          >
            <span style={categoryTag}>{tpl.category}</span>
            <span style={labelStyle}>{tpl.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateGallery;