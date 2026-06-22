export function exportCanvasPNG(canvas, fileName = "quiltstudio-export.png") {
  if (!canvas) return;

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
