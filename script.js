// Get necessary DOM elements
const box = document.querySelector('.box');
const scoreElement = document.getElementById('user-score');
const playAgainButton = document.getElementById('play-again-btn');

// Constants
const gridSize = 25;  // 25x25 grid (each cell is 20x20px)
const snakeSize = 20; // Each snake part is 20px by 20px
const foodSize = 20;  // Food size is also 20px by 20px
let snake = [{ x: 10, y: 10 }];  // Initial snake position
let direction = 'right';  // Initial direction
let food = {};  // Food position
let score = 0;  // Initial score
let gameInterval;  // Game interval for updating the game state

// Screen size considerations for mobile (Android phone)
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const mobileGridSize = screenWidth < 768 ? Math.floor(screenWidth / snakeSize) : gridSize;  // Adjust grid size for smaller screens
const mobileHeight = screenHeight < 768 ? Math.floor(screenHeight / snakeSize) : gridSize;  // Adjust grid size based on screen height

// Event listeners for control buttons
function changeDirection(newDirection) {
  if (newDirection === 'up' && direction !== 'down') direction = 'up';
  if (newDirection === 'down' && direction !== 'up') direction = 'down';
  if (newDirection === 'left' && direction !== 'right') direction = 'left';
  if (newDirection === 'right' && direction !== 'left') direction = 'right';
}

// Initialize the game
function initGame() {
  snake = [{ x: Math.floor(mobileGridSize / 2), y: Math.floor(mobileHeight / 2) }];
  direction = 'right';
  score = 0;
  scoreElement.textContent = score;
  playAgainButton.style.display = 'none';
  clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, 300);
  spawnFood();
  drawSnake();
}

// Update game state
function updateGame() {
  // Move the snake based on the current direction
  const head = { ...snake[0] };
  if (direction === 'up') head.y -= 1;
  if (direction === 'down') head.y += 1;
  if (direction === 'left') head.x -= 1;
  if (direction === 'right') head.x += 1;

  // Check if the snake eats food
  if (head.x === food.x && head.y === food.y) {
    score += 10;  // Increase score
    scoreElement.textContent = score;
    spawnFood();
  } else {
    snake.pop();  // Remove last part of the snake (move forward)
  }

  // Add new head to the snake
  snake.unshift(head);

  // Check for collisions with walls or self
  if (
    head.x < 0 || head.x >= mobileGridSize || 
    head.y < 0 || head.y >= mobileHeight ||
    snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
  }

  // Redraw the game
  drawSnake();
  drawFood();
}

// Draw snake on the grid
function drawSnake() {
  box.innerHTML = ''; // Clear the grid before drawing
  snake.forEach(segment => {
    const snakeSegment = document.createElement('div');
    snakeSegment.classList.add('snake');
    snakeSegment.style.left = `${segment.x * snakeSize}px`;
    snakeSegment.style.top = `${segment.y * snakeSize}px`;
    box.appendChild(snakeSegment);
  });
}

// Draw food on the grid
function drawFood() {
  const foodElement = document.createElement('div');
  foodElement.classList.add('food');
  foodElement.style.left = `${food.x * foodSize}px`;
  foodElement.style.top = `${food.y * foodSize}px`;
  box.appendChild(foodElement);
}

// Spawn food at a random position
function spawnFood() {
  food.x = Math.floor(Math.random() * mobileGridSize);
  food.y = Math.floor(Math.random() * mobileHeight);

  // Ensure food does not spawn on the snake
  if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    spawnFood();
  }
}

// End the game and show the "Play Again" button
function endGame() {
  clearInterval(gameInterval);
  playAgainButton.style.display = 'block';
}

// Restart the game when "Play Again" button is clicked
function restartGame() {
  initGame();
}

// Start the game when the page loads
initGame();
