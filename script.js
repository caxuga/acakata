const words = ["BUKU", "PENA", "MEJA", "KURSI", "SEKOLAH", "GURU", "MURID", "PINTU", "JENDELA", "BOLA"];
const gridSize = 15;

let grid = [];
let foundWords = [];
let score = 0;
let timer = 0;
let timerInterval;
let playerName = "";

let currentSelection = [];
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// --------- Leaderboard ---------
function renderLeaderboard() {
  const leaderboardList = document.getElementById("leaderboard");
  leaderboardList.innerHTML = "";
  leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
  leaderboard.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${p.name} - Skor: ${p.score}, Waktu: ${p.time} detik`;
    leaderboardList.appendChild(li);
  });
}

function startGame(name) {
  playerName = name;
  foundWords = [];
  score = 0;
  timer = 0;
  currentSelection = [];
  document.getElementById("displayName").textContent = name;
  document.getElementById("score").textContent = score;

  generateGrid();
  renderWordList();

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = timer;
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  leaderboard.push({ name: playerName, score: score, time: timer });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();

  document.getElementById("game-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
}

document.getElementById("start-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("playerName").value.trim();
  if (name) startGame(name);
});

// --------- Grid ---------
function generateGrid() {
  grid = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
  );
  placeWords();
  renderGrid();
}

function placeWords() {
  words.forEach(word => {
    let placed = false;
    while (!placed) {
      let row = Math.floor(Math.random() * gridSize);
      let col = Math.floor(Math.random() * gridSize);
      let dir = Math.random() < 0.5 ? "H" : "V";

      if (dir === "H" && col + word.length <= gridSize) {
        for (let i = 0; i < word.length; i++) grid[row][col + i] = word[i];
        placed = true;
      } else if (dir === "V" && row + word.length <= gridSize) {
        for (let i = 0; i < word.length; i++) grid[row + i][col] = word[i];
        placed = true;
      }
    }
  });
}

function renderGrid() {
  const puzzle = document.getElementById("puzzle");
  puzzle.innerHTML = "";

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement("div");
      cell.textContent = grid[r][c];
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener("click", () => toggleSelect(cell));
      puzzle.appendChild(cell);
    }
  }
}

function renderWordList() {
  const list = document.getElementById("word-list");
  list.innerHTML = "";
  words.forEach(word => {
    const btn = document.createElement("button");
    btn.textContent = word;
    btn.id = "word-" + word;
    list.appendChild(btn);
  });
}

// --------- Word Selection ---------
function toggleSelect(cell) {
  if (cell.classList.contains("found")) return;

  if (cell.classList.contains("selected")) {
    cell.classList.remove("selected");
    currentSelection = currentSelection.filter(c => c !== cell);
  } else {
    cell.classList.add("selected");
    currentSelection.push(cell);
  }

  checkSelection();
}

function checkSelection() {
  let selectedWord = currentSelection.map(c => c.textContent).join("");
  let reversedWord = selectedWord.split("").reverse().join("");

  if (words.includes(selectedWord) || words.includes(reversedWord)) {
    let word = words.includes(selectedWord) ? selectedWord : reversedWord;

    if (!foundWords.includes(word)) {
      foundWords.push(word);
      score += 10;
      document.getElementById("score").textContent = score;

      currentSelection.forEach(c => {
        c.classList.remove("selected");
        c.classList.add("found");
      });
      currentSelection = [];

      let btn = document.getElementById("word-" + word);
      if (btn) btn.classList.add("found");

      if (foundWords.length === words.length) endGame();
    }
  }
}

renderLeaderboard();
