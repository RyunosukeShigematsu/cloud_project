/* Test/Test.js */

const selects = document.querySelectorAll('.digit-select'); 
const finishBtn = document.getElementById('finishBtn'); 
const modal = document.getElementById('modal');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn'); 

let startTime = 0;              
let decisionTimes = [null, null, null, null]; 
let finishLogs = [];            

window.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. 連打防止のためのボタンロック
    // ==========================================
    finishBtn.disabled = true;
    setTimeout(() => {
        finishBtn.disabled = false;
    }, 2000); // 2秒後に有効化

    // ==========================================
    // 2. 情報の取得 (数字か時刻か)
    // ==========================================
    const infoType = sessionStorage.getItem('task_info_type');
    
    // ==========================================
    // 3. ★追加: 見出しテキストの書き換え処理
    // ==========================================
    const questionTitle = document.getElementById('questionTitle');
    
    // infoTypeが 'number' なら「数字」、それ以外なら「時刻」
    const targetWord = (infoType === 'number') ? "数字" : "時刻";
    
    if (questionTitle) {
        questionTitle.innerText = `ボタンを押したときに表示されていた${targetWord}はなんでしたか？`;
    }

    // ==========================================
    // 4. 入力欄のモード切替 (コロンの表示/非表示)
    // ==========================================
    const inputArea = document.querySelector('.time-input-area'); 
    if (infoType === 'number') {
        inputArea.classList.add('number-mode');
    } else {
        inputArea.classList.remove('number-mode');
    }

    // ==========================================
    // 5. その他の初期設定
    // ==========================================
    startTime = Date.now();
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => history.go(1));
    window.onbeforeunload = () => "データが失われますがよろしいですか？";
});

selects.forEach((select, index) => {
    select.addEventListener('change', () => {
        const timeElapsed = Date.now() - startTime;
        if (select.value === "") {
            decisionTimes[index] = null; 
        } else {
            decisionTimes[index] = timeElapsed;
        }
    });
});

finishBtn.addEventListener('click', () => {
    const timeElapsed = Date.now() - startTime;
    finishLogs.push(timeElapsed);
    modal.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// ==========================================
// 確定ボタン
// ==========================================
confirmBtn.addEventListener('click', () => {
    
    const answer1 = document.getElementById('digit1').value;
    const answer2 = document.getElementById('digit2').value;
    const answer3 = document.getElementById('digit3').value;
    const answer4 = document.getElementById('digit4').value;

    const shown1 = sessionStorage.getItem('shown_digit_1');
    const shown2 = sessionStorage.getItem('shown_digit_2');
    const shown3 = sessionStorage.getItem('shown_digit_3');
    const shown4 = sessionStorage.getItem('shown_digit_4');

    const isCorrectLeft = (answer1 == shown1 && answer2 == shown2) ? 1 : 0;
    const isCorrectRight = (answer3 == shown3 && answer4 == shown4) ? 1 : 0;
    const isCorrectTotal = (isCorrectLeft && isCorrectRight) ? 1 : 0;
    const toNull = (val) => (val === "" ? null : val);

    const experimentData = {
        // --- 基本情報 ---
        user_id:           sessionStorage.getItem('user_id'),
        created_at:        sessionStorage.getItem('created_at'),
        gender:            sessionStorage.getItem('user_gender'),
        age:               sessionStorage.getItem('user_age'),
        home_dummy_answer: sessionStorage.getItem('home_dummy_answer'),
        user_hand:         sessionStorage.getItem('user_hand'), // ★追加: これが必要です！

        // --- 行動指標 ---
        touch_duration:  sessionStorage.getItem('touch_duration'),
        swipe_duration:  sessionStorage.getItem('swipe_duration'),
        task_miss_count: sessionStorage.getItem('task_miss_count'),

        // --- 実験条件 ---
        task_info_type:     sessionStorage.getItem('task_info_type'), 
        condition_emphasis: sessionStorage.getItem('condition_emphasis'),

        // --- 提示刺激 ---
        shown_digit_1: shown1,
        shown_digit_2: shown2,
        shown_digit_3: shown3,
        shown_digit_4: shown4,

        // --- 回答 ---
        answer_digit_1: toNull(answer1),
        answer_digit_2: toNull(answer2),
        answer_digit_3: toNull(answer3),
        answer_digit_4: toNull(answer4),

        // --- 結果 ---
        is_correct_left:  isCorrectLeft,
        is_correct_right: isCorrectRight,
        is_correct:       isCorrectTotal,

        // --- 反応時間 ---
        time_decide_1: decisionTimes[0],
        time_decide_2: decisionTimes[1],
        time_decide_3: decisionTimes[2],
        time_decide_4: decisionTimes[3],
        time_finish_logs: finishLogs
    };

    // 保存して移動
    sessionStorage.setItem('final_experiment_data', JSON.stringify(experimentData));
    // ★追加: 警告を解除してから移動する
    window.onbeforeunload = null;
    window.location.replace('../Questionnaire/Questionnaire.html');
});