let backgroundImage, playerSprite, enemySprite, player, enemies, scarecrow;

function preload(){
  backgroundImage = loadImage("vein.png");
  playerSprite = loadImage("virus.png");
  enemySprite = loadImage("whiteBloodCell.png");
  player = new Character(30, 30, playerSprite, 0.05);
  enemies = [
    new Character(300, 0, enemySprite, 0.01),
    new Character(300, 300, enemySprite, 0.03),
    new Character(0, 300, enemySprite, 0.003),
    new Character(20, 400, enemySprite, 0.02),
  ];
}



class Character {
  constructor(x, y, sprite, speed) {
    Object.assign(this, { x, y, sprite, speed });
  }
  draw() {
    image(this.sprite,this.x,this.y);
  }
  drawP() {
    image(playerSprite,this.x,this.y);
  }
  move(target) {
    this.x += (target.x - this.x) * this.speed;
    this.y += (target.y - this.y) * this.speed;
  }
}

function setup()  {
  createCanvas(800, 600);
  noStroke();
}

function draw() {
  background(backgroundImage);
  player.draw();
  image(playerSprite,player.x,player.y);
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
     for (let k= 0; k<characters.length; k++){
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
//const progressBar = document.getElementById(#progress);

function healthBar(char1, char2) {

if (progressBar.value === 0){
  alert("Game Over! Click to retry");
}



}
