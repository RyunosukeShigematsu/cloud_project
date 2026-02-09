<?php
// submit.php

// ==========================================
// 1. ヘッダー設定 (CORS対応)
// ==========================================
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
// ★修正: OPTIONS を許可メソッドに追加
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// ==========================================
// ★追加: Preflight (OPTIONS) リクエスト対策
// ==========================================
// ブラウザからの「確認」には、ここで「OK」だけ返して即終了させる
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// エラー詳細（本番環境では0推奨）
ini_set('display_errors', 0); 

// ==========================================
// 2. データベース接続設定
// ==========================================
$host = 'localhost';
$db = 'ryu_db';
$user = 'nakamura-lab';
$pass = 'n1k2m3r4fms';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES => false,
];

try {
  $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
  http_response_code(500);
  echo json_encode(["status" => "error", "message" => "DB Connection failed: " . $e->getMessage()]);
  exit();
}

// ==========================================
// 3. データ受け取り
// ==========================================
$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (empty($data)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit();
}

// ==========================================
// 4. データ加工
// ==========================================
// 配列をJSON文字列に変換 (time_finish_logs用)
$time_finish_logs_str = isset($data['time_finish_logs']) ? json_encode($data['time_finish_logs']) : '[]';

// ==========================================
// 5. SQL作成・実行 (テーブル名: m1_project)
// ==========================================
try {
$sql = "INSERT INTO m1_project (
        user_id, created_at, gender, age, user_hand, home_dummy_answer,
        touch_duration, swipe_duration, task_miss_count,
        task_info_type, condition_emphasis,
        shown_digit_1, shown_digit_2, shown_digit_3, shown_digit_4,
        answer_digit_1, answer_digit_2, answer_digit_3, answer_digit_4,
        is_correct, is_correct_left, is_correct_right,
        time_decide_1, time_decide_2, time_decide_3, time_decide_4,
        time_finish_logs,
        quest_seen, quest_noticed, quest_memo, quest_confidence
    ) VALUES (
        :user_id, :created_at, :gender, :age, :user_hand, :home_dummy_answer,
        :touch_duration, :swipe_duration, :task_miss_count,
        :task_info_type, :condition_emphasis,
        :shown_digit_1, :shown_digit_2, :shown_digit_3, :shown_digit_4,
        :answer_digit_1, :answer_digit_2, :answer_digit_3, :answer_digit_4,
        :is_correct, :is_correct_left, :is_correct_right,
        :time_decide_1, :time_decide_2, :time_decide_3, :time_decide_4,
        :time_finish_logs,
        :quest_seen, :quest_noticed, :quest_memo, :quest_confidence
    )";

    $stmt = $pdo->prepare($sql);

    // バインド実行
    $stmt->execute([
        // 参加者情報
        ':user_id'            => $data['user_id'] ?? null,
        ':created_at'         => $data['created_at'] ?? null,
        ':gender'             => $data['gender'] ?? null,
        ':age'                => $data['age'] ?? null,
        ':user_hand'          => $data['user_hand'] ?? null,
        ':home_dummy_answer'  => $data['home_dummy_answer'] ?? null,
        
        // 行動指標
        ':touch_duration'     => $data['touch_duration'] ?? null,
        ':swipe_duration'     => $data['swipe_duration'] ?? null,
        ':task_miss_count'    => $data['task_miss_count'] ?? null,

        // 実験条件
        ':task_info_type'     => $data['task_info_type'] ?? null, 
        ':condition_emphasis' => $data['condition_emphasis'] ?? null,
        
        // 提示数字
        ':shown_digit_1'      => $data['shown_digit_1'] ?? null,
        ':shown_digit_2'      => $data['shown_digit_2'] ?? null,
        ':shown_digit_3'      => $data['shown_digit_3'] ?? null,
        ':shown_digit_4'      => $data['shown_digit_4'] ?? null,
        
        // 回答数字
        ':answer_digit_1'     => $data['answer_digit_1'] ?? null,
        ':answer_digit_2'     => $data['answer_digit_2'] ?? null,
        ':answer_digit_3'     => $data['answer_digit_3'] ?? null,
        ':answer_digit_4'     => $data['answer_digit_4'] ?? null,
        
        // 正誤 (JSから送られてこない場合のデフォルト値もケア)
        ':is_correct'         => isset($data['is_correct']) ? $data['is_correct'] : 0,
        ':is_correct_left'    => $data['is_correct_left'] ?? null,
        ':is_correct_right'   => $data['is_correct_right'] ?? null,
        
        // 反応時間
        ':time_decide_1'      => $data['time_decide_1'] ?? null,
        ':time_decide_2'      => $data['time_decide_2'] ?? null,
        ':time_decide_3'      => $data['time_decide_3'] ?? null,
        ':time_decide_4'      => $data['time_decide_4'] ?? null,
        ':time_finish_logs'   => $time_finish_logs_str,

        // アンケート
        ':quest_seen'         => $data['quest_seen'] ?? null,
        ':quest_noticed'      => $data['quest_noticed'] ?? null,
        ':quest_memo'         => $data['quest_memo'] ?? null,
        ':quest_confidence'   => $data['quest_confidence'] ?? null
    ]);

    // 成功
    echo json_encode(["status" => "success", "message" => "Data saved to m1_project"]);

} catch (PDOException $e) {
    // 失敗
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>