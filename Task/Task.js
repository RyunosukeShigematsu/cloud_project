// 要素の取得
const showBtn = document.getElementById('showBtn');
const timeContainer = document.getElementById('timeContainer');
const hourText = document.getElementById('hourText');
const minuteText = document.getElementById('minuteText');

// 0埋めする関数 (例: 9 -> "09")
function padZero(num) {
    return num.toString().padStart(2, '0');
}

// ランダムな整数を生成する関数 (min以上 max以下)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ボタンクリック時の動作
showBtn.addEventListener('click', () => {
    // 1. ランダムな時・分を生成
    const randomHour = getRandomInt(0, 23);
    const randomMinute = getRandomInt(0, 59);

    // 2. 画面にセット (0埋めして表示)
    hourText.innerText = padZero(randomHour);
    minuteText.innerText = padZero(randomMinute);

    // 3. 時刻を表示する
    timeContainer.classList.remove('hidden');
    
    // ボタンを無効化（連打防止）
    showBtn.disabled = true;

    // ログ確認用
    console.log(`表示時刻: ${padZero(randomHour)}:${padZero(randomMinute)}`);

    // 4. 1秒後 (1000ミリ秒後) に次の画面へ遷移
    setTimeout(() => {
        window.location.href = '../Bar/Bar.html';
    }, 1000);
});