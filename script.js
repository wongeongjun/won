const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
const playerWidth = 50;
const playerHeight = 50;
const playerSpeed = 7; // Increased player speed
const bulletSpeed = 15; // Increased bullet speed
const bulletWidth = 10; // Increased bullet width
const bulletHeight = 20; // Increased bullet height
const maxBullets = 5; // Maximum number of bullets per player
let players = [
  { // Player 1
    x: canvas.width / 4 - playerWidth / 2,
    y: canvas.height - 50,
    color: 'blue',
    bullets: []
  },
  { // Player 2
    x: 3 * canvas.width / 4 - playerWidth / 2,
    y: canvas.height - 50,
    color: 'red',
    bullets: []
  }
];
let enemies = [];
const maxEnemies = 5; // Maximum number of enemies allowed
let score = 0;

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Functions
function handleKeyDown(e) {
  switch (e.key) {
    // Player 1 controls
    case 'ArrowLeft':
      players[0].moveLeft = true;
      break;
    case 'ArrowRight':
      players[0].moveRight = true;
      break;
    case 'Control': // Control key for Player 1 shooting
      shootBullet(0);
      break;

    // Player 2 controls
    case 'a':
      players[1].moveLeft = true;
      break;
    case 'd':
      players[1].moveRight = true;
      break;
    case 'Shift': // Shift key for Player 2 shooting
      shootBullet(1);
      break;
  }
}

function handleKeyUp(e) {
  switch (e.key) {
    // Player 1 controls
    case 'ArrowLeft':
      players[0].moveLeft = false;
      break;
    case 'ArrowRight':
      players[0].moveRight = false;
      break;

    // Player 2 controls
    case 'a':
      players[1].moveLeft = false;
      break;
    case 'd':
      players[1].moveRight = false;
      break;
  }
}

function shootBullet(playerIndex) {
  const player = players[playerIndex];
  if (player.bullets.length < maxBullets) {
    player.bullets.push({
      x: player.x + playerWidth / 2 - bulletWidth / 2, // Center bullet horizontally
      y: player.y,
      width: bulletWidth,
      height: bulletHeight,
      color: player.color
    });
  }
}

function createEnemy() {
  if (enemies.length < maxEnemies) {
    const enemySize = 30; // Adjust enemy size as needed
    const enemyX = Math.random() * (canvas.width - enemySize);
    const enemyY = -enemySize; // Start enemies off-screen at the top
    const enemySpeed = 5; // Increased enemy speed

    enemies.push({
      x: enemyX,
      y: enemyY,
      width: enemySize,
      height: enemySize,
      color: 'green',
      speed: enemySpeed
    });
  }
}

function drawPlayers() {
  for (let i = 0; i < players.length; i++) {
    ctx.fillStyle = players[i].color;
    ctx.fillRect(players[i].x, players[i].y, playerWidth, playerHeight);
  }
}

function drawBullets() {
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < players[i].bullets.length; j++) {
      ctx.fillStyle = players[i].bullets[j].color;
      ctx.fillRect(players[i].bullets[j].x, players[i].bullets[j].y, players[i].bullets[j].width, players[i].bullets[j].height);
    }
  }
}

function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    ctx.fillStyle = enemies[i].color;
    ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
  }
}

function updatePlayers() {
  for (let i = 0; i < players.length; i++) {
    if (players[i].moveLeft && players[i].x > 0) {
      players[i].x -= playerSpeed;
    }
    if (players[i].moveRight && players[i].x < canvas.width - playerWidth) {
      players[i].x += playerSpeed;
    }
  }
}

function updateBullets() {
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < players[i].bullets.length; j++) {
      players[i].bullets[j].y -= bulletSpeed;
      // Remove bullets when they go offscreen
      if (players[i].bullets[j].y < 0) {
        players[i].bullets.splice(j, 1);
        j--;
      }
    }
  }
}

function updateEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += enemies[i].speed;

    // Check collision with players
    for (let j = 0; j < players.length; j++) {
      if (isCollision(players[j].x, players[j].y, playerWidth, playerHeight, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height)) {
        gameOver();
      }
    }

    // Check collision with bullets
    for (let j = 0; j < players.length; j++) {
      for (let k = 0; k < players[j].bullets.length; k++) {
        if (isCollision(players[j].bullets[k].x, players[j].bullets[k].y, players[j].bullets[k].width, players[j].bullets[k].height, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height)) {
          // Remove bullet and enemy on collision
          players[j].bullets.splice(k, 1);
          k--;
          enemies.splice(i, 1);
          i--;

          // Increase score
          score += 10;
        }
      }
    }

    // Remove enemies when they go offscreen
    if (enemies[i] && enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
      i--;
    }
  }
}

function isCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2;
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  createEnemy(); // Create new enemies if allowed
  updatePlayers();
  drawPlayers();
  drawBullets();
  drawEnemies();
  updateBullets();
  updateEnemies();
  drawScore();

  requestAnimationFrame(gameLoop);
}

function gameOver() {
  alert('Game Over! Your score was: ' + score);
  // Reset game variables
  players = [
    { // Player 1
      x: canvas.width / 4 - playerWidth / 2,
      y: canvas.height - 50,
      color: 'blue',
      bullets: []
    },
    { // Player 2
      x: 3 * canvas.width / 4 - playerWidth / 2,
      y: canvas.height - 50,
      color: 'red',
      bullets: []
    }
  ];
  enemies = [];
  score = 0;
}

// Start the game loop
gameLoop();

