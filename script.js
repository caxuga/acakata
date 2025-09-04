const words = ["BUKU", "PENA", "MEJA", "KURSI", "SEKOLAH", "GURU", "MURID", "PINTU", "JENDELA", "BOLA"];
let playerName = "";
let gridSize = 12;
let grid = [];
let selectedCells = [];
let score = 0;
let timeLeft = 120;
let timerInterval;

// 🎵 Efek suara
function playBeep(type = "success") {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  if (type === "start") oscillator.frequency.value = 600;
  if (type === "success") oscillator.frequency.value = 800;
  if (type === "gameover") oscillator.frequency.value = 200;

  gainNode.gain.value = 0.15;
  oscillator.type = "sine";
  oscillator.start();
  oscillator.stop(ctx.currentTime + (type === "gameover" ? 1.0 : 0.2));
}

// 🎉 Konfeti sederhana
function confettiEffect() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let confettis = [];
  for (let i = 0; i < 150; i++) {
    confettis.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 0.5 + 0.5,
      color: `hsl(${Math.random() * 360},100%,50%)`
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettis.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2, false);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
    update();
  }

  function update() {
    confettis.forEach(c => {
      c.y += c.d * 4;
      if (c.y > canvas.height) {
        c.y = -10;
        c.x = Math.random() * canvas.width;
      }
    });
  }

  let interval = setInterval(draw, 20);
  setTimeout(() => {
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 5000);
}

// Start game
function startGame() {
  const nameInput = document.getElementById("playerName").value.trim();
  if (!nameInput) {
    alert("Masukkan nama terlebih dahulu!");
    return;
  }
  playerName = nameInput;
  document.getElementById("displayName").innerText = playerName;

  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  resetGame();
  playBeep("start");
}

function resetGame() {
  score = 0;
  timeLeft = 120;
  document.getElementById("score").innerText = score;
  document.getElementById("timer").innerText = timeLeft;

  generateGrid();
  renderWords();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function generateGrid() {
  grid = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => "")
  );
  words.forEach(word => placeWord(word));
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === "") {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
  renderGrid();
}

function placeWord(word) {
  let placed = false;
  while (!placed) {
    let dir = Math.floor(Math.random() * 2); // 0: horizontal, 1: vertical
    let row = Math.floor(Math.random() * gridSize);
    let col = Math.floor(Math.random() * gridSize);

    if (dir === 0 && col + word.length <= gridSize) {
      if (grid[row].slice(col, col + word.length).every(c => c === "")) {
        for (let k = 0; k < word.length; k++) grid[row][col + k] = word[k];
        placed = true;
      }
    } else if (dir === 1 && row + word.length <= gridSize) {
      if (grid.slice(row, row + word.length).every(r => r[col] === "")) {
        for (let k = 0; k < word.length; k++) grid[row + k][col] = word[k];
        placed = true;
      }
    }
  }
}

function renderGrid() {
  const gridDiv = document.getElementById("grid");
  gridDiv.innerHTML = "";
  selectedCells = [];

  grid.forEach((row, i) => {
    row.forEach((letter, j) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.innerText = letter;
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", () => toggleSelect(cell));
      gridDiv.appendChild(cell);
    });
  });
}

function toggleSelect(cell) {
  if (cell.classList.contains("selected")) {
    cell.classList.remove("selected");
    selectedCells = selectedCells.filter(c => c !== cell);
  } else {
    cell.classList.add("selected");
    selectedCells.push(cell);
  }
  checkWord();
}

function renderWords() {
  const wordListDiv = document.getElementById("word-list");
  wordListDiv.innerHTML = "";
  words.forEach(w => {
    const span = document.createElement("span");
    span.innerText = w;
    span.id = `word-${w}`;
    span.classList.add("word");
    wordListDiv.appendChild(span);
  });
}

function checkWord() {
  let selectedWord = selectedCells.map(c => c.innerText).join("");
  let reversed = selectedCells.map(c => c.innerText).reverse().join("");

  if (words.includes(selectedWord) || words.includes(reversed)) {
    selectedCells.forEach(c => {
      c.classList.remove("selected");
      c.classList.add("found");
    });

    let foundWord = words.includes(selectedWord) ? selectedWord : reversed;
    document.getElementById(`word-${foundWord}`).classList.add("found");

    score += 10;
    document.getElementById("score").innerText = score;

    playBeep("success");
    selectedCells = [];

    if (document.querySelectorAll(".word.found").length === words.length) {
      endGame(true);
    }
  }
}

function endGame(win = false) {
  clearInterval(timerInterval);
  playBeep("gameover");

  saveToLeaderboard(playerName, score, 120 - timeLeft);
  loadLeaderboard();

  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");

  if (win) {
    confettiEffect();
  }
}

function saveToLeaderboard(name, score, time) {
  let board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  board.push({ name, score, time });
  board.sort((a, b) => b.score - a.score || a.time - b.time);
  localStorage.setItem("leaderboard", JSON.stringify(board));
}

function loadLeaderboard() {
  let board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";
  board.slice(0, 10).forEach((entry, i) => {
    const li = document.createElement("li");
    li.innerText = `${i + 1}. ${entry.name} - Skor: ${entry.score}, Waktu: ${entry.time} detik`;
    list.appendChild(li);
  });
}

window.onload = loadLeaderboard;
