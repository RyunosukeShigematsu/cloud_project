// ================================
// 設定：待ち時間（秒）
const DURATION_SECONDS = 10; 
// ================================

const progressBar = document.getElementById('progressBar');

// ページが読み込まれたら開始
window.onload = () => {
    startProgressBar(DURATION_SECONDS);
};

function startProgressBar(seconds) {
    // 1. バーのアニメーション設定
    // 指定した秒数かけて幅を100%にする
    progressBar.style.transition = `width ${seconds}s linear`;
    
    // 描画の安定のため、ほんの一瞬だけ待ってからスタート
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);

    // 2. 時間が経ったら次のページへ移動
    // （文字更新などの余計な処理はすべて削除しました）
    setTimeout(() => {
        // Test画面へ移動
        window.location.href = '../Test/Test.html';
    }, seconds * 1000); // 秒 -> ミリ秒に変換
}