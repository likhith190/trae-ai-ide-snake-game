// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;

// Game variables
let canvas, ctx;
let snake = [];
let food = {};
let direction = 'right';
let gameInterval;
let score = 0;
let isGameRunning = false;

// Initialize game elements
function init() {
    canvas = document.getElementById('game-board');
    ctx = canvas.getContext('2d');
    
    // Initialize snake in the middle of the board
    const startX = Math.floor(GRID_SIZE / 2);
    const startY = Math.floor(GRID_SIZE / 2);
    
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        snake.push({ x: startX - i, y: startY });
    }
    
    generateFood();
    updateScore(0);
    
    // Event listeners
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
}

// Handle keyboard controls
function handleKeyPress(event) {
    if (!isGameRunning) return;
    
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

// Generate food at random position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    // Make sure food doesn't appear on snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    }
}

// Update game state
function update() {
    const head = { ...snake[0] };
    
    // Move snake head
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Check for collisions
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        updateScore(score + 1);
        generateFood();
    } else {
        snake.pop();
    }
}

// Check for collisions with walls or self
function checkCollision(head) {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return true;
    }
    
    // Self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#4CAF50' : '#45a049';
        ctx.fillRect(
            segment.x * CELL_SIZE,
            segment.y * CELL_SIZE,
            CELL_SIZE - 1,
            CELL_SIZE - 1
        );
    });
    
    // Draw food
    ctx.fillStyle = '#f44336';
    ctx.fillRect(
        food.x * CELL_SIZE,
        food.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
    );
}

// Game loop
function gameLoop() {
    update();
    draw();
}

// Start game
function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        gameInterval = setInterval(gameLoop, 100);
        document.getElementById('start-btn').disabled = true;
    }
}

// Restart game
function restartGame() {
    // Clear any existing game interval
    clearInterval(gameInterval);
    
    // Reset game state
    isGameRunning = false;
    direction = 'right';
    score = 0;
    snake = [];
    food = {};
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset button state
    document.getElementById('start-btn').disabled = false;
    
    // Reinitialize the game
    init();
    
    // Draw the initial state
    draw();
    
    // Reset score display
    updateScore(0);
}

// Game over
function gameOver() {
    clearInterval(gameInterval);
    isGameRunning = false;
    document.getElementById('start-btn').disabled = false;
    alert('Game Over! Your score: ' + score);
}

// Update score display
function updateScore(newScore) {
    score = newScore;
    document.getElementById('score').textContent = score;
}

// Initialize game when page loads
window.onload = init;