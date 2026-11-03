const CONFIG = {
  cell: 40,        // pixels per grid square
  cols: 20,
  rows: 15,
  foodCount: 9,    // food is numbered 1..foodCount
  targetMin: 20,
  targetMax: 34,
};

const COLORS = {
  board: '#000000',
  head: '#0DFF00',
  body: '#CC0040',
  food: '#FFD400',
  foodText: '#2f2028',
};

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');
canvas.width = CONFIG.cols * CONFIG.cell;
canvas.height = CONFIG.rows * CONFIG.cell;

const targetEl = document.getElementById('target');
const scoreEl = document.getElementById('score');
const needEl = document.getElementById('need');
const messageEl = document.getElementById('message');
const messageTextEl = document.getElementById('message-text');
const playAgainEl = document.getElementById('play-again');

let snake;     // list of {x, y}, head first
let food;      // list of {x, y, value}
let score;
let target;
let gameOver;

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function placeFood() {
  const free = [];
  for (let y = 0; y < CONFIG.rows; y++) {
    for (let x = 0; x < CONFIG.cols; x++) {
      if (!snake.some(cell => sameCell(cell, { x, y }))) {
        free.push({ x, y });
      }
    }
  }
  food = [];
  for (let value = 1; value <= CONFIG.foodCount; value++) {
    const [cell] = free.splice(randomInt(0, free.length - 1), 1);
    food.push({ ...cell, value });
  }
}

function reset() {
  const startX = Math.floor(CONFIG.cols / 2);
  const startY = Math.floor(CONFIG.rows / 2);
  snake = [0, 1, 2, 3].map(i => ({ x: startX + i, y: startY }));
  placeFood();
  score = 0;
  target = randomInt(CONFIG.targetMin, CONFIG.targetMax);
  gameOver = false;
  messageEl.hidden = true;
  render();
}

function endGame(text) {
  gameOver = true;
  messageTextEl.textContent = text;
  messageEl.hidden = false;
  playAgainEl.focus();
}

function move(dir) {
  if (gameOver) return;

  const head = snake[0];
  const next = {
    x: (head.x + dir.x + CONFIG.cols) % CONFIG.cols,
    y: (head.y + dir.y + CONFIG.rows) % CONFIG.rows,
  };

  // Ignore a move straight back into the neck.
  if (sameCell(next, snake[1])) return;

  const eaten = food.findIndex(f => sameCell(f, next));
  const grows = eaten !== -1;

  // The tail end moves out of the way unless the snake is growing.
  const body = grows ? snake : snake.slice(0, -1);
  if (body.some(cell => sameCell(cell, next))) {
    endGame('Oops! You bumped into yourself.');
    return;
  }

  snake.unshift(next);
  if (grows) {
    score += food[eaten].value;
    food.splice(eaten, 1);
  } else {
    snake.pop();
  }
  render();

  if (score === target) {
    endGame(`Well done! You made ${target}!`);
  } else if (score > target) {
    endGame(`Too many! ${score} is more than ${target}.`);
  }
}

function drawCell(cell, color) {
  const size = CONFIG.cell;
  context.fillStyle = color;
  context.fillRect(cell.x * size + 1, cell.y * size + 1, size - 2, size - 2);
}

function render() {
  context.fillStyle = COLORS.board;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = `bold ${CONFIG.cell * 0.7}px Verdana, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  for (const f of food) {
    drawCell(f, COLORS.food);
    context.fillStyle = COLORS.foodText;
    context.fillText(f.value, (f.x + 0.5) * CONFIG.cell, (f.y + 0.55) * CONFIG.cell);
  }

  snake.slice(1).forEach(cell => drawCell(cell, COLORS.body));
  drawCell(snake[0], COLORS.head);

  targetEl.textContent = target;
  scoreEl.textContent = score;
  needEl.textContent = Math.max(target - score, 0);
}

document.addEventListener('keydown', event => {
  const dir = DIRECTIONS[event.key];
  if (!dir) return;
  event.preventDefault();
  move(dir);
});

// Swipe controls for tablets.
let touchStart = null;
canvas.addEventListener('touchstart', event => {
  const t = event.touches[0];
  touchStart = { x: t.clientX, y: t.clientY };
});
canvas.addEventListener('touchend', event => {
  if (!touchStart) return;
  const t = event.changedTouches[0];
  const dx = t.clientX - touchStart.x;
  const dy = t.clientY - touchStart.y;
  touchStart = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
  if (Math.abs(dx) > Math.abs(dy)) {
    move(dx > 0 ? DIRECTIONS.ArrowRight : DIRECTIONS.ArrowLeft);
  } else {
    move(dy > 0 ? DIRECTIONS.ArrowDown : DIRECTIONS.ArrowUp);
  }
});

playAgainEl.addEventListener('click', reset);

reset();
