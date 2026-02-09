/* Swipe/Swipe.js */

const track = document.getElementById('track');
const handle = document.getElementById('handle');

let isDragging = false;
let startX = 0;
let startTime = 0; // ★計測用

// 初期化
window.addEventListener('DOMContentLoaded', () => { 
    
    // ============================================================
    // ★追加: スマホの「戻るスワイプ」を無効化する処理
    // ============================================================
    document.addEventListener('touchmove', (e) => {
        // これを書いても、下の onDrag 関数はちゃんと動きます！
        // 「画面全体のスクロール」や「ブラウザの戻る」だけが止まります。
        e.preventDefault();
    }, { passive: false });
    // ============================================================

    // 履歴操作（念のため）
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => history.go(1));
    window.onbeforeunload = () => "データが失われますがよろしいですか？";

    // ★計測開始
    startTime = Date.now();
});

// イベント登録
handle.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', onDrag);
window.addEventListener('mouseup', endDrag);

handle.addEventListener('touchstart', (e) => startDrag(e.touches[0]));
window.addEventListener('touchmove', (e) => onDrag(e.touches[0]));
window.addEventListener('touchend', endDrag);


function startDrag(e) {
    isDragging = true;
    startX = e.clientX;
}

function onDrag(e) {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const trackWidth = track.clientWidth;
    const handleWidth = handle.clientWidth;
    const maxMove = trackWidth - handleWidth;
    let newLeft = Math.max(0, Math.min(deltaX, maxMove));
    handle.style.left = `${newLeft}px`;

    if (newLeft >= maxMove * 0.95) {
        completeSwipe();
    }
}

function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    handle.style.transition = "left 0.3s ease";
    handle.style.left = "0px";
    setTimeout(() => { handle.style.transition = "none"; }, 300);
}

function completeSwipe() {
    if (!isDragging) return; // 重複防止
    isDragging = false;
    
    // ★計測終了 & 保存
    const duration = Date.now() - startTime;
    sessionStorage.setItem('swipe_duration', duration);

    handle.style.left = `${track.clientWidth - handle.clientWidth}px`;
    handle.style.backgroundColor = "#4CD964";

    window.onbeforeunload = null;

    setTimeout(() => {
        window.location.replace('../Display/Display.html'); 
    }, 500);
}