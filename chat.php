<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = $_POST['user_input'] ?? '';
    $api_key = 'AIzaSyBko6e4lSXX_Iuk03rfoX0WE6I7M5iUqDw';

    $data = [
        'contents' => [
            [
                'parts' => [
                    ['text' => $input]
                ]
            ]
        ]
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=$api_key");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $result = curl_exec($ch);
    curl_close($ch);

    $json = json_decode($result, true);
    $bot_reply = $json['candidates'][0]['content']['parts'][0]['text'] ?? '⚠️ Tidak ada respon dari AI.';
    echo nl2br(htmlspecialchars($bot_reply));
}
?>
