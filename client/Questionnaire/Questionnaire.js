/* Questionnaire/Questionnaire.js */

// 要素取得
const q1Text = document.getElementById('q1_text');
const q2Text = document.getElementById('q2_text');
const step1Area = document.getElementById('step1_area');
const step2Area = document.getElementById('step2_area'); // Q2, Q3
const commonArea = document.getElementById('common_area'); // Q4(自信度)
const nextBtn = document.getElementById('nextBtn');
const form = document.getElementById('questForm');
// ★追加: Q4の要素を取得
const q4Text = document.getElementById('q4_text');

window.addEventListener('DOMContentLoaded', () => {
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => history.go(1));

    const infoType = sessionStorage.getItem('task_info_type');

    // --- ★ここを修正: 文言の切り替え ---
    if (infoType === 'number') {
        q1Text.innerText = "Q1. 表示された数字を見ましたか？";
        q2Text.innerText = "Q2. 数字の大きさの一部に違いがありましたか？";

        // ★追加: Q4 数字バージョン
        if (q4Text) q4Text.innerText = "Q4. 先ほど回答した数字について、どれくらい自信がありますか？";

    } else {
        q1Text.innerText = "Q1. 表示された時刻を見ましたか？";
        q2Text.innerText = "Q2. 時刻の大きさの一部に違いがありましたか？";

        // ★追加: Q4 時刻バージョン
        if (q4Text) q4Text.innerText = "Q4. 先ほど回答した時刻について、どれくらい自信がありますか？";
    }

    form.addEventListener('change', checkValidity);
});

// ==========================================
// Q1の分岐ロジック
// ==========================================
document.getElementsByName('q1').forEach(radio => {
    radio.addEventListener('change', (e) => {

        // アニメーション用に少し遅らせて切り替え
        setTimeout(() => {
            if (e.target.value === 'yes') {
                // --- Yesの場合 ---
                // Q1を隠し、Q2,Q3(詳細) と Q4(自信度) を両方表示
                step1Area.classList.add('hidden');
                step2Area.classList.remove('hidden');
                commonArea.classList.remove('hidden');
            } else {
                // --- Noの場合 ---
                // Q1を表示したままにするか、あるいは「送信ボタンだけ」の状態にするか
                // ここでは「Q1は見えたまま、他は全部隠す」挙動にします
                // (もしQ1も消したい場合は step1Area.classList.add('hidden') してください)

                step2Area.classList.add('hidden');  // Q2, Q3 隠す
                commonArea.classList.add('hidden'); // Q4(自信度) も隠す ★修正

                // 隠した項目の選択リセット
                resetRadio('q2');
                resetRadio('q3');
                resetRadio('confidence');
            }
            checkValidity();
        }, 200);
    });
});

function resetRadio(name) {
    document.getElementsByName(name).forEach(r => r.checked = false);
}

// ==========================================
// バリデーション
// ==========================================
function checkValidity() {
    const q1 = getRadioValue('q1');
    const conf = getRadioValue('confidence');

    // Q1未回答ならボタン無効
    if (!q1) { nextBtn.disabled = true; return; }

    // --- Noの場合 ---
    if (q1 === 'no') {
        // 即OK (他は答える必要なし)
        nextBtn.disabled = false;
        return;
    }

    // --- Yesの場合 ---
    // Q2, Q3, Q4(自信度) すべて必須
    if (q1 === 'yes') {
        if (!getRadioValue('q2') || !getRadioValue('q3') || !conf) {
            nextBtn.disabled = true;
            return;
        }
    }

    // ここまで来ればOK
    nextBtn.disabled = false;
}

function getRadioValue(name) {
    for (const r of document.getElementsByName(name)) {
        if (r.checked) return r.value;
    }
    return null;
}

// ==========================================
// 送信処理
// ==========================================
nextBtn.addEventListener('click', async () => {

    nextBtn.disabled = true;
    nextBtn.innerText = "送信中...";

    // 1. 回答取得
    const q1Val = getRadioValue('q1');

    // Q1がYesなら値を取得、Noならnull
    const q2Val = (q1Val === 'yes') ? getRadioValue('q2') : null;
    const q3Val = (q1Val === 'yes') ? getRadioValue('q3') : null;
    const confVal = (q1Val === 'yes') ? getRadioValue('confidence') : null; // ★修正: Noならnull

    // 2. データ準備
    const rawData = sessionStorage.getItem('final_experiment_data');
    let finalData = {};
    if (rawData) {
        finalData = JSON.parse(rawData);
    } else {
        alert("エラー: データが見つかりません");
        return;
    }

    // 3. データ結合
    finalData.quest_seen = q1Val;
    finalData.quest_noticed = q2Val;
    finalData.quest_memo = q3Val;
    finalData.quest_confidence = confVal;

    // 4. 送信
    try {
        const response = await fetch('https://shigematsu.nkmr.io/m1_cloud/database.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData)
        });

        if (response.ok) {
            sessionStorage.setItem('final_experiment_data', JSON.stringify(finalData));
            window.location.replace('../Finish/Finish.html');
        } else {
            const errorText = await response.text();
            throw new Error(`送信エラー: ${errorText}`);
        }

    } catch (error) {
        alert("送信に失敗しました。" + error.message);
        console.error(error);
        nextBtn.disabled = false;
        nextBtn.innerText = "結果を送信して終了";
    }
});