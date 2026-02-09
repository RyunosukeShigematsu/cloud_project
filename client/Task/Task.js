/* Task/Task.js */

// ==========================================
// ゲーム設定
// ==========================================
const GAME_DURATION = 30000; // 30秒 (ms)
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const SPEED = 4.5;             
const MIN_INTERVAL = 800;  
const MAX_INTERVAL = 2300; 

// ==========================================
// 変数
// ==========================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const instructionText = document.querySelector('.instruction-text');

// ★修正: タイマー要素 (円グラフ用)
const timerPie = document.getElementById('timerPie');

let startTime = 0;
let animationId;
let nextSpawnTime = 0;
let collisionFlashTimer = 0;

// ★追加: ミス回数カウンター
let missCount = 0;

// プレイヤー (恐竜)
const dino = {
    x: 50,
    y: 0, 
    width: 30,
    height: 30,
    dy: 0, 
    isJumping: false,
    rotation: 0 // ★追加: 回転角度
};

let obstacles = [];
let decorations = [];

// ==========================================
// 初期化 & 開始
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    instructionText.innerHTML = "画面をタップ！<br>ジャンプして避けよう";

    setupCanvas();

    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => history.go(1));
    
    startTime = Date.now();
    setNextSpawn();
    spawnStartFlag();

    update();

    // 30秒後に終了
    setTimeout(() => {
        cancelAnimationFrame(animationId);
        
        // ★重要: ミス回数を保存してから遷移
        sessionStorage.setItem('task_miss_count', missCount);
        
        window.location.replace('../Test/Test.html');
    }, GAME_DURATION);
});

function setupCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    dino.y = canvas.height - dino.height - 10;
}

function setNextSpawn() {
    const randomInterval = Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL;
    nextSpawnTime = Date.now() + randomInterval;
}

// ==========================================
// 入力イベント
// ==========================================
function jump(e) {
    if (e && e.cancelable) e.preventDefault(); 
    if (!dino.isJumping) {
        dino.isJumping = true;
        dino.dy = JUMP_STRENGTH;
    }
}
window.addEventListener('touchstart', jump, { passive: false });
window.addEventListener('mousedown', jump);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') jump();
});

// ==========================================
// ゲームループ
// ==========================================
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

// ==========================================
    // ★修正: 扇形タイマーのアニメーション
    // ==========================================
    if (timerPie) {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, GAME_DURATION - elapsed);
        
        // 進捗率 (0.0 -> 1.0 へ増える)
        // 「時計回りに減らす」＝「時計回りにグレーの部分を増やしていく」
        const progress = 1 - (remaining / GAME_DURATION);
        const deg = 360 * progress;

        // conic-gradient: グレーが 0度から deg度まで増える = 青が減って見える
        timerPie.style.background = `conic-gradient(#e0e0e0 ${deg}deg, #007AFF ${deg}deg)`;
    }

    if (collisionFlashTimer > 0) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        collisionFlashTimer--;
    }

    // 1. 恐竜の動き
    dino.dy += GRAVITY;
    dino.y += dino.dy;

    const groundY = canvas.height - dino.height - 10;
    if (dino.y > groundY) {
        dino.y = groundY;
        dino.dy = 0;
        dino.isJumping = false;
    }

    // ★追加: 回転角度の更新 (進むスピードに合わせて回転させる)
    // 回転角度 = 進んだ距離 / 半径
    dino.rotation += SPEED / (dino.width / 2);

    // 2. 障害物生成
    if (Date.now() >= nextSpawnTime) {
        spawnObstacle();
        setNextSpawn();
    }

    // 装飾品
    for (let i = decorations.length - 1; i >= 0; i--) {
        let deco = decorations[i];
        deco.x -= SPEED;
        drawFlag(deco.x, deco.y);
        if (deco.x + 50 < 0) decorations.splice(i, 1);
    }

    // 3. 障害物処理
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= SPEED; 

        ctx.fillStyle = "#FF5555";
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // 当たり判定
        if (
            dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            dino.y < obs.y + obs.height &&
            dino.y + dino.height > obs.y
        ) {
            handleCollision(); 
            break; 
        }

        if (obs.x + obs.width < 0) obstacles.splice(i, 1);
    }

// 4. 描画 (★変更: 回転するボールを描く)
    
    // キャンバスの状態を保存
    ctx.save();
    
    const radius = dino.width / 2;
    const centerX = dino.x + radius;
    const centerY = dino.y + radius;

    // 回転の中心（ボールの中心）に座標の原点を移動させてから回転
    ctx.translate(centerX, centerY);
    ctx.rotate(dino.rotation);

    // ベースの青い円を描く (原点を中心に)
    ctx.fillStyle = "#007AFF";
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // 回転がわかる模様（白い十字線）を描く
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"; // 少し透明な白
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-radius + 2, 0); ctx.lineTo(radius - 2, 0); // 横線
    ctx.moveTo(0, -radius + 2); ctx.lineTo(0, radius - 2); // 縦線
    ctx.stroke();
    
    // 中心の白い丸アクセント
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // キャンバスの状態を元に戻す (これをしないと他の描画も回転してしまう)
    ctx.restore();


    // 地面
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 10);
    ctx.lineTo(canvas.width, canvas.height - 10);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#999";
    ctx.stroke();

    animationId = requestAnimationFrame(update);
}

function spawnObstacle() {
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 30 - 10,
        width: 20,
        height: 30
    });
}

function spawnStartFlag() {
    decorations.push({ type: 'flag', x: 200, y: canvas.height - 10 });
}

function drawFlag(x, y) {
    ctx.fillStyle = "#666";
    ctx.fillRect(x, y - 50, 4, 50);
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 50);
    ctx.lineTo(x + 35, y - 35);
    ctx.lineTo(x + 4, y - 20);
    ctx.closePath();
    ctx.fillStyle = "#FFC107";
    ctx.fill();
}

// 衝突時の処理
function handleCollision() {
    // ★追加: ミス回数をカウントアップ
    missCount++;
    
    obstacles = [];
    spawnStartFlag();
    setNextSpawn(); 
    collisionFlashTimer = 10;
}