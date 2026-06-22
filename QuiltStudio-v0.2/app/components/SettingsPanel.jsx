import React from "react";
import { patternRegistry } from "../patterns/patternRegistry.js";

export function SettingsPanel({ settings, setSettings }) {
  function update(key, value) {
    setSettings((previous) => ({ ...previous, [key]: value }));
  }

  return (
    <section className="panel">
      <h2>2. Quilt settings</h2>

      <label>Pattern</label>
      <select value={settings.patternId} onChange={(event) => update("patternId", event.target.value)}>
        {Object.values(patternRegistry).map((pattern) => (
          <option value={pattern.id} key={pattern.id}>{pattern.name}</option>
        ))}
      </select>

      <div className="twoCol">
        <div>
          <label>Squares across</label>
          <input type="number" min="1" value={settings.columns} onChange={(event) => update("columns", Number(event.target.value))} />
        </div>
        <div>
          <label>Squares down</label>
          <input type="number" min="1" value={settings.rows} onChange={(event) => update("rows", Number(event.target.value))} />
        </div>
      </div>

      <div className="twoCol">
        <div>
          <label>Finished square</label>
          <input type="number" min="1" step="0.25" value={settings.squareSize} onChange={(event) => update("squareSize", Number(event.target.value))} />
        </div>
        <div>
          <label>Border width</label>
          <input type="number" min="0" step="0.25" value={settings.borderWidth} onChange={(event) => update("borderWidth", Number(event.target.value))} />
        </div>
      </div>

      <label>Repeat scale</label>
      <input type="range" min="0.3" max="1.6" step="0.05" value={settings.repeatScale} onChange={(event) => update("repeatScale", Number(event.target.value))} />

      <label>Block variation</label>
      <input type="range" min="0" max="1" step="0.05" value={settings.blockVariation} onChange={(event) => update("blockVariation", Number(event.target.value))} />

      <label>Quilting overlay</label>
      <select value={settings.quilting} onChange={(event) => update("quilting", event.target.value)}>
        <option value="waves">Soft waves</option>
        <option value="diagonal">Diagonal stitch</option>
        <option value="grid">Subtle grid</option>
        <option value="none">None</option>
      </select>

      <label className="checkboxLabel">
        <input type="checkbox" checked={settings.showSeams} onChange={(event) => update("showSeams", event.target.checked)} />
        Show seam grid
      </label>

      <label className="checkboxLabel">
        <input type="checkbox" checked={settings.realisticTexture} onChange={(event) => update("realisticTexture", event.target.checked)} />
        Realistic quilt texture
      </label>
    </section>
  );
}
