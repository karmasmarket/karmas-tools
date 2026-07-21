import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, Textbox, Rect, Circle, Triangle, FabricImage, Group } from "fabric";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import TemplateGallery from "./components/TemplateGallery";

/* =====================================
    FIREBASE INIT (same project as Karmas Market)
    Replace with your actual config values from index.html
====================================== */
const firebaseConfig = {
  apiKey: "AIzaSyADxrvh97PxTqjkeXKoHP0_XK8HRa8AmpA",
  authDomain: "realistic-market-show.firebaseapp.com",
  projectId: "realistic-market-show",
  storageBucket: "realistic-market-show.appspot.com",
  messagingSenderId:  "390618933993",
  appId: "1:390618933993:web:8dc95add0ab530bd171e78",
};

const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const FREE_USES = 5;
const RESET_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const TOOL_NAME = "flyerDesigner";
const TOOL_PRICE = 500; // ₦500 after free uses run out

function FlyerEditor() {
  const canvasRef = useRef(null);
  const historyRef = useRef({ stack: [], index: -1, locked: false });
  const [zoom, setZoom] = useState(1);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [layers, setLayers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const gridLineRefs = useRef([]);

  // ---- User identity (passed from Karmas Market redirect) ----
  const [userEmail, setUserEmail] = useState(null);
  const [usageInfo, setUsageInfo] = useState({ count: 0, lastReset: null });
  const [usageLoading, setUsageLoading] = useState(true);

  /* =====================================
      READ USER EMAIL FROM URL ON LOAD
  ====================================== */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get("userEmail");
    if (emailFromUrl) {
      setUserEmail(decodeURIComponent(emailFromUrl));
    }
  }, []);

  /* =====================================
      LOAD CURRENT USAGE FROM FIRESTORE
  ====================================== */
  useEffect(() => {
    async function loadUsage() {
      if (!userEmail) {
        setUsageLoading(false);
        return;
      }
      try {
        const usageRef = doc(db, "toolUsage", `${userEmail}_${TOOL_NAME}`);
        const usageSnap = await getDoc(usageRef);
        if (usageSnap.exists()) {
          setUsageInfo(usageSnap.data());
        } else {
          setUsageInfo({ count: 0, lastReset: Date.now() });
        }
      } catch (err) {
        console.error("Failed to load tool usage:", err);
      } finally {
        setUsageLoading(false);
      }
    }
    loadUsage();
  }, [userEmail]);

  /* =====================================
      HELPER: check + increment usage, returns true if allowed
  ====================================== */
  const checkAndIncrementUsage = useCallback(async () => {
    if (!userEmail) {
      alert("Please access this tool through Karmas Market so we can track your usage.");
      return false;
    }

    const usageRef = doc(db, "toolUsage", `${userEmail}_${TOOL_NAME}`);
    const usageSnap = await getDoc(usageRef);
    const data = usageSnap.exists() ? usageSnap.data() : { count: 0, lastReset: Date.now() };

    const now = Date.now();
    const timeSinceReset = now - (data.lastReset || now);
    const windowExpired = timeSinceReset >= RESET_WINDOW_MS;

    const currentCount = windowExpired ? 0 : (data.count || 0);

    if (currentCount >= FREE_USES) {
      const msRemaining = RESET_WINDOW_MS - timeSinceReset;
      const hoursLeft = Math.max(1, Math.ceil(msRemaining / (60 * 60 * 1000)));
      alert(
        `You've used your ${FREE_USES} free downloads for Flyer Designer.\n\n` +
        `Pay ₦${TOOL_PRICE} to continue now, or wait ${hoursLeft} more hour(s) for your free uses to reset.`
      );
      return false;
    }

    const newCount = currentCount + 1;
    const newLastReset = windowExpired ? now : (data.lastReset || now);

    await setDoc(usageRef, { count: newCount, lastReset: newLastReset });
    setUsageInfo({ count: newCount, lastReset: newLastReset });

    return true;
  }, [userEmail]);

  /* =====================================
      SAVE HISTORY STATE
  ====================================== */
  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.locked) return;
    const json = JSON.stringify(canvas.toJSON(["id", "locked", "_isGrid"]));
    const { stack, index } = historyRef.current;
    const newStack = stack.slice(0, index + 1);
    newStack.push(json);
    historyRef.current = { stack: newStack, index: newStack.length - 1, locked: false };
  }, []);

  /* =====================================
      REFRESH LAYERS LIST
  ====================================== */
  const refreshLayers = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const objects = canvas.getObjects().filter((o) => !o._isGrid);
    setLayers([...objects].reverse());
    const active = canvas.getActiveObject();
    if (active) {
      if (active.type === "activeselection") {
        setSelectedIds(active.getObjects().map((o) => o.id));
      } else {
        setSelectedIds(active.id ? [active.id] : []);
      }
    } else {
      setSelectedIds([]);
    }
  }, []);
  /* =====================================
      DRAW GRID
  ====================================== */
  const drawGrid = useCallback((canvas, enabled) => {
    gridLineRefs.current.forEach((line) => canvas.remove(line));
    gridLineRefs.current = [];
    if (!enabled) { canvas.requestRenderAll(); return; }
    const gridSize = 40;
    const lines = [];
    for (let x = 0; x <= canvas.width; x += gridSize) {
      const line = new Rect({
        left: x, top: 0, width: 1, height: canvas.height,
        fill: "#cccccc", selectable: false, evented: false, _isGrid: true,
      });
      lines.push(line); canvas.add(line); canvas.sendObjectToBack(line);
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      const line = new Rect({
        left: 0, top: y, width: canvas.width, height: 1,
        fill: "#cccccc", selectable: false, evented: false, _isGrid: true,
      });
      lines.push(line); canvas.add(line); canvas.sendObjectToBack(line);
    }
    gridLineRefs.current = lines;
    canvas.requestRenderAll();
  }, []);

  /* =====================================
      INITIALIZE FABRIC
  ====================================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      const canvas = new Canvas("flyerCanvas", {
        width: 1000, height: 650,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
        selection: true,
      });

      canvas.on("object:added", (e) => {
        if (!e.target.id && !e.target._isGrid) {
          e.target.id = `obj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        }
        refreshLayers();
      });
      canvas.on("object:removed", refreshLayers);
      canvas.on("selection:created", refreshLayers);
      canvas.on("selection:updated", refreshLayers);
      canvas.on("selection:cleared", refreshLayers);
      canvas.on("object:modified", () => { saveHistory(); refreshLayers(); });

      canvasRef.current = canvas;

      /* DEFAULT PLACEHOLDER */
      const title = new Textbox("YOUR BUSINESS HERE", {
        left: 150, top: 60, width: 700, fontSize: 48,
        fill: "#cccccc", fontWeight: "bold", editable: true,
        fontFamily: "Arial", textAlign: "center",
      });
      const subtitle = new Textbox("Tap to edit • Add shapes • Upload your logo", {
        left: 200, top: 160, width: 600, fontSize: 20,
        fill: "#dddddd", fontFamily: "Arial", textAlign: "center", editable: false,
      });
      canvas.add(title);
      canvas.add(subtitle);
      canvas.setActiveObject(title);
      canvas.requestRenderAll();
      saveHistory();

      /* DELETE KEY */
      const deleteSelectedObject = (event) => {
        if (event.key !== "Delete") return;
        const active = canvas.getActiveObject();
        if (!active) return;
        if (active.type === "activeselection") {
          active.getObjects().forEach((obj) => canvas.remove(obj));
          canvas.discardActiveObject();
        } else { canvas.remove(active); }
        canvas.requestRenderAll(); saveHistory();
      };
      window.addEventListener("keydown", deleteSelectedObject);

      return () => {
        window.removeEventListener("keydown", deleteSelectedObject);
        canvas.dispose();
      };
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  /* Snap listener reacts to snapEnabled */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.off("object:moving");
    canvas.on("object:moving", (e) => {
      if (!snapEnabled) return;
      const gridSize = 40;
      const obj = e.target;
      obj.set({
        left: Math.round(obj.left / gridSize) * gridSize,
        top: Math.round(obj.top / gridSize) * gridSize,
      });
    });
  }, [snapEnabled]);
  /* =====================================
      ADD SHAPES / TEXT
  ====================================== */
  function addText() {
    const canvas = canvasRef.current; if (!canvas) return;
    const text = new Textbox("New Text", { left: 180, top: 180, width: 250, fontSize: 30, fill: "#000000", fontFamily: "Arial" });
    canvas.add(text); canvas.setActiveObject(text); canvas.requestRenderAll(); saveHistory();
  }
  function addRectangle() {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = new Rect({ left: 220, top: 250, width: 180, height: 120, fill: "#4CAF50", stroke: "#222", strokeWidth: 2, rx: 12, ry: 12 });
    canvas.add(rect); canvas.setActiveObject(rect); canvas.requestRenderAll(); saveHistory();
  }
  function addCircle() {
    const canvas = canvasRef.current; if (!canvas) return;
    const circle = new Circle({ left: 450, top: 240, radius: 60, fill: "#2196F3", stroke: "#111", strokeWidth: 2 });
    canvas.add(circle); canvas.setActiveObject(circle); canvas.requestRenderAll(); saveHistory();
  }
  function addTriangle() {
    const canvas = canvasRef.current; if (!canvas) return;
    const triangle = new Triangle({ left: 350, top: 280, width: 120, height: 120, fill: "#FF9800", stroke: "#222", strokeWidth: 2 });
    canvas.add(triangle); canvas.setActiveObject(triangle); canvas.requestRenderAll(); saveHistory();
  }
  function uploadImage(event) {
    const canvas = canvasRef.current; if (!canvas) return;
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      FabricImage.fromURL(reader.result).then((img) => {
        img.set({ left: 100, top: 100, scaleX: 0.5, scaleY: 0.5 });
        canvas.add(img); canvas.setActiveObject(img); canvas.requestRenderAll(); saveHistory();
      });
    };
    reader.readAsDataURL(file);
  }
  function changeColor(event) {
    const canvas = canvasRef.current; if (!canvas) return;
    const active = canvas.getActiveObject(); if (!active) return;
    active.set("fill", event.target.value); canvas.requestRenderAll(); saveHistory();
  }
  function changeFont(event) {
    const canvas = canvasRef.current; if (!canvas) return;
    const active = canvas.getActiveObject(); if (!active || active.type !== "textbox") return;
    active.set({ fontFamily: event.target.value }); canvas.requestRenderAll();
  }

  /* =====================================
      DOWNLOAD PNG (now gated by usage limit)
  ====================================== */
  async function downloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const allowed = await checkAndIncrementUsage();
    if (!allowed) return;

    const link = document.createElement("a");
    link.download = "karma-flyer.png";
    link.href = canvas.toDataURL({ format: "png", multiplier: 2 });
    link.click();
  }

  /* =====================================
      UNDO / REDO
  ====================================== */
  function undo() {
    const canvas = canvasRef.current; if (!canvas) return;
    const h = historyRef.current;
    if (h.index <= 0) return;
    historyRef.current.locked = true;
    const newIndex = h.index - 1;
    historyRef.current.index = newIndex;
    canvas.loadFromJSON(JSON.parse(h.stack[newIndex]), () => {
      canvas.requestRenderAll(); historyRef.current.locked = false; refreshLayers();
    });
  }
  function redo() {
    const canvas = canvasRef.current; if (!canvas) return;
    const h = historyRef.current;
    if (h.index >= h.stack.length - 1) return;
    historyRef.current.locked = true;
    const newIndex = h.index + 1;
    historyRef.current.index = newIndex;
    canvas.loadFromJSON(JSON.parse(h.stack[newIndex]), () => {
      canvas.requestRenderAll(); historyRef.current.locked = false; refreshLayers();
    });
  }

  /* =====================================
      DUPLICATE
  ====================================== */
  function duplicateObject() {
    const canvas = canvasRef.current; if (!canvas) return;
    const active = canvas.getActiveObject(); if (!active) return;
    active.clone().then((cloned) => {
      cloned.set({ left: active.left + 20, top: active.top + 20 });
      cloned.id = `obj_${Date.now()}`;
      canvas.add(cloned); canvas.setActiveObject(cloned); canvas.requestRenderAll(); saveHistory();
    });
  }
/* =====================================
      DELETE
  ====================================== */
  function deleteObject() {
    const canvas = canvasRef.current; if (!canvas) return;
    const active = canvas.getActiveObject(); if (!active) return;
    if (active.type === "activeselection") {
      active.getObjects().forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
    } else { canvas.remove(active); }
    canvas.requestRenderAll(); saveHistory();
  }

  /* =====================================
      LOCK / UNLOCK
  ====================================== */
  function toggleLock() {
    const canvas = canvasRef.current; if (!canvas) return;
    const active = canvas.getActiveObject(); if (!active) return;
    const isLocked = active.locked;
    active.set({ locked: !isLocked, selectable: isLocked, evented: isLocked, hasControls: isLocked });
    canvas.requestRenderAll(); refreshLayers();
  }

  /* =====================================
      ALIGN
  ====================================== */
  function alignObjects(direction) {
    const canvas = canvasRef.current; if (!canvas) return;
    const active = canvas.getActiveObject(); if (!active) return;
    const W = canvas.width; const H = canvas.height;
    const objects = active.type === "activeselection" ? active.getObjects() : [active];
    objects.forEach((obj) => {
      const w = obj.getScaledWidth(); const h = obj.getScaledHeight();
      if (direction === "left") obj.set({ left: 0 });
      if (direction === "center") obj.set({ left: (W - w) / 2 });
      if (direction === "right") obj.set({ left: W - w });
      if (direction === "top") obj.set({ top: 0 });
      if (direction === "middle") obj.set({ top: (H - h) / 2 });
      if (direction === "bottom") obj.set({ top: H - h });
      obj.setCoords();
    });
    canvas.requestRenderAll(); saveHistory();
  }

  /* =====================================
      GROUP / UNGROUP
  ====================================== */
  function groupObjects() {
    const canvas = canvasRef.current; if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.type !== "activeselection") return;
    const group = active.toGroup();
    group.id = `group_${Date.now()}`;
    canvas.setActiveObject(group); canvas.requestRenderAll(); saveHistory();
  }
  function ungroupObjects() {
    const canvas = canvasRef.current; if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.type !== "group") return;
    active.toActiveSelection(); canvas.requestRenderAll(); saveHistory();
  }

  /* =====================================
      ZOOM
  ====================================== */
  function zoomIn() {
    const canvas = canvasRef.current; if (!canvas) return;
    const nz = Math.min(zoom + 0.1, 3);
    canvas.setZoom(nz); setZoom(nz);
  }
  function zoomOut() {
    const canvas = canvasRef.current; if (!canvas) return;
    const nz = Math.max(zoom - 0.1, 0.3);
    canvas.setZoom(nz); setZoom(nz);
  }
  function zoomReset() {
    const canvas = canvasRef.current; if (!canvas) return;
    canvas.setZoom(1); setZoom(1);
  }

  /* =====================================
      GRID & SNAP
  ====================================== */
  function toggleGrid() {
    const canvas = canvasRef.current; if (!canvas) return;
    const next = !gridEnabled; setGridEnabled(next); drawGrid(canvas, next);
  }
  function toggleSnap() { setSnapEnabled((prev) => !prev); }

  /* =====================================
      LAYER CONTROLS
  ====================================== */
  function selectFromLayer(obj) {
    const canvas = canvasRef.current; if (!canvas) return;
    canvas.setActiveObject(obj); canvas.requestRenderAll(); setSelectedIds([obj.id]);
  }
  function bringForward() {
    const canvas = canvasRef.current; if (!canvas) return;
    const active = canvas.getActiveObject(); if (!active) return;
    canvas.bringObjectForward(active); canvas.requestRenderAll(); refreshLayers(); saveHistory();
  }
  function sendBackward() {
    const canvas = canvasRef.current; if (!canvas) return;
    const active = canvas.getActiveObject(); if (!active) return;
    canvas.sendObjectBackwards(active); canvas.requestRenderAll(); refreshLayers(); saveHistory();
  }
/* =====================================
      LOAD TEMPLATE
  ====================================== */
  function loadTemplate(template) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const confirmReplace = layers.length > 2
      ? window.confirm("Loading a template will replace your current design. Continue?")
      : true;
    if (!confirmReplace) return;

    const existing = canvas.getObjects().filter((o) => !o._isGrid);
    existing.forEach((o) => canvas.remove(o));

    canvas.backgroundColor = template.background || "#ffffff";

    template.objects.forEach((def) => {
      let obj;
      const common = {
        left: def.left,
        top: def.top,
        fill: def.fill,
        stroke: def.stroke,
        strokeWidth: def.strokeWidth,
        rx: def.rx,
        ry: def.ry,
      };

      if (def.type === "textbox") {
        obj = new Textbox(def.text, {
          ...common,
          width: def.width,
          fontSize: def.fontSize,
          fontWeight: def.fontWeight,
          fontFamily: def.fontFamily || "Arial",
          textAlign: def.textAlign || "left",
          editable: true,
        });
      } else if (def.type === "rect") {
        obj = new Rect({ ...common, width: def.width, height: def.height });
      } else if (def.type === "circle") {
        obj = new Circle({ ...common, radius: def.radius });
      } else if (def.type === "triangle") {
        obj = new Triangle({ ...common, width: def.width, height: def.height });
      }

      if (obj) {
        obj.id = `obj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        canvas.add(obj);
      }
    });

    canvas.requestRenderAll();
    refreshLayers();
    saveHistory();
  }

  const usesRemaining = Math.max(0, FREE_USES - (usageInfo.count || 0));

  return (
    <div style={{ background: "#111", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#ffffff", fontFamily: "Arial", fontSize: "36px", marginBottom: "10px", letterSpacing: "2px" }}>
        Karma Ad Maker
      </h1>

      {/* Usage status banner */}
      <div style={{ textAlign: "center", color: "#ffd700", fontFamily: "Arial", fontSize: "14px", marginBottom: "20px" }}>
        {usageLoading
          ? "Checking your usage..."
          : userEmail
            ? `${usesRemaining} free download${usesRemaining === 1 ? "" : "s"} remaining today • ₦${TOOL_PRICE} after that`
            : "Open this tool from Karmas Market to track your free uses"}
      </div>

      <TemplateGallery onSelectTemplate={loadTemplate} />

      <Toolbar
        addText={addText} addRectangle={addRectangle} addCircle={addCircle}
        addTriangle={addTriangle} uploadImage={uploadImage} changeColor={changeColor}
        changeFont={changeFont} downloadPNG={downloadPNG}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", overflowX: "auto" }}>
          <canvas id="flyerCanvas" style={{ border: "3px solid gold", borderRadius: "15px", display: "block" }} />
        </div>

        <Sidebar
          layers={layers} selectedIds={selectedIds}
          zoom={zoom} gridEnabled={gridEnabled} snapEnabled={snapEnabled}
          onSelectLayer={selectFromLayer}
          onUndo={undo} onRedo={redo}
          onDuplicate={duplicateObject} onDelete={deleteObject}
          onToggleLock={toggleLock} onAlign={alignObjects}
          onGroup={groupObjects} onUngroup={ungroupObjects}
          onZoomIn={zoomIn} onZoomOut={zoomOut} onZoomReset={zoomReset}
          onToggleGrid={toggleGrid} onToggleSnap={toggleSnap}
          onBringForward={bringForward} onSendBackward={sendBackward}
        />
      </div>
    </div>
  );
}

export default FlyerEditor;