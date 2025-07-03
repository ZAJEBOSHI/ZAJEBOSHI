let zajeboshi;
let rugpulls = [];
let coins = [];
let gravity = 1;
let isJumping = false;
let jumpForce = 15;
let gameOver = false;
let score = 0;
let highScore = 0;

let rugpullSpeed = 4;
let rugpullSpawnRate = 90;

let rugpullImg, zajeboshiImg;
let coinSound, hitSound;

function preload() {
  zajeboshiImg = loadImage("zajeboshi.png");
  rugpullImg = loadImage("rugpull.png");
  coinSound = loadSound("coin.mp3");
  hitSound = loadSound("hit.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  zajeboshi = new Zajeboshi();
  highScore = getItem("highScore") || 0;
}

function draw() {
  background(255);

  if (!gameOver) {
    zajeboshi.update();
    zajeboshi.display();

    if (frameCount % rugpullSpawnRate === 0) {
      rugpulls.push(new Rugpull());
    }

    if (frameCount % 150 === 0) {
      coins.push(new Coin());
    }

    for (let i = rugpulls.length - 1; i >= 0; i--) {
      rugpulls[i].update();
      rugpulls[i].display();

      if (rugpulls[i].hits(zajeboshi)) {
        hitSound.play();
        gameOver = true;
        if (score > highScore) {
          highScore = score;
          storeItem("highScore", highScore);
        }
      }

      if (rugpulls[i].offscreen()) {
        rugpulls.splice(i, 1);
      }
    }

    for (let i = coins.length - 1; i >= 0; i--) {
      coins[i].update();
      coins[i].display();

      if (coins[i].collected(zajeboshi)) {
        coinSound.play();
        score++;
        coins.splice(i, 1);
      }

      if (coins[i] && coins[i].offscreen()) {
        coins.splice(i, 1);
      }
    }

    textSize(24);
    fill(0);
    text(`Score: ${score}`, 20, 40);
    text(`High Score: ${highScore}`, 20, 70);

  } else {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(0);
    text("Game Over", width / 2, height / 2 - 40);
    textSize(24);
    text(`Score: ${score}`, width / 2, height / 2);
    text(`High Score: ${highScore}`, width / 2, height / 2 + 30);
    text("Press ENTER to restart", width / 2, height / 2 + 60);
  }
}

function keyPressed() {
  if (key === ' ' || keyCode === UP_ARROW) {
    zajeboshi.jump();
  }
  if (keyCode === ENTER && gameOver) {
    resetGame();
  }
}

function resetGame() {
  gameOver = false;
  score = 0;
  rugpulls = [];
  coins = [];
  zajeboshi = new Zajeboshi();
}

class Zajeboshi {
  constructor() {
    this.x = 100;
    this.y = height - 100;
    this.w = 50;
    this.h = 50;
    this.velocityY = 0;
  }

  jump() {
    if (!isJumping) {
      this.velocityY = -jumpForce;
      isJumping = true;
    }
  }

  update() {
    this.velocityY += gravity;
    this.y += this.velocityY;

    if (this.y > height - this.h - 20) {
      this.y = height - this.h - 20;
      this.velocityY = 0;
      isJumping = false;
    }
  }

  display() {
    image(zajeboshiImg, this.x, this.y, this.w, this.h);
  }
}

class Rugpull {
  constructor() {
    this.x = random(0, width - 40);
    this.y = -40;
    this.size = 40;
    this.speed = rugpullSpeed;
  }

  update() {
    this.y += this.speed;
  }

  display() {
    image(rugpullImg, this.x, this.y, this.size, this.size);
  }

  hits(player) {
    return collideRectRect(this.x, this.y, this.size, this.size, player.x, player.y, player.w, player.h);
  }

  offscreen() {
    return this.y > height;
  }
}

class Coin {
  constructor() {
    this.x = random(0, width - 30);
    this.y = -30;
    this.size = 30;
    this.speed = 3;
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(255, 215, 0);
    ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size);
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("$", this.x + this.size / 2, this.y + this.size / 2);
  }

  collected(player) {
    return collideRectCircle(player.x, player.y, player.w, player.h, this.x + this.size / 2, this.y + this.size / 2, this.size);
  }

  offscreen() {
    return this.y > height;
  }
}
