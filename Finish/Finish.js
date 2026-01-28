/* Finish.js */

const idElement = document.getElementById('generatedId');
const copyBtn = document.getElementById('copyBtn');

// 画面読み込み時に保存されたIDを取得して表示
window.onload = () => {
    const savedId = sessionStorage.getItem('experiment_id');

    if (savedId) {
        idElement.innerText = savedId;
    } else {
        idElement.innerText = "ID_NOT_FOUND";
    }
};

// コピーボタンの動作
copyBtn.addEventListener('click', () => {
    const textToCopy = idElement.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        // --- 【変更】コピー成功時の処理 ---
        
        // 1. テキストを変更
        copyBtn.innerText = 'コピー'; 
        
        // 2. グレーにするためのクラスを追加
        copyBtn.classList.add('copied');

        // ★以前あった「2秒後に元に戻す(setTimeout)」のコードは削除しました。
        // これでグレーのまま固定されます。

    }).catch(err => {
        console.error('コピー失敗', err);
    });
});