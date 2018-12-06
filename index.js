let backgroundImage, playerSprite, enemySprite;

function preload(){
backgroundImage = loadImage("vein.png");
playerSprite = loadImage("virus.png");
enemySprite = loadImage("whiteBloodCell.png");
}


const progressBar = document.querySelector("progress")

class Character {
  constructor(x, y, sprite, speed) {
    Object.assign(this, { x, y, sprite, speed });
  }
  drawE() {
    image(enemySprite,this.x,this.y);
  }
  drawP() {
    image(playerSprite,this.x,this.y);
  }
  move(target) {
    this.x += (target.x - this.x) * this.speed;
    this.y += (target.y - this.y) * this.speed;
  }
}
const player = new Character(30, 30, playerSprite, 0.05);
const enemies = [
  new Character(300, 0, enemySprite, 0.01),
  new Character(300, 300, enemySprite, 0.03),
  new Character(0, 300, enemySprite, 0.003),
  new Character(20, 400, enemySprite, 0.02),
];
let scarecrow;

function setup()  {
  createCanvas(800, 600);
  noStroke();
}

function draw() {
  background(backgroundImage);
  player.drawP();
  image(playerSprite,player.x,player.y);
  enemies.forEach(enemy => enemy.drawE());
  player.move({x: mouseX, y: mouseY});
  enemies.forEach(enemy => enemy.move(scarecrow || player));
  if (scarecrow) {
    scarecrow.drawP();
    scarecrow.ttl--;
    if (scarecrow.ttl < 0) {
      scarecrow = undefined;
    }
  }
  adjust();
}

function adjust() {
  const characters = [player, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i+1; j < characters.length; j++) {
      pushOff(characters[i], characters[j]);
    }
    avoidWalls(characters[i]);
  }
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const distance = Math.hypot(dx, dy);
  let overlap = 28 - distance;
  if (overlap > 0) {
    const adjustX = (overlap / 2) * (dx / distance);
    const adjustY = (overlap / 2) * (dy / distance);
    c1.x -= adjustX;
    c1.y -= adjustY;
    c2.x += adjustX;
    c2.y += adjustY;
  }
}
function avoidWalls(character){
  if (character.x<10){
    character.x =10
  } else if(character.x>770){
      character.x = 770
    }else if(character.y>570){
      character.y = 570
    }else if(character.y<10){
      character.y = 10
    }
  }
function mouseClicked() {
  if (!scarecrow) {
    scarecrow = new Character(player.x, player.y, playerSprite, 0);
    scarecrow.ttl = frameRate() * 5;
  }
}
