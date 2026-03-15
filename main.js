const COLS = 10;
const ROWS = 20;
const TILE = 24;

const COLORS = {
  I: "#22d3ee",
  O: "#fde047",
  T: "#a855f7",
  S: "#22c55e",
  Z: "#ef4444",
  J: "#3b82f6",
  L: "#f97316",
};

const SHAPES = {
  I: [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
  ],
  O: [
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
  ],
  J: [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  L: [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
};

const pieceTypes = Object.keys(SHAPES);

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomPiece() {
  const type = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
  const rotations = SHAPES[type];
  return {
    type,
    rotationIndex: 0,
    shape: rotations[0],
    x: Math.floor(COLS / 2) - 1,
    y: -2,
  };
}

function rotate(piece) {
  const rotations = SHAPES[piece.type];
  const nextIndex = (piece.rotationIndex + 1) % rotations.length;
  return {
    ...piece,
    rotationIndex: nextIndex,
    shape: rotations[nextIndex],
  };
}

function isValidPosition(board, piece, offsetX = 0, offsetY = 0) {
  const shape = piece.shape;
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;
      const newX = piece.x + x + offsetX;
      const newY = piece.y + y + offsetY;

      if (newX < 0 || newX >= COLS || newY >= ROWS) {
        return false;
      }
      if (newY >= 0 && board[newY][newX]) {
        return false;
      }
    }
  }
  return true;
}

function merge(board, piece) {
  const shape = piece.shape;
  const newBoard = board.map((row) => row.slice());

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;
      const boardX = piece.x + x;
      const boardY = piece.y + y;
      if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
        newBoard[boardY][boardX] = piece.type;
      }
    }
  }
  return newBoard;
}

function clearLines(board) {
  let cleared = 0;
  const newBoard = [];

  for (let y = 0; y < ROWS; y++) {
    if (board[y].every((cell) => cell !== null)) {
      cleared++;
    } else {
      newBoard.push(board[y]);
    }
  }

  while (newBoard.length < ROWS) {
    newBoard.unshift(Array(COLS).fill(null));
  }

  return { board: newBoard, cleared };
}

function drawTile(ctx, x, y, color) {
  ctx.fillStyle = color;
  const px = x * TILE;
  const py = y * TILE;
  const r = 6;

  const grd = ctx.createLinearGradient(px, py, px + TILE, py + TILE);
  grd.addColorStop(0, color);
  grd.addColorStop(1, "#020617");
  ctx.fillStyle = grd;

  const inset = 1;
  const sx = px + inset;
  const sy = py + inset;
  const w = TILE - inset * 2;
  const h = TILE - inset * 2;

  ctx.beginPath();
  ctx.moveTo(sx + r, sy);
  ctx.lineTo(sx + w - r, sy);
  ctx.quadraticCurveTo(sx + w, sy, sx + w, sy + r);
  ctx.lineTo(sx + w, sy + h - r);
  ctx.quadraticCurveTo(sx + w, sy + h, sx + w - r, sy + h);
  ctx.lineTo(sx + r, sy + h);
  ctx.quadraticCurveTo(sx, sy + h, sx, sy + h - r);
  ctx.lineTo(sx, sy + r);
  ctx.quadraticCurveTo(sx, sy, sx + r, sy);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(15,23,42,0.9)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const shine = ctx.createLinearGradient(px, py, px, py + TILE);
  shine.addColorStop(0, "rgba(255,255,255,0.25)");
  shine.addColorStop(0.6, "rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  ctx.beginPath();
  ctx.moveTo(sx + r, sy);
  ctx.lineTo(sx + w - r, sy);
  ctx.quadraticCurveTo(sx + w, sy, sx + w, sy + r);
  ctx.lineTo(sx, sy + r);
  ctx.quadraticCurveTo(sx, sy, sx + r, sy);
  ctx.closePath();
  ctx.fill();
}

function drawBoard(ctx, board, currentPiece) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = board[y][x];
      if (cell) {
        drawTile(ctx, x, y, COLORS[cell]);
      }
    }
  }

  if (currentPiece) {
    const shape = currentPiece.shape;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (!shape[y][x]) continue;
        const boardX = currentPiece.x + x;
        const boardY = currentPiece.y + y;
        if (boardY >= 0) {
          drawTile(ctx, boardX, boardY, COLORS[currentPiece.type]);
        }
      }
    }
  }

  ctx.strokeStyle = "rgba(30,64,175,0.4)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * TILE, 0);
    ctx.lineTo(x * TILE, ROWS * TILE);
    ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * TILE);
    ctx.lineTo(COLS * TILE, y * TILE);
    ctx.stroke();
  }
}

function drawNext(ctx, piece) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (!piece) return;

  const shape = piece.shape;

  let minX = shape[0].length,
    maxX = 0,
    minY = shape.length,
    maxY = 0;
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const pieceWidth = maxX - minX + 1;
  const pieceHeight = maxY - minY + 1;
  const offsetX = Math.floor((ctx.canvas.width / TILE - pieceWidth) / 2);
  const offsetY = Math.floor((ctx.canvas.height / TILE - pieceHeight) / 2);

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;
      const drawX = offsetX + (x - minX);
      const drawY = offsetY + (y - minY);
      drawTile(ctx, drawX, drawY, COLORS[piece.type]);
    }
  }
}

const boardCanvas = document.getElementById("board");
const nextCanvas = document.getElementById("next");
const boardCtx = boardCanvas.getContext("2d");
const nextCtx = nextCanvas.getContext("2d");

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const linesEl = document.getElementById("lines");
const startBtn = document.getElementById("startBtn");
const statusText = document.getElementById("statusText");

let board = createBoard();
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let totalLines = 0;
let dropInterval = 800;
let lastDropTime = 0;
let isRunning = false;
let isGameOver = false;

function handleAction(action) {
  if (action === "pause") {
    if (!isGameOver) {
      togglePause();
    }
    return;
  }

  if (!currentPiece || !isRunning) {
    return;
  }

  switch (action) {
    case "left":
      if (isValidPosition(board, currentPiece, -1, 0)) currentPiece.x -= 1;
      break;
    case "right":
      if (isValidPosition(board, currentPiece, 1, 0)) currentPiece.x += 1;
      break;
    case "down":
      if (isValidPosition(board, currentPiece, 0, 1)) currentPiece.y += 1;
      else lockPiece();
      break;
    case "rotate": {
      const rotated = rotate(currentPiece);
      if (isValidPosition(board, rotated, 0, 0)) {
        currentPiece = rotated;
      } else if (isValidPosition(board, rotated, 1, 0)) {
        currentPiece = { ...rotated, x: rotated.x + 1 };
      } else if (isValidPosition(board, rotated, -1, 0)) {
        currentPiece = { ...rotated, x: rotated.x - 1 };
      }
      break;
    }
    case "drop":
      hardDrop();
      break;
    default:
      break;
  }

  drawBoard(boardCtx, board, currentPiece);
}

function updateStatus(message, mode) {
  statusText.textContent = message;
  statusText.classList.remove("paused", "gameover");
  if (mode === "paused") statusText.classList.add("paused");
  if (mode === "gameover") statusText.classList.add("gameover");
}

function resetGame() {
  board = createBoard();
  currentPiece = randomPiece();
  nextPiece = randomPiece();
  score = 0;
  level = 1;
  totalLines = 0;
  dropInterval = 800;
  isGameOver = false;
  scoreEl.textContent = score;
  levelEl.textContent = level;
  linesEl.textContent = totalLines;
  updateStatus("게임이 시작되었습니다!", null);
  drawBoard(boardCtx, board, currentPiece);
  drawNext(nextCtx, nextPiece);
}

function updateLevelAndSpeed(clearedLines) {
  if (clearedLines <= 0) return;
  totalLines += clearedLines;
  linesEl.textContent = totalLines;

  const newLevel = 1 + Math.floor(totalLines / 10);
  if (newLevel !== level) {
    level = newLevel;
    levelEl.textContent = level;
    dropInterval = Math.max(120, 800 - (level - 1) * 60);
  }
}

function addScore(clearedLines) {
  if (clearedLines === 0) return;
  const base = [0, 40, 100, 300, 800][clearedLines] || 0;
  score += base * level;
  scoreEl.textContent = score;
}

function spawnPiece() {
  currentPiece = nextPiece || randomPiece();
  nextPiece = randomPiece();
  drawNext(nextCtx, nextPiece);

  if (!isValidPosition(board, currentPiece, 0, 0)) {
    isGameOver = true;
    isRunning = false;
    updateStatus("게임 오버! 다시 시작하려면 버튼을 누르세요.", "gameover");
  }
}

function hardDrop() {
  if (!currentPiece || !isRunning) return;
  while (isValidPosition(board, currentPiece, 0, 1)) {
    currentPiece.y += 1;
  }
  lockPiece();
}

function lockPiece() {
  board = merge(board, currentPiece);
  const { board: newBoard, cleared } = clearLines(board);
  board = newBoard;
  addScore(cleared);
  updateLevelAndSpeed(cleared);
  spawnPiece();
}

function update(timestamp) {
  if (!isRunning) return;

  if (!lastDropTime) lastDropTime = timestamp;
  const delta = timestamp - lastDropTime;

  if (delta > dropInterval) {
    if (isValidPosition(board, currentPiece, 0, 1)) {
      currentPiece.y += 1;
    } else {
      lockPiece();
    }
    lastDropTime = timestamp;
  }

  drawBoard(boardCtx, board, currentPiece);
  requestAnimationFrame(update);
}

function togglePause() {
  if (isGameOver) return;
  isRunning = !isRunning;
  if (isRunning) {
    lastDropTime = 0;
    updateStatus("플레이 중…", null);
    requestAnimationFrame(update);
  } else {
    updateStatus("일시정지됨 (P로 재개)", "paused");
  }
}

startBtn.addEventListener("click", () => {
  resetGame();
  isRunning = true;
  lastDropTime = 0;
  requestAnimationFrame(update);
});

document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "ArrowLeft":
      handleAction("left");
      break;
    case "ArrowRight":
      handleAction("right");
      break;
    case "ArrowDown":
      handleAction("down");
      break;
    case "ArrowUp":
      handleAction("rotate");
      break;
    case "Space":
      e.preventDefault();
      handleAction("drop");
      break;
    case "KeyP":
      handleAction("pause");
      break;
    default:
      break;
  }

});

function bindTouchButton(id, action) {
  const el = document.getElementById(id);
  if (!el) return;

  const handler = (e) => {
    e.preventDefault();
    handleAction(action);
  };

  el.addEventListener("click", handler);
  el.addEventListener("touchstart", handler, { passive: false });
}

bindTouchButton("btnLeft", "left");
bindTouchButton("btnRight", "right");
bindTouchButton("btnDown", "down");
bindTouchButton("btnRotate", "rotate");
bindTouchButton("btnDrop", "drop");
bindTouchButton("btnPause", "pause");

drawBoard(boardCtx, board, null);
drawNext(nextCtx, null);
updateStatus("시작하려면 버튼을 누르세요.", null);

