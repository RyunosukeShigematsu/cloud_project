/* Finish/Finish.js */

const idElement = document.getElementById('generatedId');
const copyBtn = document.getElementById('copyBtn');

window.onload = () => {
    // ---------------------------------------------------
    // 1. IDの表示
    // ---------------------------------------------------
    const savedId = sessionStorage.getItem('user_id');
    
    if (savedId) {
        idElement.innerText = savedId;
        console.log(`User ID: ${savedId}`);
    } else {
        idElement.innerText = "ID_NOT_FOUND";
    }

    // ---------------------------------------------------
    // 2. ログ確認 (送信は完了しているので表示だけ)
    // ---------------------------------------------------
    const finalDataJson = sessionStorage.getItem('final_experiment_data');

    if (finalDataJson) {
        const finalData = JSON.parse(finalDataJson);
        
        console.log("=== ✨ 実験完了：送信済みデータ ===");
        
        // 配列を見やすく整形
        const displayData = { ...finalData };
        if (Array.isArray(displayData.time_finish_logs)) {
            displayData.time_finish_logs = JSON.stringify(displayData.time_finish_logs);
        }
        
        console.table(displayData);
        console.log("Raw Data:", finalData);
        console.log("==========================================");

    } else {
        console.warn("データが見つかりません（既に消去された可能性があります）");
    }

    // ---------------------------------------------------
    // 3. 終了処理
    // ---------------------------------------------------
    // 戻るボタン無効化
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => history.go(1));
    
    // データのクリア (ログ確認用に少し待ってから消す)
    setTimeout(() => {
        sessionStorage.clear();
        console.log("🧹 Session storage cleared.");
    }, 2000);
};

// コピーボタン
copyBtn.addEventListener('click', () => {
    const textToCopy = idElement.innerText;
    if (!textToCopy || textToCopy === "ID_NOT_FOUND") return;

    navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerText = 'コピーしました'; 
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.innerText = 'コピー';
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('コピー失敗', err);
    });
});