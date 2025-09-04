const words = ["BUKU", "PENA", "MEJA", "KURSI", "SEKOLAH", "GURU", "MURID", "PINTU", "JENDELA", "BOLA"];
let gridSize = 15;
let grid = [];
let playerName = "";
let score = 0;
let timeLeft = 120;
let timerInterval;
let selectedCells = [];
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// -------- START GAME ----------
function startGame() {
  playerName = document.getElementById("playerName").value || "Player";
  document.getElementById("displayName").innerText = playerName;
  score = 0;
  document.getElementById("score").innerText = score;
  timeLeft = 120;
  document.getElementById("timer").innerText = timeLeft;

  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  generateGrid();
  displayWordList();

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// -------- END GAME ----------
function endGame() {
  clearInterval(timerInterval);
  leaderboard.push({ name: playerName, score, time: 120 - timeLeft });
  leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
  leaderboard = leaderboard.slice(0, 10);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");

  renderLeaderboard();
}

function renderLeaderboard() {
  const lb = document.getElementById("leaderboard");
  lb.innerHTML = "";
  leaderboard.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = `${i+1}. ${p.name} - Skor: ${p.score}, Waktu: ${p.time} detik`;
    lb.appendChild(li);
  });
}

// -------- GRID GENERATOR ----------
function generateGrid() {
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
  words.forEach(word => placeWord(word));
  fillRandomLetters();
  drawGrid();
}

function placeWord(word) {
  let placed = false;
  while (!placed) {
    let row = Math.floor(Math.random() * gridSize);
    let col = Math.floor(Math.random() * gridSize);
    let dir = Math.random() > 0.5 ? "H" : "V";

    if (dir === "H" && col + word.length <= gridSize) {
      if (word.split("").every((ch, i) => grid[row][col+i] === "" || grid[row][col+i] === ch)) {
        word.split("").forEach((ch, i) => grid[row][col+i] = ch);
        placed = true;
      }
    } else if (dir === "V" && row + word.length <= gridSize) {
      if (word.split("").every((ch, i) => grid[row+i][col] === "" || grid[row+i][col] === ch)) {
        word.split("").forEach((ch, i) => grid[row+i][col] = ch);
        placed = true;
      }
    }
  }
}

function fillRandomLetters() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }
}

function drawGrid() {
  const gridDiv = document.getElementById("grid");
  gridDiv.innerHTML = "";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.innerText = grid[r][c];
      cell.addEventListener("click", () => selectCell(cell));
      gridDiv.appendChild(cell);
    }
  }
}

function displayWordList() {
  const wordDiv = document.getElementById("word-list");
  wordDiv.innerHTML = "";
  words.forEach(w => {
    const span = document.createElement("span");
    span.className = "word";
    span.id = `word-${w}`;
    span.textContent = w;
    wordDiv.appendChild(span);
  });
}

// -------- SELECTION ----------
function selectCell(cell) {
  cell.classList.toggle("selected");
  selectedCells.push(cell);

  if (selectedCells.length > 1) {
    let word = selectedCells.map(c => c.innerText).join("");
    let reversed = word.split("").reverse().join("");

    if (words.includes(word) || words.includes(reversed)) {
      selectedCells.forEach(c => {
        c.classList.remove("selected");
        c.classList.add("found");
      });
      document.getElementById(`word-${word}`) ? document.getElementById(`word-${word}`).classList.add("found") : 
      document.getElementById(`word-${reversed}`).classList.add("found");
      score += 10;
      document.getElementById("score").innerText = score;
    }
    selectedCells = [];
  }
}

renderLeaderboard();
