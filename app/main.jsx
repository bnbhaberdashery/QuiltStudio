import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Download, RotateCcw, Sparkles } from "lucide-react";
import "./styles.css";
import { FabricUploader } from "./components/FabricUploader.jsx";
import { SettingsPanel } from "./components/SettingsPanel.jsx";
import { StatsPanel } from "./components/StatsPanel.jsx";
import { RepeatPreview } from "./components/RepeatPreview.jsx";
import { renderQuilt } from "./renderer/quiltRenderer.js";
import { exportCanvasPNG } from "./export/exportCanvasPNG.js";
import { getPatternStats } from "./patterns/patternRegistry.js";

const defaultSettings = {
  patternId: "gingham",
  columns: 10,
  rows: 15,
  squareSize: 5,
  borderWidth: 1,
  showSeams: true,
  realisticTexture: true,
  repeatScale: 0.72,
  blockVariation: 0.34,
  quilting: "waves",
  renderQuality: "high"
};

function App() {
  const canvasRef = useRef(null);
  const [fabrics, setFabrics] = useState([null, null, null]);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    renderQuilt(canvasRef.current, fabrics, settings);
  }, [fabrics, settings]);

  const stats = useMemo(
    () => getPatternStats(settings.patternId, settings.columns, settings.rows),
    [settings.patternId, settings.columns, settings.rows]
  );

  return (
    <div className="appShell">
      <aside className="sideNav">
        <div className="brandSeal">BNB</div>
        <div className="sideLabel">QuiltStudio</div>
        <div className="version">v0.2</div>
      </aside>

      <main className="main">
        <header className="topBar">
          <div>
            <h1>BNB QuiltStudio</h1>
            <p>Version 0.2: fabric repeat analysis, natural tiling, varied block offsets, and improved realistic quilt rendering.</p>
          </div>
          <button onClick={() => exportCanvasPNG(canvasRef.current, "bnb-quiltstudio-v02.png")}>
            <Download size={17} /> Export PNG
          </button>
        </header>

        <section className="workspace">
          <section className="controlStack">
            <FabricUploader fabrics={fabrics} setFabrics={setFabrics} />
            <SettingsPanel settings={settings} setSettings={setSettings} />
            <StatsPanel settings={settings} stats={stats} />
            <RepeatPreview fabrics={fabrics} settings={settings} />
          </section>

          <section className="previewPanel">
            <div className="previewHeader">
              <div>
                <h2>Quilt preview</h2>
                <p><Sparkles size={14}/> Repeat tiles are analyzed from each upload and drawn as natural fabric repeats.</p>
              </div>
              <button className="secondary" onClick={() => renderQuilt(canvasRef.current, fabrics, settings)}>
                <RotateCcw size={16} /> Redraw
              </button>
            </div>
            <canvas ref={canvasRef} width="1400" height="1600" />
            <div className="note">
              <b>Repeat detection v0.2</b>
              <span>Finds a likely repeat crop, builds a softened mirror-edge tile, and offsets the repeat from block to block so the quilt reads more like cut fabric than stretched photos.</span>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
