export function analyzeFabricRepeat(image) {
  // Practical browser-safe v0.2 repeat detection:
  // 1. Work from the centre of the upload.
  // 2. Score several possible crop sizes using edge similarity.
  // 3. Prefer crops whose left/right and top/bottom edges are visually similar.
  // This is intentionally lightweight enough to run on iPad.

  const probe = document.createElement("canvas");
  const size = 128;
  probe.width = size;
  probe.height = size;
  const ctx = probe.getContext("2d", { willReadFrequently: true });

  const sourceSize = Math.min(image.width, image.height);
  const sourceX = Math.max(0, (image.width - sourceSize) / 2);
  const sourceY = Math.max(0, (image.height - sourceSize) / 2);

  ctx.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
  const imageData = ctx.getImageData(0, 0, size, size).data;

  const candidates = [48, 56, 64, 72, 80, 96, 112, 128];
  let best = { cropSize: sourceSize, score: Infinity, confidence: 0.45 };

  for (const candidate of candidates) {
    const score = edgeScore(imageData, size, candidate);
    if (score < best.score) {
      best = {
        cropSize: Math.round(sourceSize * (candidate / size)),
        normalizedCrop: candidate,
        score,
        confidence: confidenceFromScore(score)
      };
    }
  }

  const cropSize = Math.max(80, Math.min(sourceSize, best.cropSize));
  return {
    cropSize,
    x: Math.round(sourceX + (sourceSize - cropSize) / 2),
    y: Math.round(sourceY + (sourceSize - cropSize) / 2),
    confidence: best.confidence,
    score: best.score
  };
}

function edgeScore(data, canvasSize, crop) {
  const start = Math.floor((canvasSize - crop) / 2);
  const end = start + crop - 1;
  let total = 0;
  let samples = 0;

  for (let i = 0; i < crop; i += 4) {
    total += pixelDifference(data, canvasSize, start, start + i, end, start + i);
    total += pixelDifference(data, canvasSize, start + i, start, start + i, end);
    samples += 2;
  }

  return total / Math.max(1, samples);
}

function pixelDifference(data, width, x1, y1, x2, y2) {
  const a = (y1 * width + x1) * 4;
  const b = (y2 * width + x2) * 4;
  return (
    Math.abs(data[a] - data[b]) +
    Math.abs(data[a + 1] - data[b + 1]) +
    Math.abs(data[a + 2] - data[b + 2])
  ) / 3;
}

function confidenceFromScore(score) {
  const normalized = Math.max(0, Math.min(1, 1 - score / 95));
  return 0.42 + normalized * 0.53;
}
