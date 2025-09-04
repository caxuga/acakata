const words = ["BUKU", "PENA", "MEJA", "KURSI", "SEKOLAH",
               "GURU", "MURID", "PINTU", "JENDELA", "BOLA"];

let score = 0;
let timer = 120;
let playerName = "";
let interval;
let gridSize = 10;
let gridData = [];
let selectedCells = [];

function startGame() {
  playerName = document.getElementById("playerName").value.trim();
  if (!playerName) return alert("Masukkan nama dulu!");

  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  document.getElementById("displayName").innerText = playerName;

  score = 0;
  document.getElementById("score").innerText = score;

  generateGrid();
  startTimer();
}

function generateGrid() {
  gridData = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
  placeWords();
  fillRandomLetters();

  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.innerText = gridData[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", () => selectCell(cell));
      grid.appendChild(cell);
    }
  }

  // tampilkan daftar kata
  let wordList = document.getElementById("word-list");
  wordList.innerHTML = "<b>Cari kata:</b><br>" + words.join(", ");
}

function placeWords() {
  const directions = [
    [0, 1],   // kanan
    [1, 0],   // bawah
    [0, -1],  // kiri
    [-1, 0],  // atas
    [1, 1],   // diagonal kanan bawah
    [-1, -1], // diagonal kiri atas
    [1, -1],  // diagonal kiri bawah
    [-1, 1]   // diagonal kiri atas
  ];

  for (let word of words) {
    let placed = false;
    while (!placed) {
      let row = Math.floor(Math.random() * gridSize);
      let col = Math.floor(Math.random() * gridSize);
      let dir = directions[Math.floor(Math.random() * directions.length)];
      if (canPlaceWord(word, row, col, dir)) {
        for (let i = 0; i < word.length; i++) {
          gridData[row + i * dir[0]][col + i * dir[1]] = word[i];
        }
        placed = true;
      }
    }
  }
}

function canPlaceWord(word, row, col, dir) {
  for (let i = 0; i < word.length; i++) {
    let r = row + i * dir[0];
    let c = col + i * dir[1];
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return false;
    if (gridData[r][c] !== "" && gridData[r][c] !== word[i]) return false;
  }
  return true;
}

function fillRandomLetters() {
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (gridData[r][c] === "") {
        gridData[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

function selectCell(cell) {
  if (cell.classList.contains("found")) return;

  if (cell.classList.contains("selected")) {
    cell.classList.remove("selected");
    selectedCells = selectedCells.filter(c => c !== cell);
  } else {
    cell.classList.add("selected");
    selectedCells.push(cell);
  }

  checkWord();
}

function checkWord() {
  let letters = selectedCells.map(c => c.innerText).join("");
  let reversed = letters.split("").reverse().join("");

  if (words.includes(letters) || words.includes(reversed)) {
    // mark as found
    selectedCells.forEach(c => {
      c.classList.remove("selected");
      c.classList.add("found");
    });
    selectedCells = [];

    score += 10;
    document.getElementById("score").innerText = score;
  }
}

function startTimer() {
  timer = 120;
  document.getElementById("timer").innerText = timer;
  interval = setInterval(() => {
    timer--;
    document.getElementById("timer").innerText = timer;
    if (timer <= 0) endGame();
  }, 1000);
}

function endGame() {
  clearInterval(interval);
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("leaderboard-screen").classList.remove("hidden");

  // simpan skor ke localStorage
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  leaderboard.push({ name: playerName, score: score });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  // tampilkan leaderboard
  let board = document.getElementById("leaderboard");
  board.innerHTML = "";
  leaderboard.slice(0, 10).forEach(entry => {
    let li = document.createElement("li");
    li.innerText = `${entry.name} - ${entry.score}`;
    board.appendChild(li);
  });
}

function restart() {
  document.getElementById("leaderboard-screen").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
}
