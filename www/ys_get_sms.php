<?php
// Twilio에서 전달된 데이터 수신
$from = $_POST['From'] ?? null; // 발신자 번호
$to = $_POST['To'] ?? null;     // 수신자 번호
$body = $_POST['Body'] ?? null; // 메시지 내용

// 데이터 확인
if ($from && $body) {
    // 메시지 데이터를 저장하거나 로그로 남길 수 있습니다.
    // 예: 로그로 남기기
    $logFile = __DIR__ . '/sms_log.txt'; // 같은 디렉토리에 로그 파일 생성
    $logMessage = "From: $from\nTo: $to\nBody: $body\n---\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);

    // 받은 데이터를 브라우저에 출력 (디버깅용)
    echo "Message Received:<br>";
    echo "From: $from<br>";
    echo "To: $to<br>";
    echo "Message: $body<br>";
} else {
    // 잘못된 요청 처리
    echo "Invalid request. Missing required parameters.";
}
?>
