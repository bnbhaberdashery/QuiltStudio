import React from "react";
import { estimateSquareYardage } from "../yardage/yardageCalculator.js";

export function StatsPanel({ settings, stats }) {
  const finishedWidth = settings.columns * settings.squareSize + settings.borderWidth * 2;
  const finishedHeight = settings.rows * settings.squareSize + settings.borderWidth * 2;

  return (
    <section className="panel">
      <h2>3. Project stats</h2>
      <div className="statsGrid">
        <span>Finished size</span><b>{finishedWidth}" × {finishedHeight}"</b>
        <span>Total squares</span><b>{settings.columns * settings.rows}</b>
        <span>Fabric A</span><b>{stats.fabricCounts[0]} sq • {estimateSquareYardage(stats.fabricCounts[0], settings.squareSize).toFixed(2)} yd</b>
        <span>Fabric B</span><b>{stats.fabricCounts[1]} sq • {estimateSquareYardage(stats.fabricCounts[1], settings.squareSize).toFixed(2)} yd</b>
        <span>Fabric C</span><b>{stats.fabricCounts[2]} sq • {estimateSquareYardage(stats.fabricCounts[2], settings.squareSize).toFixed(2)} yd</b>
      </div>
    </section>
  );
}
