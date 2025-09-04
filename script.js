body {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #74ebd5, #ACB6E5);
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  max-width: 700px;
  width: 95%;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

.info {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
  font-size: 14px;
}

#wordList {
  margin: 15px 0;
  font-weight: bold;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

#wordList span {
  padding: 5px 10px;
  background: #f1f1f1;
  border-radius: 8px;
  transition: 0.3s;
}

#wordList span.found {
  text-decoration: line-through;
  color: gray;
  background: #d1ffd1;
}

#grid {
  display: grid;
  gap: 3px;
  justify-content: center;
}

.cell {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
  border-radius: 6px;
  background: #ffffff;
}

.cell:hover {
  background: #ffeaa7;
}

.cell.selected {
  background: #74b9ff;
  color: white;
}

.cell.found {
  background: #55efc4 !important;
  color: white;
}

@media (max-width: 600px) {
  .cell {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
}
