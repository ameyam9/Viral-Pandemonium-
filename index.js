let backgroundImage,
  playerSprite,
  enemySprite,
  player,
  enemies,
  scarecrow,
  font,
  status = "playing",
  fontsize = 100,
  score = 0,
  highscore = 0,
  level = 1;

const progressBar = document.getElementById("HP"),
    points = document.getElementById("Points"),
    subHead = document.getElementById("subhead"),
    highestScore = document.getElementById("HighestScore");

function preload() {
  font = loadFont("font/FrederickatheGreat-Regular.ttf");
  backgroundImage = loadImage("vein.png");
  playerSprite = loadImage("virus.png");
  enemySprite = loadImage("whiteBloodCell.png");
  player = new Character(30, 30, playerSprite, 0.05, 1);
  enemies = [
    new Character(300, 0, enemySprite, 0.01, 1),
    new Character(300, 300, enemySprite, 0.03, 1),
    new Character(0, 300, enemySprite, 0.003, 1),
    new Character(20, 400, enemySprite, 0.02, 1)
  ];
}

class Character {
  constructor(x, y, sprite, speed, level) {
    Object.assign(this, { x, y, sprite, speed, level });
  }
  draw() {
    image(this.sprite, this.x, this.y);
  }
  drawP() {
    image(playerSprite, this.x, this.y);
  }
  move(target) {
    this.x += (target.x - this.x) * this.speed * this.level * 0.2;
    this.y += (target.y - this.y) * this.speed * this.level * 0.2;
  }
}

function setup() {
  createCanvas(800, 600);
  textFont(font);
  textSize(fontsize);
  textAlign(CENTER, CENTER);
  noStroke();
}

function draw() {
  if (status === "gameOver") {
    status = "playing";
  }
  background(backgroundImage);
  player.draw();
  image(playerSprite, player.x, player.y);
  enemies.forEach(enemy => enemy.draw());
  player.move({ x: mouseX, y: mouseY });
  enemies.forEach(enemy => enemy.move(scarecrow || player));
  if (scarecrow) {
    scarecrow.draw();
    scarecrow.ttl--;
    if (scarecrow.ttl < 0) {
      scarecrow = undefined;
    }
  }
  adjust();
}

function adjust() {
  virusAttack();
  updateScore();
  const characters = [player, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      pushOff(characters[i], characters[j]);
      for (let k = 0; k < characters.length; k++) {
        avoidWalls(characters[k]);
      }
    }
  }
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const distance = Math.hypot(dx, dy);
  let overlap = 28 - distance;
  if (overlap > 0) {
    const adjustX = overlap / 2 * (dx / distance);
    const adjustY = overlap / 2 * (dy / distance);
    c1.x -= adjustX;
    c1.y -= adjustY;
    c2.x += adjustX;
    c2.y += adjustY;
  }
}

function avoidWalls(character) {
  if (character.x < 10) {
    character.x = 10;
  } else if (character.x > 770) {
    character.x = 770;
  } else if (character.y > 570) {
    character.y = 570;
  } else if (character.y < 10) {
    character.y = 10;
  }
}

function mouseClicked() {
  if (!scarecrow) {
    scarecrow = new Character(player.x, player.y, playerSprite, 0);
    scarecrow.ttl = frameRate() * 5;
  }
}

function gameOver() {
  fill("black");
  text("GAME OVER", 400, 80);
  textSize(40);
  text("To Play Again Press 'space'", 400, 200);
  status = "gameOver";
  noLoop();
  subHead.textContent = "Oof! You have been eradicated";
}

function keyPressed() {
  if (status === "gameOver") {
    if (key === " ") {
      reset();
    }
  }
}

function reset() {
  player = new Character(30, 30, playerSprite, 0.05, 1);
  enemies = [
    new Character(300, 0, enemySprite, 0.01, 1),
    new Character(300, 300, enemySprite, 0.03, 1),
    new Character(0, 300, enemySprite, 0.003, 1),
    new Character(20, 400, enemySprite, 0.02, 1)
  ];
  loop();
  subHead.textContent = "Don't let the antibodies get you!";
  score = 0;
  progressBar.value = 100;
  textSize(fontsize);
  player.x = 30;
  player.y = 30;
  enemies.forEach(enemy => (enemy.x = 600), (enemy.y = 300));
}

function virusAttack() {
  for (let enemy of enemies) {
    let [dx, dy] = [player.x - enemy.x, player.y - enemy.y];
    const distance = Math.hypot(dx, dy);
    if (28 - distance > 0) {
      progressBar.value = progressBar.value - enemy.level;
    }
    if (progressBar.value === 0) {
      gameOver();
    }
  }
}

function updateScore() {
  score += 0.05;
  let projectedScore = Math.floor(score);
  points.textContent = projectedScore;
  if (projectedScore > highscore) {
    highestScore.textContent = projectedScore;
    highscore = score;
  }
  if (projectedScore % 35 === 0 && score !== 0) {
    nextLevel();
  }
}

function nextLevel() {
  let newEnemy = new Character(300, 300, enemySprite, 0.03, level * 1.005);
  enemies.push(newEnemy);
}
