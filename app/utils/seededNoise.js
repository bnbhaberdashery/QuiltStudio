export function seededNoise(row, column, salt = 1) {
  const x = Math.sin(row * 127.1 + column * 311.7 + salt * 74.7) * 43758.5453123;
  return x - Math.floor(x);
}
