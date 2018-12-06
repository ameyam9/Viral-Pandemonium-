var backgroundImage;

const mouseSpan = document.querySelector("#mouse");


const progressBar = document.querySelector("progress")

class Character {
  constructor(x, y, color, radius, speed) {
    Object.assign(this, { x, y, color, radius, speed });
  }
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
  }
  move(target) {
    this.x += (target.x - this.x) * this.speed;
    this.y += (target.y - this.y) * this.speed;
  }
}

const player = new Character(30, 30, "blue", 10, 0.05);
const enemies = [
  new Character(300, 0, "rgb(200,190,80)", 15, 0.01),
  new Character(300, 300, "rgb(240,100,250)", 17, 0.03),
  new Character(0, 300, "rgb(80,200,235)", 20, 0.003),
  new Character(20, 400, "rgb(100,170,190)", 12, 0.02),
];
let scarecrow;

function preload(){

}

function setup()  {
  backgroundImage = loadImage("vein.png");
  createCanvas(800, 600);
  noStroke();
}

function draw() {
  background(0);
  image(backgroundImage, 0, 0);
  player.draw();
  enemies.forEach(enemy => enemy.draw());
  player.move({x: mouseX, y: mouseY});
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
  let overlap = c1.radius + c2.radius - distance;
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
  if (character.x<10+character.radius){
    character.x =10+character.radius
  } else if(character.x>790-character.radius){
      character.x = 790-character.radius
    }else if(character.y>590-character.radius){
      character.y = 590-character.radius
    }else if(character.y<10+character.radius){
      character.y = 10+character.radius
    }
  }
function mouseClicked() {
  if (!scarecrow) {
    scarecrow = new Character(player.x, player.y, "white", 10, 0);
    scarecrow.ttl = frameRate() * 5;
  }
}
