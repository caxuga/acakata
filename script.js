const words = ["BUKU", "PENA", "MEJA", "KURSI", "SEKOLAH", "GURU", "MURID", "PINTU", "JENDELA", "BOLA"];
const gridSize = 12;
let grid = [];
let selectedCells = [];
let score = 0;
let time = 0;

document.getElementById("playerName").textContent = prompt("Masukkan nama kamu:") || "Anonim";

function initGame() {
  grid = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => randomLetter())
  );

  placeWords();
  renderGrid();
  renderWordList();

  setInterval(() => {
    time++;
    document.getElementById("time").textContent = time;
  }, 1000);
}

function randomLetter() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function placeWords() {
  words.forEach(word => {
    let placed = false;
    while (!placed) {
      let row = Math.floor(Math.random() * gridSize);
      let col = Math.floor(Math.random() * gridSize);
      let dir = Math.random() > 0.5 ? "H" : "V";

      if (canPlace(word, row, col, dir)) {
        for (let i = 0; i < word.length; i++) {
          if (dir === "H") grid[row][col + i] = word[i];
          else grid[row + i][col] = word[i];
        }
        placed = true;
      }
    }
  });
}

function canPlace(word, row, col, dir) {
  if (dir === "H" && col + word.length > gridSize) return false;
  if (dir === "V" && row + word.length > gridSize) return false;

  for (let i = 0; i < word.length; i++) {
    if (dir === "H" && grid[row][col + i] !== word[i] && grid[row][col + i] !== randomLetter()) return false;
    if (dir === "V" && grid[row + i][col] !== word[i] && grid[row + i][col] !== randomLetter()) return false;
  }
  return true;
}

function renderGrid() {
  const gridDiv = document.getElementById("grid");
  gridDiv.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gridDiv.innerHTML = "";

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = grid[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", () => selectCell(cell));
      gridDiv.appendChild(cell);
    }
  }
}

function renderWordList() {
  const wordListDiv = document.getElementById("wordList");
  wordListDiv.innerHTML = "";
  words.forEach(w => {
    const span = document.createElement("span");
    span.textContent = w;
    span.id = "word-" + w;
    wordListDiv.appendChild(span);
  });
}

function selectCell(cell) {
  cell.classList.add("selected");
  selectedCells.push(cell);

  if (selectedCells.length > 1) {
    let word = selectedCells.map(c => c.textContent).join("");
    checkWord(word);
    selectedCells = [];
    document.querySelectorAll(".cell.selected").forEach(c => c.classList.remove("selected"));
  }
}

function checkWord(word) {
  if (words.includes(word)) {
    score += 10;
    document.getElementById("score").textContent = score;

    selectedCells.forEach(c => c.classList.add("found"));

    const wordSpan = document.getElementById("word-" + word);
    if (wordSpan) wordSpan.classList.add("found");
  }
}

initGame();
