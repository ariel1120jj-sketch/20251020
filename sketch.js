//學習7程式碼所在

// Bubble.js
// sketch.js

let bubbles = []; // 用來儲存所有圓形物件的陣列
const bubbleCount = 30; // 圓形的數量

// 新增：分數
let score = 0;

// 新增：爆破音效與音訊解鎖旗標
let popSound;
let audioUnlocked = false;

// 在 preload 載入專案內音效（請確保檔案存在於 assets/）
function preload() {
  soundFormats('wav', 'mp3');
  popSound = loadSound('assets/mixkit-dry-pop-up-notification-alert-2356.wav');
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 初始化 30 個圓形物件
  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push(new Bubble());
  }
  
  frameRate(60); 
}

function draw() {
  // *** 設定畫布背景顏色為 f6fff8 ***
  background('#f6fff8');

  // 顯示提示文字：若尚未啟用音效，提示使用者點擊畫面
  if (!audioUnlocked) {
    push();
    fill(0, 120);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text('點擊畫面以啟用音效（瀏覽器需使用者互動）', width / 2, height - 8);
    pop();
  }

  // 左上角顯示固定 ID，右上角顯示分數（顏色 #da627d，大小 64px）
  push();
  textSize(64);
  fill('#da627d');
  noStroke();
  textAlign(LEFT, TOP);
  text('414730167', 8, 8);
  textAlign(RIGHT, TOP);
  text(score, width - 8, 8);
  pop();

  // 迭代所有圓形，讓它們移動並顯示
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].move();
    bubbles[i].display();
  }
}

// 確保視窗大小改變時，畫布保持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
class Bubble {
  constructor() {
    // *** 新的四種可用顏色 (HEX) ***
    this.colors = ['#6b9080', '#a4c3b2', '#cce3de', '#eaf4f4'];
    
    // 隨機選擇一種顏色，並將其轉換為 R, G, B
    let colHex = random(this.colors);
    this.hex = colHex; // 新增：保留 hex，方便點選比對
    this.r = unhex(colHex.substring(1, 3));
    this.g = unhex(colHex.substring(3, 5));
    this.b = unhex(colHex.substring(5, 7));
    
    // 隨機設定直徑在 50 到 200 之間
    this.diameter = random(50, 200);
    
    // 初始位置：x 軸隨機，y 軸設定在畫布底部以下
    this.x = random(width);
    this.y = random(height, height + this.diameter);
    
    // 隨機設定往上飄的速度 (較慢且不同)
    this.speed = random(0.5, 3.5);
    
    // 隨機設定透明度 (0-255)
    this.alpha = random(50, 200); 
  }

  // 移動圓形
  move() {
    // 圓形往上移動 (y 座標減少)
    this.y -= this.speed;

    // 檢查是否飄出畫布頂端
    if (this.y < -this.diameter / 2) {
      // 如果飄出頂端，將它重設到畫布底部
      this.y = height + this.diameter / 2;
      
      // 重設 x 座標和速度
      this.x = random(width); 
      this.speed = random(0.5, 3.5); 
    }
  }

  // 顯示圓形
  display() {
    noStroke(); // 無框線
    
    // 設定填充顏色，並加入透明度 (Alpha)
    fill(this.r, this.g, this.b, this.alpha);
    
    // 繪製圓形
    circle(this.x, this.y, this.diameter);

    // 方形大小為圓直徑的六分之一
    let squareSize = this.diameter / 6;
    let radius = this.diameter / 2;

    // 右上四分之一圓的中間點計算
    // 角度為 45 度 (PI/4)，距離圓心到該點的距離為 radius * 0.5 (確保方形不超出圓)
    let offset = radius * 0.5;

    // 以圓心為基準，計算右上四分之一圓的中間點座標
    let squareCenterX = this.x + offset * Math.cos(Math.PI / 4);
    let squareCenterY = this.y - offset * Math.sin(Math.PI / 4);

    // 繪製白色透明方形 (以中心點為基準)
    fill(255, 255, 255, this.alpha * 0.8);
    rectMode(CENTER);
    rect(squareCenterX, squareCenterY, squareSize, squareSize);
    rectMode(CORNER); // 還原模式，避免影響其他繪製
  }
}

function unhex(str) {
  return parseInt(str, 16);
}

// --- 圓的設定 ---
let circles = [];
const COLORS = ['#6b9080', '#a4c3b2', '#cce3de', '#eaf4f4'];
const NUM_CIRCLES = 20;

// 爆破效果陣列
let explosions = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 初始化圓
  circles = [];
  for (let i = 0; i < NUM_CIRCLES; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      r: random(50, 200),
      color: color(random(COLORS)),
      alpha: random(80, 255),
      speed: random(1, 5),
      popped: false // 新增：是否已爆破
    });
  }
}

function draw() {
  background('#f6fff8');
  noStroke();

  // 更新並畫圓（氣球）
  for (let c of circles) {
    if (!c.popped) {
      c.y -= c.speed;

      if (c.y + c.r / 2 < 0) { // 如果圓完全移出畫面頂端
        respawnCircle(c);
      }

      c.color.setAlpha(c.alpha); // 設定透明度
      fill(c.color); // 使用設定的顏色
      circle(c.x, c.y, c.r); // 畫圓

      // 在圓的右上方1/4圓的中間產生方形
      let squareSize = c.r / 6;
      let angle = -PI / 4; // 右上45度
      let distance = c.r / 2 * 0.65;
      let squareCenterX = c.x + cos(angle) * distance;
      let squareCenterY = c.y + sin(angle) * distance;
      fill(255, 255, 255, 120); // 白色透明
      noStroke();
      rectMode(CENTER);
      rect(squareCenterX, squareCenterY, squareSize, squareSize);
    }
  }

  // 更新並畫所有爆破粒子
  for (let i = explosions.length - 1; i >= 0; i--) {
    const ex = explosions[i];
    let alive = false;
    for (let p of ex.particles) {
      p.vy += ex.gravity; // 重力影響
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      p.size *= 0.98;
      if (p.life > 0) {
        alive = true;
        fill(red(p.col), green(p.col), blue(p.col), map(p.life, 0, ex.maxLife, 0, 255));
        noStroke();
        circle(p.x, p.y, p.size);
      }
    }
    if (!alive) {
      explosions.splice(i, 1);
    }
  }
}

// 觸發爆破效果：從圓心散出多個粒子，並把圓標記為已爆破
function triggerExplosion(circle) {
  // 嘗試播放爆破音效（若載入或瀏覽器允許）
  if (popSound) {
    try {
      // 若使用 p5.Sound 物件，直接 play（若瀏覽器封鎖播放會被 catch）
      popSound.play();
    } catch (e) {
      // 忽略播放錯誤
    }
  }

  circle.popped = true;
  circle.alpha = 0; // 隱藏原圓

  const count = floor(map(circle.r, 50, 200, 12, 36)); // 粒子數依圓半徑而定
  const ex = {
    particles: [],
    gravity: 0.12,
    maxLife: 60
  };

  for (let i = 0; i < count; i++) {
    const angle = random(TWO_PI);
    const speed = random(2, map(circle.r, 50, 200, 4, 10));
    const vx = cos(angle) * speed;
    const vy = sin(angle) * speed * 0.9;
    const col = color(red(circle.color), green(circle.color), blue(circle.color), 255);
    ex.particles.push({
      x: circle.x,
      y: circle.y,
      vx: vx + random(-0.5, 0.5),
      vy: vy + random(-0.5, 0.5),
      life: floor(random(ex.maxLife * 0.6, ex.maxLife)),
      size: random(circle.r / 12, circle.r / 6),
      col: col
    });
  }

  // 可加入小碎片（白色亮點）
  for (let i = 0; i < floor(count * 0.2); i++) {
    const angle = random(TWO_PI);
    const speed = random(1, 6);
    ex.particles.push({
      x: circle.x,
      y: circle.y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      life: floor(random(ex.maxLife * 0.4, ex.maxLife * 0.7)),
      size: random(2, 6),
      col: color(255, 255, 255, 255)
    });
  }

  explosions.push(ex);

  // 設定在爆破後延遲重新產生氣球
  setTimeout(() => {
    respawnCircle(circle);
    circle.popped = false;
  }, random(400, 1400)); // 0.4 ~ 1.4 秒後重生
}

// 重新產生/重置圓的位置與屬性
function respawnCircle(c) {
  c.x = random(width);
  c.y = height + c.r / 2;
  c.r = random(50, 200);
  c.color = color(random(COLORS));
  c.alpha = random(80, 255);
  c.speed = random(1, 5);
  c.popped = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重新分布圓的位置
  for (let c of circles) {
    c.x = random(width);
    c.y = random(height);
  }
}

// mousePressed 同時做：解鎖 audio + 偵測點擊氣球並觸發爆破與計分
function mousePressed() {
  // 嘗試解鎖/啟用 AudioContext（某些瀏覽器需要使用者互動）
  try {
    if (typeof userStartAudio === 'function') {
      userStartAudio().then(() => { audioUnlocked = true; }).catch(() => { audioUnlocked = true; });
    } else if (getAudioContext) {
      const ctx = getAudioContext();
      if (ctx && ctx.state !== 'running' && typeof ctx.resume === 'function') {
        ctx.resume().then(() => { audioUnlocked = true; }).catch(() => { audioUnlocked = true; });
      } else {
        audioUnlocked = true;
      }
    } else {
      audioUnlocked = true;
    }
  } catch (e) {
    audioUnlocked = true;
  }

  // 先檢查 bubbles（Bubble 類別的氣球）
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    const d = dist(mouseX, mouseY, b.x, b.y);
    if (d <= b.diameter / 2) {
      // 點擊到此氣球：計分（#6b9080 加一分，其他扣一分）
      if (b.hex && b.hex.toLowerCase() === '#6b9080') {
        score += 1;
      } else {
        score -= 1;
      }

      // 觸發爆破：建立與 triggerExplosion 相容的 circle 物件並呼叫
      const fakeCircle = {
        x: b.x,
        y: b.y,
        r: b.diameter,
        color: color(b.hex),
        alpha: b.alpha,
        popped: false
      };
      triggerExplosion(fakeCircle);

      // 重新產生/重置此 Bubble（不會被永久移除）
      b.x = random(width);
      b.y = height + b.diameter / 2;
      let newHex = random(b.colors);
      b.hex = newHex;
      b.r = unhex(newHex.substring(1,3));
      b.g = unhex(newHex.substring(3,5));
      b.b = unhex(newHex.substring(5,7));
      b.diameter = random(50,200);
      b.speed = random(0.5, 3.5);
      b.alpha = random(50,200);
      return; // 只處理一個被點到的氣球
    }
  }

  // 若沒有點到 Bubble，檢查 circles（如果視覺上也有 circles）
  const targetCol = color('#6b9080');
  for (let i = circles.length - 1; i >= 0; i--) {
    const c = circles[i];
    const d = dist(mouseX, mouseY, c.x, c.y);
    if (d <= c.r / 2) {
      // 計分（比較 RGB）
      if (red(c.color) === red(targetCol) && green(c.color) === green(targetCol) && blue(c.color) === blue(targetCol)) {
        score += 1;
      } else {
        score -= 1;
      }
      triggerExplosion(c);
      return;
    }
  }
}

function touchStarted() {
  // 行動裝置也呼叫 mousePressed 解鎖音訊並處理點擊
  mousePressed();
  return false;
}
