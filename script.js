const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let round = 1;
let score = 0;
let player = { x: 400, y: 300, size: 30, speed: 5 };
let preys = [];
let predators = [];
let preyType = "insect";
let predatorType = "none";

function setupRound() {
  preys = [];
  predators = [];
  switch (round) {
    case 1:
      preyType = "insect";
      predatorType = "snake";
      break;
    case 2:
      preyType = "frog";
      predatorType = "eagle";
      break;
    case 3:
      preyType = "snake";
      predatorType = "none";
      break;
    case 4:
      preyType = "fish";
      predatorType = "none";
      break;
  }
  for (let i = 0; i < 10; i++) preys.push(spawnEntity(preyType));
  if (predatorType !== "none") predators.push(spawnEntity(predatorType));
}

function spawnEntity(type) {
  return {
    type,
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: type === "insect" ? 10 : type === "frog" ? 20 : 40,
    speed: Math.random() * 2 + 1,
    dx: Math.random() < 0.5 ? 1 : -1,
    dy: Math.random() < 0.5 ? 1 : -1,
  };
}

function drawEntity(entity, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
  ctx.fill();
}

function moveEntity(entity) {
  entity.x += entity.dx * entity.speed;
  entity.y += entity.dy * entity.speed;
  if (entity.x < 0 || entity.x > canvas.width) entity.dx *= -1;
  if (entity.y < 0 || entity.y > canvas.height) entity.dy *= -1;
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawEntity(player, "blue");

  for (const prey of preys) {
    drawEntity(prey, "green");
    moveEntity(prey);

    if (isColliding(player, prey)) {
      score += prey.type === preyType ? 5 : 1;
      preys = preys.filter(p => p !== prey);
    }
  }

  for (const predator of predators) {
    drawEntity(predator, "red");
    moveEntity(predator);

    if (isColliding(player, predator)) {
      alert("Game Over! Final Score: " + score);
      return;
    }
  }

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Round: " + round, 10, 50);

  if (score >= 25 * round) {
    round++;
    if (round > 4) {
      alert("You Win! Final Score: " + score);
      return;
    }
    setupRound();
  }

  requestAnimationFrame(drawGame);
}

function isColliding(a, b) {
  const dist = Math.hypot(a.x - b.x, a.y - b.y);
  return dist < a.size + b.size;
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") player.y -= player.speed;
  if (e.key === "ArrowDown") player.y += player.speed;
  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowRight") player.x += player.speed;
});

setupRound();
drawGame();
