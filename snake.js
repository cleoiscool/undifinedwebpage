// Game configuration
const canvasSize = 400; // Size of the canvas (square)
const gridSize = 20; // Size of each grid cell
const initialSnakeLength = 5; // Initial length of the snake
const gameSpeed = 100; // Game speed in milliseconds

// Game variables
let canvas;
let ctx;
let snake;
let food;
let direction;
let gameInterval;

// Initialize the game
function init() {
  canvas = document.getElementById('gameCanvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  ctx = canvas.getContext('2d');

  snake = {
    body: [],
    length: initialSnakeLength,
    direction: 'right',
  };
  for (let i = snake.length - 1; i >= 0; i--) {
    snake.body.push({ x: i, y: 0 });
  }

  food = generateFood();
  direction = 'right';

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, gameSpeed);

  document.addEventListener('keydown', changeDirection);
}

// Update the game state
function updateGame() {
  moveSnake();
  if (checkCollision()) {
    clearInterval(gameInterval);
    alert('Game Over!');
    init();
    return;
  }
  if (eatFood()) {
    snake.length++;
    food = generateFood();
  }
  draw();
}

// Draw the game elements
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'green';
  for (let i = 0; i < snake.body.length; i++) {
    ctx.fillRect(snake.body[i].x * gridSize, snake.body[i].y * gridSize, gridSize, gridSize);
  }
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Move the snake
function moveSnake() {
  const head = { ...snake.body[0] };
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }
  snake.body.unshift(head);
  if (snake.body.length > snake.length) {
    snake.body.pop();
  }
}

// Change the snake's direction
function changeDirection(event) {
  switch (event.key) {
    case 'ArrowUp':
      if (direction !== 'down') direction = 'up';
      break;
    case 'ArrowDown':
      if (direction !== 'up') direction = 'down';
      break;
    case 'ArrowLeft':
      if (direction !== 'right') direction = 'left';
      break;
    case 'ArrowRight':
      if (direction !== 'left') direction = 'right';
      break;
  }
}

// Check for collisions with walls or itself
function checkCollision() {
  const head = snake.body[0];
  if (head.x < 0 || head.x >= canvasSize / gridSize || head.y < 0 || head.y >= canvasSize / gridSize) {
    return true;
  }
  for (let i = 1; i < snake.body.length; i++) {
    if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
      return true;
    }
  }
  return false;
}

// Check if the snake has eaten the food
function eatFood() {
  const head = snake.body[0];
  return head.x === food.x && head.y === food.y;
}

// Generate a new food position
function generateFood() {
  let foodPosition;
  let isFoodOnSnake;
  do {
    foodPosition = {
      x: Math.floor(Math.random() * (canvasSize / gridSize)),
      y: Math.floor(Math.random() * (canvasSize / gridSize)),
    };
    isFoodOnSnake = snake.body.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);
  } while (isFoodOnSnake);
  return foodPosition;
}

// Start the game
init();
