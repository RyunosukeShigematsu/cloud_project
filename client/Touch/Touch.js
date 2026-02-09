/* Touch/Touch.js */

let startTime = 0;

// ページ読み込み時
window.addEventListener('DOMContentLoaded', () => {
    
    // ============================================================
    // ★追加: スマホの「戻るスワイプ」を物理的に無効化する最強の処理
    // ============================================================
    document.addEventListener('touchmove', (e) => {
        // 指を動かす操作（スクロールやスワイプ）をすべてキャンセル
        e.preventDefault();
    }, { passive: false });
    // ============================================================

    // ★修正: HTMLのID 'targetTriangle' に合わせました
    const targetTriangle = document.getElementById('targetTriangle');

    // 要素取得チェック
    if (!targetTriangle) {
        console.error("エラー: ID 'targetTriangle' が見つかりません。");
        return;
    }

    // 戻るボタン対策（履歴偽装）
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => {
        history.go(1); // 戻るボタンが押されたら強制的に進む
    });
    
    // リロード防止警告
    window.onbeforeunload = () => "データが失われますがよろしいですか？";

    // 計測開始
    startTime = Date.now();
    console.log("Touch画面: 計測開始");

    // クリックイベント登録
    targetTriangle.addEventListener('click', () => {
        // 計測終了
        const duration = Date.now() - startTime;
        sessionStorage.setItem('touch_duration', duration);

        console.log(`Touch Duration: ${duration}ms`);

        // 警告を解除してから移動
        window.onbeforeunload = null;
        window.location.replace('../Swipe/Swipe.html');
    });
});