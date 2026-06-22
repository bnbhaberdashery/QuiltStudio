import { getPattern } from "../patterns/patternRegistry.js";
import { createRepeatTile } from "../fabric/createRepeatTile.js";
import { seededNoise } from "../utils/seededNoise.js";

const fallbackColours = ["#203247", "#7e8fa0", "#f0e3ce"];

export function renderQuilt(canvas, fabrics, settings) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const pattern = getPattern(settings.patternId);

  const cell = settings.renderQuality === "high" ? 64 : 52;
  const padding = 84;
  const titleHeight = 96;
  const legendWidth = 250;
  const gridWidth = settings.columns * cell;
  const gridHeight = settings.rows * cell;

  canvas.width = padding * 2 + gridWidth + legendWidth;
  canvas.height = titleHeight + gridHeight + padding;

  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawTitle(ctx, padding, pattern, settings);

  const x0 = padding;
  const y0 = titleHeight;

  drawBorder(ctx, fabrics[0], x0, y0, gridWidth, gridHeight, settings);

  const tileCache = fabrics.map((fabric) => fabric ? createRepeatTile(fabric, 320, settings.repeatScale) : null);

  for (let row = 0; row < settings.rows; row += 1) {
    for (let column = 0; column < settings.columns; column += 1) {
      const fabricIndex = pattern.cell(row, column);
      const x = x0 + column * cell;
      const y = y0 + row * cell;

      fillSquare(ctx, tileCache[fabricIndex], fabricIndex, x, y, cell, settings, row, column);

      if (settings.showSeams) {
        drawSeam(ctx, x, y, cell);
      }
    }
  }

  if (settings.realisticTexture) {
    addQuiltDimension(ctx, x0, y0, gridWidth, gridHeight, settings);
  }

  ctx.strokeStyle = "#203247";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x0, y0, gridWidth, gridHeight);

  drawLegend(ctx, fabrics, tileCache, x0 + gridWidth + 42, y0, settings);
}

function drawTitle(ctx, padding, pattern, settings) {
  ctx.fillStyle = "#203247";
  ctx.font = "700 31px Georgia";
  ctx.fillText("BNB QuiltStudio", padding, 42);
  ctx.font = "15px Arial";
  ctx.fillText(`${pattern.name} • ${settings.columns} × ${settings.rows} • ${settings.squareSize}" finished squares`, padding, 70);
}

function drawBorder(ctx, fabric, x, y, width, height, settings) {
  if (settings.borderWidth <= 0) return;
  const borderPx = Math.max(8, settings.borderWidth * 10);
  const tile = fabric ? createRepeatTile(fabric, 320, settings.repeatScale) : null;
  fillArea(ctx, tile, 0, x - borderPx, y - borderPx, width + borderPx * 2, height + borderPx * 2, settings, 0, 0);
  ctx.strokeStyle = "rgba(32,50,71,.36)";
  ctx.strokeRect(x - borderPx, y - borderPx, width + borderPx * 2, height + borderPx * 2);
}

function fillSquare(ctx, tile, fabricIndex, x, y, cell, settings, row, column) {
  fillArea(ctx, tile, fabricIndex, x, y, cell, cell, settings, row, column);

  if (settings.realisticTexture) {
    addBlockTexture(ctx, x, y, cell, row, column);
  }
}

function fillArea(ctx, tile, fabricIndex, x, y, width, height, settings, row, column) {
  if (!tile) {
    ctx.fillStyle = fallbackColours[fabricIndex];
    ctx.fillRect(x, y, width, height);
    return;
  }

  const pattern = ctx.createPattern(tile, "repeat");
  const variation = settings.blockVariation || 0;
  const offsetX = seededNoise(row, column, 11) * tile.width * variation;
  const offsetY = seededNoise(row, column, 29) * tile.height * variation;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.translate(x - offsetX, y - offsetY);
  ctx.fillStyle = pattern;
  ctx.fillRect(offsetX, offsetY, width + tile.width, height + tile.height);
  ctx.restore();
}

function drawSeam(ctx, x, y, cell) {
  ctx.strokeStyle = "rgba(32,50,71,.34)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, cell, cell);

  ctx.strokeStyle = "rgba(255,255,255,.18)";
  ctx.beginPath();
  ctx.moveTo(x + 1, y + 1);
  ctx.lineTo(x + cell - 1, y + 1);
  ctx.stroke();
}

function addBlockTexture(ctx, x, y, cell, row, column) {
  ctx.save();
  ctx.globalAlpha = 0.11;
  ctx.strokeStyle = "white";
  for (let i = 8; i < cell; i += 13) {
    ctx.beginPath();
    ctx.moveTo(x + i, y + 4);
    ctx.lineTo(x + i + Math.sin(row + column) * 2, y + cell - 4);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.075;
  ctx.strokeStyle = "#000";
  for (let j = 8; j < cell; j += 13) {
    ctx.beginPath();
    ctx.moveTo(x + 4, y + j);
    ctx.lineTo(x + cell - 4, y + j + Math.cos(row - column) * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function addQuiltDimension(ctx, x, y, width, height, settings) {
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, "rgba(255,255,255,.20)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0)");
  gradient.addColorStop(1, "rgba(0,0,0,.14)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);

  if (settings.quilting === "waves") drawWaveQuilting(ctx, x, y, width, height);
  if (settings.quilting === "diagonal") drawDiagonalQuilting(ctx, x, y, width, height);
  if (settings.quilting === "grid") drawGridQuilting(ctx, x, y, width, height);
}

function drawWaveQuilting(ctx, x, y, width, height) {
  ctx.save();
  ctx.setLineDash([6, 7]);
  ctx.strokeStyle = "rgba(32,50,71,.18)";
  for (let yy = y + 18; yy < y + height; yy += 32) {
    ctx.beginPath();
    ctx.moveTo(x + 8, yy);
    ctx.bezierCurveTo(x + width * 0.25, yy - 8, x + width * 0.75, yy + 8, x + width - 8, yy);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDiagonalQuilting(ctx, x, y, width, height) {
  ctx.save();
  ctx.setLineDash([5, 8]);
  ctx.strokeStyle = "rgba(32,50,71,.16)";
  for (let i = -height; i < width; i += 34) {
    ctx.beginPath();
    ctx.moveTo(x + i, y + height);
    ctx.lineTo(x + i + height, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawGridQuilting(ctx, x, y, width, height) {
  ctx.save();
  ctx.setLineDash([5, 8]);
  ctx.strokeStyle = "rgba(32,50,71,.13)";
  for (let i = x + 22; i < x + width; i += 44) {
    ctx.beginPath();
    ctx.moveTo(i, y);
    ctx.lineTo(i, y + height);
    ctx.stroke();
  }
  for (let j = y + 22; j < y + height; j += 44) {
    ctx.beginPath();
    ctx.moveTo(x, j);
    ctx.lineTo(x + width, j);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLegend(ctx, fabrics, tileCache, x, y, settings) {
  ctx.fillStyle = "#203247";
  ctx.font = "700 19px Georgia";
  ctx.fillText("Fabric key", x, y + 4);

  ["A / Dark", "B / Medium", "C / Light"].forEach((label, index) => {
    const yy = y + 34 + index * 108;
    fillArea(ctx, tileCache[index], index, x, yy, 78, 78, settings, 0, index);
    ctx.strokeStyle = "rgba(32,50,71,.38)";
    ctx.strokeRect(x, yy, 78, 78);
    ctx.fillStyle = "#203247";
    ctx.font = "13px Arial";
    ctx.fillText(label, x + 92, yy + 35);
    ctx.fillStyle = "#6a7481";
    ctx.fillText(fabrics[index]?.repeat ? `repeat ${fabrics[index].repeat.cropSize}px` : "placeholder", x + 92, yy + 54);
  });

  ctx.fillStyle = "#5f6b7a";
  ctx.font = "13px Arial";
  ctx.fillText("Version 0.2", x, y + 388);
  ctx.fillText("Repeat detection enabled", x, y + 410);
}
