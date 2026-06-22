export function createRepeatTile(fabric, tileSize = 280, repeatScale = 0.72) {
  if (!fabric?.image) return null;

  const image = fabric.image;
  const repeat = fabric.repeat || {
    cropSize: Math.min(image.width, image.height),
    x: Math.max(0, (image.width - Math.min(image.width, image.height)) / 2),
    y: Math.max(0, (image.height - Math.min(image.width, image.height)) / 2)
  };

  const canvas = document.createElement("canvas");
  canvas.width = tileSize;
  canvas.height = tileSize;
  const ctx = canvas.getContext("2d");

  const drawSize = Math.max(24, tileSize * repeatScale);
  const overlap = Math.max(2, drawSize * 0.06);
  const step = drawSize - overlap;

  ctx.clearRect(0, 0, tileSize, tileSize);

  // Draw a 3x3 softened mirror repeat so edges do not feel like hard photo crops.
  for (let row = -1; row <= 2; row += 1) {
    for (let col = -1; col <= 2; col += 1) {
      ctx.save();
      const mirrorX = col % 2 !== 0;
      const mirrorY = row % 2 !== 0;
      const x = col * step;
      const y = row * step;

      ctx.translate(x + (mirrorX ? drawSize : 0), y + (mirrorY ? drawSize : 0));
      ctx.scale(mirrorX ? -1 : 1, mirrorY ? -1 : 1);

      ctx.drawImage(
        image,
        repeat.x,
        repeat.y,
        repeat.cropSize,
        repeat.cropSize,
        0,
        0,
        drawSize,
        drawSize
      );
      ctx.restore();
    }
  }

  softenTile(ctx, tileSize);
  addSubtleWeave(ctx, tileSize);

  return canvas;
}

function softenTile(ctx, tileSize) {
  const gradient = ctx.createRadialGradient(
    tileSize / 2,
    tileSize / 2,
    tileSize * 0.1,
    tileSize / 2,
    tileSize / 2,
    tileSize * 0.72
  );
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(1, "rgba(255,255,255,.06)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, tileSize, tileSize);
}

function addSubtleWeave(ctx, tileSize) {
  ctx.save();
  ctx.globalAlpha = 0.055;
  ctx.strokeStyle = "#ffffff";
  for (let i = 0; i < tileSize; i += 7) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, tileSize);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.035;
  ctx.strokeStyle = "#000000";
  for (let j = 0; j < tileSize; j += 7) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(tileSize, j);
    ctx.stroke();
  }
  ctx.restore();
}
