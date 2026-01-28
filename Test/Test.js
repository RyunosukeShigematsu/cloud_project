/* Test.js */

// 要素の取得
const selects = document.querySelectorAll('.digit-select');
const finishBtn = document.getElementById('finishBtn');
const colonSpan = document.querySelector('.colon'); // コロンを取得

// ポップアップ関連
const modal = document.getElementById('modal');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

// 画面読み込み時：Task画面の設定を引き継ぐ
window.addEventListener('DOMContentLoaded', () => {
    const infoType = sessionStorage.getItem('task_info_type');
    
    // もしTask画面が「数字モード(number)」だったら、ここでもコロンを隠す
    if (infoType === 'number') {
        if (colonSpan) {
            colonSpan.style.visibility = 'hidden'; // スペースは残して非表示
        }
    } else {
        // 時計モードなら何もしない（デフォルトで表示）
        if (colonSpan) {
            colonSpan.style.visibility = 'visible';
        }
    }
});


// --- 以下、既存のロジック ---

function checkAllSelected() {
    const allSelected = Array.from(selects).every(select => select.value !== "");

    if (allSelected) {
        finishBtn.disabled = false;
    } else {
        finishBtn.disabled = true;
    }
}

selects.forEach(select => {
    select.addEventListener('change', checkAllSelected);
});

// 完了ボタン -> ポップアップ表示
finishBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

// 回答に戻る
cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// 本当に完了 -> Finishへ
confirmBtn.addEventListener('click', () => {
    const time = `${selects[0].value}${selects[1].value}:${selects[2].value}${selects[3].value}`;
    console.log("最終回答:", time);
    
    window.location.href = '../Finish/Finish.html';
});