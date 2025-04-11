let counter = 0;
let selectedQueen = "./img/black-queen.png";
let highlightColor = "#ff0000";
let placedQueens = [];
let allSolutions = [];
let currentSolutionIndex = 0;

document.addEventListener("DOMContentLoaded", function () {
  const cells = document.querySelectorAll("td");
  const queens = {
    "black-queen": "./img/black-queen.png",
    "white-queen": "./img/white-queen.png",
    "cartoon-queen": "./img/cartoon-queen.png",
    "simple-queen": "./img/simple-queen.png",
    "queen-elizabeth": "./img/queen-elizabeth.png",
  };

  const queenButtons = document.querySelectorAll("#queen-picker button");
  queenButtons.forEach((button) => {
    button.addEventListener("click", function () {
      selectedQueen = queens[this.id];
      queenButtons.forEach((btn) => btn.classList.remove("selected"));
      this.classList.add("selected");
      updateQueensOnBoard(selectedQueen);
    });
  });

  const colorInput = document.getElementById("color-input");
  colorInput.addEventListener("input", function () {
    highlightColor = this.value;
    updateColorInfo(highlightColor);
    updateBoard();
  });

  updateColorInfo(highlightColor);
  addListeners();

  function addListeners() {
    cells.forEach((cell) => {
      cell.addEventListener("mouseover", function () {
        const row = cell.parentNode.rowIndex;
        const col = cell.cellIndex;
        highlightAttackPaths(row, col);
      });
      cell.addEventListener("mouseout", () => updateBoard());
    });
  }

  function updateQueensOnBoard(newQueenImage) {
    cells.forEach((cell) => {
      const currentStyle = window.getComputedStyle(cell).backgroundImage;
      if (currentStyle !== "none" && currentStyle !== 'url("none")') {
        cell.style.backgroundImage = `url('${newQueenImage}')`;
      }
    });
  }

  function updateColorInfo(color) {
    document.getElementById("hexValue").textContent = color;
    const rgb = hexToRgb(color);
    document.getElementById(
      "rgbValue"
    ).textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
});

document.getElementById("solve").addEventListener("click", function () {
  const navigation = document.getElementById("solution-navigation");
  navigation.style.display = "flex";
  navigation.style.margin = "0 auto";
  navigation.style.marginTop = "24px";
  navigation.style.width = "fit-content";
  navigation.style.alignItems = "center";
});

document.getElementById("reset").addEventListener("click", function () {
  const navigation = document.getElementById("solution-navigation");
  navigation.style.display = "none";
});

function updateBoardColors() {
  const color1 = document.getElementById("color-1").value;
  const color2 = document.getElementById("color-2").value;
  changeBoardColor(color1, color2);
  updateBoard();
}

function changeBoardColor(color1, color2) {
  const board = document.getElementById("board");
  for (let row = 0; row < board.rows.length; row++) {
    for (let col = 0; col < board.rows[row].cells.length; col++) {
      board.rows[row].cells[col].style.backgroundColor =
        (row + col) % 2 === 0 ? color1 : color2;
    }
  }
}

function showQueen(cell) {
  const currentStyle = window.getComputedStyle(cell).backgroundImage;
  const row = cell.parentNode.rowIndex;
  const col = cell.cellIndex;

  if (currentStyle === "none" || currentStyle === 'url("none")') {
    if (counter >= 8) {
      alert("¡Máximo de reinas alcanzado!");
      return;
    }
    if (isSafe(placedQueens, row, col)) {
      cell.style.backgroundImage = `url('${selectedQueen}')`;
      cell.style.backgroundSize = "contain";
      cell.style.backgroundRepeat = "no-repeat";
      cell.style.backgroundPosition = "center";
      counter++;
      placedQueens.push({ row, col });
      updateBoard();
    } else {
      alert("No puedes colocar una reina aquí");
    }
  } else {
    cell.style.backgroundImage = "none";
    counter--;
    placedQueens = placedQueens.filter((q) => q.row !== row || q.col !== col);
    updateBoard();
  }
}

function isSafe(queens, r, c) {
  return queens.every(
    (q) =>
      q.row !== r && q.col !== c && Math.abs(q.row - r) !== Math.abs(q.col - c)
  );
}

function highlightAttackPaths(r, c) {
  const board = document.getElementById("board");
  const directions = [
    { dr: 1, dc: 0 },
    { dr: 0, dc: 1 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
    { dr: -1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: -1, dc: -1 },
    { dr: -1, dc: 1 },
  ];

  directions.forEach(({ dr, dc }) => {
    let nr = r,
      nc = c;
    while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
      board.rows[nr].cells[nc].style.backgroundColor = highlightColor;
      nr += dr;
      nc += dc;
    }
  });
}

function updateBoard() {
  const color1 = document.getElementById("color-1").value;
  const color2 = document.getElementById("color-2").value;
  const board = document.getElementById("board");

  for (let row = 0; row < board.rows.length; row++) {
    for (let col = 0; col < board.rows[row].cells.length; col++) {
      board.rows[row].cells[col].style.backgroundColor =
        (row + col) % 2 === 0 ? color1 : color2;
    }
  }

  placedQueens.forEach((queen) => {
    highlightAttackPaths(queen.row, queen.col);
  });
}

function cleanQueens() {
  document.querySelectorAll("td").forEach((td) => {
    td.style.backgroundImage = "none";
  });
  counter = 0;
  placedQueens = [];
  updateBoard();
}

function solveQueens() {
  const boardSize = 8;
  allSolutions = [];
  currentSolutionIndex = 0;

  function placeQueens(row, queens) {
    if (row === boardSize) {
      allSolutions.push([...queens]);
      return;
    }

    for (let col = 0; col < boardSize; col++) {
      if (isSafe(queens, row, col)) {
        queens.push({ row, col });
        placeQueens(row + 1, queens);
        queens.pop();
      }
    }
  }

  placeQueens(0, []);

  if (allSolutions.length > 0) {
    displaySolution(allSolutions[currentSolutionIndex]);
    document.getElementById("solution-navigation").style.display = "flex";
  } else {
    alert("No se encontraron soluciones.");
  }
}

function displaySolution(solution) {
  const board = document.getElementById("board");
  cleanQueens();
  solution.forEach(({ row, col }) => {
    board.rows[row].cells[
      col
    ].style.backgroundImage = `url('${selectedQueen}')`;
    board.rows[row].cells[col].style.backgroundSize = "contain";
    board.rows[row].cells[col].style.backgroundRepeat = "no-repeat";
    board.rows[row].cells[col].style.backgroundPosition = "center";
  });
  counter = solution.length;
  placedQueens = [...solution];
  updateBoard();
}

function nextSolution() {
  if (allSolutions.length === 0) {
    alert("Primero resuelve el problema.");
    return;
  }
  currentSolutionIndex = (currentSolutionIndex + 1) % allSolutions.length;
  displaySolution(allSolutions[currentSolutionIndex]);
}

function previousSolution() {
  if (allSolutions.length === 0) {
    alert("Primero resuelve el problema.");
    return;
  }
  currentSolutionIndex =
    (currentSolutionIndex - 1 + allSolutions.length) % allSolutions.length;
  displaySolution(allSolutions[currentSolutionIndex]);
}
