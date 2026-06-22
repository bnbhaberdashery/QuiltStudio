export function estimateSquareYardage(squareCount, finishedSquareSize, fabricWidth = 40) {
  const cuttingSquareSize = finishedSquareSize + 0.5;
  const squareArea = cuttingSquareSize * cuttingSquareSize * squareCount;
  const squareInchesPerYard = fabricWidth * 36;
  return squareArea / squareInchesPerYard;
}
