import React, { useEffect, useRef } from "react";
import { createRepeatTile } from "../fabric/createRepeatTile.js";

export function RepeatPreview({ fabrics, settings }) {
  const refs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    fabrics.forEach((fabric, index) => {
      const canvas = refs[index].current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      canvas.width = 180;
      canvas.height = 180;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!fabric) {
        ctx.fillStyle = "#eee";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }
      const tile = createRepeatTile(fabric, 180, settings.repeatScale);
      const pattern = ctx.createPattern(tile, "repeat");
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  }, [fabrics, settings.repeatScale]);

  return (
    <section className="panel">
      <h2>4. Repeat preview</h2>
      <div className="repeatGrid">
        {refs.map((ref, index) => (
          <div key={index}>
            <canvas ref={ref} />
            <small>{fabrics[index]?.repeat ? `${fabrics[index].repeat.cropSize}px crop` : "No fabric"}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
