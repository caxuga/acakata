const words = ["BUKU", "PENA", "MEJA", "KURSI", "SEKOLAH", "GURU", "MURID", "PINTU", "JENDELA", "BOLA"];
const gridSize = 12;
let grid = [];
let selectedCells = [];
let score = 0;
let time = 0;
let timerInterval;
let playerName = "";

function startGame() {
  const input = document.getElementById("nameInput").value.trim();
  if (!input) return alert("Masukkan nama dulu!");

  playerName = input;
  document.getElementById("playerName").textContent = playerName;

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";

  initGame();
}

function initGame() {
  grid = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => randomLetter())
  );

  placeWords();
  renderGrid();
  renderWordList();

  score = 0;
  time = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = time;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
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
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;
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

    // cek apakah semua kata sudah ketemu
    if (document.querySelectorAll("#wordList span:not(.found)").length === 0) {
      clearInterval(timerInterval);
      saveToLeaderboard();
    }
  }
}

function saveToLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: playerName, score, time });
  
  // urutkan berdasarkan skor tertinggi, lalu waktu tercepat
  leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
  leaderboard = leaderboard.slice(0, 5); // top 5

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";

  leaderboard.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = `${p.name} - Skor: ${p.score}, Waktu: ${p.time}s`;
    list.appendChild(li);
  });
}

renderLeaderboard();
