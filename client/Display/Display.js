/* Display.js */

// ==========================================
// 設定: デザイン関連
// ==========================================
const BASE_FONT_SIZE = 40; // 基準サイズ
const SCALE_FACTOR = 2.0;  // 強調倍率

// ==========================================
// ランダム決定ロジック (ページ読み込み時に決定)
// ==========================================
const infoTypes = ['clock', 'number'];
const currentInfoType = infoTypes[Math.floor(Math.random() * infoTypes.length)];
const currentEmphasis = Math.floor(Math.random() * 3);

// Test画面でも使うため保存 (キー名は変えない)
sessionStorage.setItem('task_info_type', currentInfoType);

console.log(`今回の設定 -> Type: ${currentInfoType}, Emphasis: ${currentEmphasis}`);

// ==========================================
// 要素の取得
// ==========================================
const showBtn = document.getElementById('showBtn');
const timeContainer = document.getElementById('timeContainer');
const hourText = document.getElementById('hourText');
const minuteText = document.getElementById('minuteText');
const colonText = document.querySelector('.colon');
const blackBox = document.querySelector('.black-box');
const instructionText = document.querySelector('.instruction-text');

// ==========================================
// ページ読み込み時の初期設定
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    
    // 戻るボタン対策
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => history.go(1));
    window.onbeforeunload = () => "データが失われますがよろしいですか？";

    // --- 【変更】説明文の生成 ---
    let targetWord = "";
    
    if (currentInfoType === 'number') {
        targetWord = "数字";
        document.getElementById('timeContainer').classList.add('number-mode');
    } else {
        targetWord = "時刻";
        document.getElementById('timeContainer').classList.remove('number-mode');
    }

    // ★変更箇所: 2行の文章にしました
    instructionText.innerHTML = `ボタンを押すと${targetWord}が表示されます。<br>表示される${targetWord}をみてください。`;
});

// 0埋め関数
function padZero(num) {
    return num.toString().padStart(2, '0');
}

// 重複なしランダム生成クラス
class RandomBag {
    constructor(min, max) {
        this.min = min;
        this.max = max;
        this.items = [];
    }
    fill() {
        this.items = [];
        for (let i = this.min; i <= this.max; i++) {
            this.items.push(i);
        }
        for (let i = this.items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.items[i], this.items[j]] = [this.items[j], this.items[i]];
        }
    }
    next() {
        if (this.items.length === 0) this.fill();
        return this.items.pop();
    }
}

// バッグの用意
const hourBag = new RandomBag(0, 23);
const minuteBag = new RandomBag(0, 59);
const numBagLeft = new RandomBag(0, 99);
const numBagRight = new RandomBag(0, 99);


// ==========================================
// ボタンクリック時の動作
// ==========================================
showBtn.addEventListener('click', () => {
    // リロード警告を解除
    window.onbeforeunload = null;

    // 1. 値の決定とコロンの処理
    let leftVal, rightVal;

    if (currentInfoType === 'clock') {
        // --- 時計モード ---
        leftVal = hourBag.next();
        rightVal = minuteBag.next();
        colonText.style.display = 'inline'; 
    } else {
        // --- 数字モード ---
        leftVal = numBagLeft.next();
        rightVal = numBagRight.next();
        colonText.style.display = 'none'; 
    }

    // --- 提示刺激を保存 ---
    const digit1 = Math.floor(leftVal / 10);
    const digit2 = leftVal % 10;
    const digit3 = Math.floor(rightVal / 10);
    const digit4 = rightVal % 10;

    sessionStorage.setItem('shown_digit_1', digit1);
    sessionStorage.setItem('shown_digit_2', digit2);
    sessionStorage.setItem('shown_digit_3', digit3);
    sessionStorage.setItem('shown_digit_4', digit4);

    // --- 強調条件を保存 ---
    let emphasisString = "normal";
    if (currentEmphasis === 1) emphasisString = "left";
    if (currentEmphasis === 2) emphasisString = "right";
    sessionStorage.setItem('condition_emphasis', emphasisString);

    // 画面表示
    hourText.innerText = padZero(leftVal);
    minuteText.innerText = padZero(rightVal);

    // 2. サイズ計算
    let leftSize = BASE_FONT_SIZE;
    let rightSize = BASE_FONT_SIZE;

    if (currentEmphasis === 1) {
        leftSize = BASE_FONT_SIZE * SCALE_FACTOR;
        rightSize = BASE_FONT_SIZE;
    } else if (currentEmphasis === 2) {
        leftSize = BASE_FONT_SIZE;
        rightSize = BASE_FONT_SIZE * SCALE_FACTOR;
    }

    let colonSize = Math.min(leftSize, rightSize);
    hourText.style.fontSize = `${leftSize}px`;
    minuteText.style.fontSize = `${rightSize}px`;
    colonText.style.fontSize = `${colonSize}px`;

    // 3. 表示 & 自動調整
    timeContainer.classList.remove('hidden');

    const containerWidth = blackBox.clientWidth - 40; 
    const contentWidth = timeContainer.offsetWidth;

    if (contentWidth > containerWidth) {
        const ratio = containerWidth / contentWidth;
        hourText.style.fontSize = `${leftSize * ratio}px`;
        minuteText.style.fontSize = `${rightSize * ratio}px`;
        colonText.style.fontSize = `${colonSize * ratio}px`;
    }

    // 4. 画面遷移
    showBtn.disabled = true;
    setTimeout(() => {
        window.location.replace('../Task/Task.html');
    }, 1000);
});