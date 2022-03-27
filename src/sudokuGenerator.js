var _ = require("lodash");

export function getNeighbors(coords, cells) {
  cells = resetCoords(cells);
  var neighbors = new Set([]);
  // Row and column neighbors
  for (var i = 0; i < 9; i++) {
    if (i !== coords[1]) neighbors.add(getCell(coords[0], i, cells));
    if (i !== coords[0]) neighbors.add(getCell(i, coords[1], cells));
  }

  // Same block neighbors
  var iBlockStart = Math.floor(coords[0] / 3) * 3;
  var jBlockStart = Math.floor(coords[1] / 3) * 3;

  for (var j = iBlockStart; j < iBlockStart + 3; j++) {
    for (var k = jBlockStart; k < jBlockStart + 3; k++) {
      if (j !== coords[0] || k !== coords[1])
        neighbors.add(getCell(j, k, cells));
    }
  }
  return Array.from(neighbors);
}

export function getCell(x, y, cells) {
  return cells.filter(function (cell) {
    return cell.coords[0] === x && cell.coords[1] === y;
  })[0];
}

export function fillCells(cells) {
  var remainingCells = cells.slice();
  generateCellValues(remainingCells, cells);
}

export function generateCellValues(remainingCells, cells) {
  var cell = remainingCells.shift();
  var neighbors = getNeighbors(cell.coords, cells);
  var options = _.difference(
    _.range(1, 10),
    neighbors.map((neighbor) => neighbor.value)
  );
  for (var option of _.shuffle(options)) {
    cell.value = option;
    if (remainingCells.length === 0) {
      return true;
    }

    if (generateCellValues(remainingCells, cells)) {
      return true;
    }
  }

  cell.value = "";
  remainingCells.unshift(cell);
  return false;
}

export function elementsToPositions(elements) {
  var cells = [];
  var index;

  for (var t = 0; t < 3; t++) {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        for (var k = 0; k < 3; k++) {
          index = 27 * t + i * 3 + j * 9 + k;
          cells.push(elements[index]);
        }
      }
    }
  }
  return cells;
}

export function resetCoords(cells) {
  var coords = [];
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      coords.push([i, j]);
    }
  }
  cells.forEach((cell) => (cell.coords = coords.shift()));
  return cells;
}

export function initCells() {
  var cells = [];
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      cells.push(new Cell([i, j]));
    }
  }
  return cells;
}

export function generateStartingBoard(n) {
  var cells = initCells();
  fillCells(cells);
  var sudoku = elementsToPositions(cells);
  var board = initCells();
  _.shuffle(_.range(81))
    .slice(81 - n)
    .forEach((i) => {
      sudoku[i].initial = true;
      sudoku[i].classes.add(" initial");
      board[i] = sudoku[i];
    });

  return board;
}

class Cell {
  constructor(
    coords,
    value = "",
    initial = false,
    classes = new Set(["square"])
  ) {
    this.coords = coords;
    this.value = value;
    this.initial = initial;
    this.classes = classes;
  }
}
