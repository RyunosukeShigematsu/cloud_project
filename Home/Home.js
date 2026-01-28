// 要素の取得
const consentCheck = document.getElementById('consentCheck');
const ageSelect = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const dummyRadios = document.querySelectorAll('input[name="dummy"]');
const nextBtn = document.getElementById('nextBtn');

// --- ランダムなIDを作る関数 ---
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// --- 【変更点】ページが読み込まれた時にIDを生成して保存 ---
window.onload = function() {
    // 1. IDを生成
    const userID = generateRandomString(12);
    
    // 2. 保存（上書き）
    sessionStorage.setItem('experiment_id', userID);
    
    // 確認用ログ
    console.log("ページ読み込み完了: 新しいIDを生成しました ->", userID);
};
// -------------------------------------------------------

// チェック関数
function checkValidation() {
    const isConsentChecked = consentCheck.checked;
    const isAgeSelected = ageSelect.value !== "";
    const isGenderSelected = genderSelect.value !== "";
    const isDummySelected = document.querySelector('input[name="dummy"]:checked') !== null;

    if (isConsentChecked && isAgeSelected && isGenderSelected && isDummySelected) {
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

// イベントリスナーの設定
consentCheck.addEventListener('change', checkValidation);
ageSelect.addEventListener('change', checkValidation);
genderSelect.addEventListener('change', checkValidation);

dummyRadios.forEach(radio => {
    radio.addEventListener('change', checkValidation);
});

// ボタンクリック時の動作
nextBtn.addEventListener('click', () => {
    // 記録用ログ
    const selectedDummy = document.querySelector('input[name="dummy"]:checked');
    console.log("ダミー回答:", selectedDummy ? selectedDummy.value : "なし");

    // ID生成処理は window.onload に移動したので、ここは画面遷移だけでOK
    window.location.href = '../Check/Check.html';
});