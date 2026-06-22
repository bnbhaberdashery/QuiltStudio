export const patternRegistry = {
  gingham: {
    id: "gingham",
    name: "3-Fabric Gingham",
    cell(row, column) {
      if (row % 2 === 0) return column % 2 === 0 ? 0 : 1;
      return column % 2 === 0 ? 1 : 2;
    }
  },
  checkerboard: {
    id: "checkerboard",
    name: "Simple Checkerboard",
    cell(row, column) {
      return (row + column) % 2 === 0 ? 0 : 2;
    }
  },
  ninePatch: {
    id: "ninePatch",
    name: "Nine Patch Repeat",
    cell(row, column) {
      const r = row % 3;
      const c = column % 3;
      if (r === 1 && c === 1) return 0;
      if (r === c || r + c === 2) return 1;
      return 2;
    }
  },
  irishChain: {
    id: "irishChain",
    name: "Simple Irish Chain",
    cell(row, column) {
      if (row % 4 === 1 || column % 4 === 1) return 0;
      return (row + column) % 2 === 0 ? 2 : 1;
    }
  },
  trip: {
    id: "trip",
    name: "Trip Around the World",
    cell(row, column) {
      return (row + column) % 3;
    }
  }
};

export function getPattern(patternId) {
  return patternRegistry[patternId] || patternRegistry.gingham;
}

export function getPatternStats(patternId, columns, rows) {
  const pattern = getPattern(patternId);
  const fabricCounts = [0, 0, 0];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      fabricCounts[pattern.cell(row, column)] += 1;
    }
  }

  return { fabricCounts };
}
