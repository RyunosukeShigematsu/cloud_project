/* Home/Home.js */

// 要素の取得
const consentCheck = document.getElementById('consentCheck');
const ageSelect = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const handRadios = document.querySelectorAll('input[name="hand"]');   // 利き手
const dummyRadios = document.querySelectorAll('input[name="dummy"]'); // 確認問題
const nextBtn = document.getElementById('nextBtn');

// --- ランダムなIDを作る関数 ---
function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// --- ページ読み込み時の初期設定 ---
window.addEventListener('DOMContentLoaded', () => {
    
    // 戻るボタン対策
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => history.go(1));

    // IDと開始時刻の生成 (なければ作る)
    if (!sessionStorage.getItem('user_id')) {
        const userID = generateRandomString(12);
        const now = new Date();
        const createdAt = now.getFullYear() + '-' + 
                         String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(now.getDate()).padStart(2, '0') + ' ' + 
                         String(now.getHours()).padStart(2, '0') + ':' + 
                         String(now.getMinutes()).padStart(2, '0') + ':' + 
                         String(now.getSeconds()).padStart(2, '0');

        sessionStorage.setItem('user_id', userID);
        sessionStorage.setItem('created_at', createdAt);
        console.log(`New User: ${userID}, Start: ${createdAt}`);
    }
    
    // 戻ってきた時などのためにボタン状態を確認
    checkValidation();
});

// --- バリデーション (入力チェック) ---
function checkValidation() {
    const isConsentChecked = consentCheck.checked;
    const isAgeSelected = ageSelect.value !== "";
    const isGenderSelected = genderSelect.value !== "";
    const isHandSelected = document.querySelector('input[name="hand"]:checked') !== null;
    const isDummySelected = document.querySelector('input[name="dummy"]:checked') !== null;

    // 5つ全てOKならボタン有効化
    if (isConsentChecked && isAgeSelected && isGenderSelected && isHandSelected && isDummySelected) {
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

// イベントリスナーの設定 (変更があったらチェックする)
consentCheck.addEventListener('change', checkValidation);
ageSelect.addEventListener('change', checkValidation);
genderSelect.addEventListener('change', checkValidation);

handRadios.forEach(radio => {
    radio.addEventListener('change', checkValidation);
});
dummyRadios.forEach(radio => {
    radio.addEventListener('change', checkValidation);
});


// --- ボタンクリック時の動作 ---
nextBtn.addEventListener('click', () => {
    
    // ラジオボタンの回答を取得
    const selectedHand = document.querySelector('input[name="hand"]:checked');
    const handValue = selectedHand ? selectedHand.value : "未回答";

    const selectedDummy = document.querySelector('input[name="dummy"]:checked');
    const dummyValue = selectedDummy ? selectedDummy.value : "未回答";

    // ★データを保存 (これをしないとデータベースに送れません)
    sessionStorage.setItem('user_age', ageSelect.value);
    sessionStorage.setItem('user_gender', genderSelect.value);
    sessionStorage.setItem('user_hand', handValue);       // 利き手
    sessionStorage.setItem('home_dummy_answer', dummyValue); // 確認問題

    // ログ確認
    console.log("保存データ:", {
        id: sessionStorage.getItem('user_id'),
        age: ageSelect.value,
        gender: genderSelect.value,
        hand: handValue,
        dummy: dummyValue
    });

    // 画面遷移
    window.onbeforeunload = null; 
    window.location.replace('../Touch/Touch.html');
});