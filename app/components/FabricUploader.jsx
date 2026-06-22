import React from "react";
import { ImagePlus } from "lucide-react";
import { loadFabricFile } from "../fabric/loadFabricFile.js";

const labels = ["Fabric A / Dark", "Fabric B / Medium", "Fabric C / Light"];

export function FabricUploader({ fabrics, setFabrics }) {
  async function handleUpload(index, file) {
    if (!file) return;
    const fabric = await loadFabricFile(file);
    const next = [...fabrics];
    next[index] = fabric;
    setFabrics(next);
  }

  return (
    <section className="panel">
      <h2>1. Fabrics</h2>
      {labels.map((label, index) => (
        <div className="fabricRow" key={label}>
          <div
            className="swatch"
            style={{ backgroundImage: fabrics[index]?.dataUrl ? `url(${fabrics[index].dataUrl})` : "none" }}
          >
            {!fabrics[index] && <ImagePlus size={22} />}
          </div>
          <div>
            <b>{label}</b>
            <span className={fabrics[index]?.repeat?.confidence ? "good" : ""}>
              {fabrics[index]
                ? `Repeat ready • confidence ${Math.round(fabrics[index].repeat.confidence * 100)}%`
                : "Upload a fabric image"}
            </span>
            <input type="file" accept="image/*" onChange={(event) => handleUpload(index, event.target.files[0])} />
          </div>
        </div>
      ))}
    </section>
  );
}
