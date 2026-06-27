<?php
/* ============================================================
   応募フォーム送信処理  send.php
   AT-T アイシン高丘東北株式会社 RECRUITING SITE
   - 外部ライブラリ不使用 / mb_send_mail() で送信
   ============================================================ */

/* ===== メール設定（納品時にここだけ変更すればOK）================= */
// 管理者通知先メールアドレス：納品先に確認して変更してください
$admin_email   = "recruit@example.com";
// 送信元メールアドレス：納品先ドメインのメールアドレスを設定してください（応募者のアドレスは使わない）
$from_email    = "no-reply@example.com";
// 送信元名
$from_name     = "採用応募フォーム";
// 管理者宛メールの件名
$subject_admin = "【採用応募】HPの応募フォームから新しい応募がありました";
// 応募者宛 自動返信メールの件名
$subject_reply = "【アイシン高丘東北】ご応募を受け付けました";
// 送信完了後のリダイレクト先
$thanks_url    = "thanks.html";
/* ================================================================ */

/* PHPのエラーは画面に出さない（ログのみ） */
error_reporting(E_ALL);
ini_set('display_errors', '0');

/* 日本語メール設定 */
mb_language("Japanese");
mb_internal_encoding("UTF-8");

/* POST以外でのアクセスはフォームへ戻す */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header("Location: entry.html");
    exit;
}

/* POST値の取得＋trim整形 */
function v($key) {
    return isset($_POST[$key]) ? trim((string)$_POST[$key]) : '';
}
$kbn        = v('kbn');
$name       = v('name');
$kana       = v('kana');
$birth      = v('birth');
$email      = v('email');
$tel        = v('tel');
$address    = v('address');
$education  = v('education');
$career     = v('career');
$motivation = v('motivation');
$kengaku    = v('kengaku');

/* ヘッダーインジェクション対策：ヘッダーに使う値に改行が混入していたら即停止 */
function has_newline($s) {
    return preg_match('/[\r\n]/', $s) === 1;
}
if (has_newline($email) || has_newline($name) || has_newline($from_email) || has_newline($from_name)) {
    show_error("不正な入力が検出されたため送信を中止しました。");
}

/* 必須項目チェック */
$errors = array();
if ($name  === '') $errors[] = "氏名";
if ($kana  === '') $errors[] = "フリガナ";
if ($birth === '') $errors[] = "生年月日";
if ($email === '') $errors[] = "メールアドレス";
if ($tel   === '') $errors[] = "電話番号";
if (!empty($errors)) {
    show_error("必須項目が未入力です：" . implode("、", $errors));
}

/* メールアドレス形式チェック */
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    show_error("メールアドレスの形式が正しくありません。");
}

/* 管理者宛メール本文（入力内容をすべて記載） */
$body_admin =
    "HPの応募フォームから新しい応募がありました。\n\n" .
    "【応募区分】\n"     . ($kbn  !== '' ? $kbn  : "（未選択）") . "\n\n" .
    "【お名前】\n"       . $name  . "\n\n" .
    "【フリガナ】\n"     . ($kana !== '' ? $kana : "（未入力）") . "\n\n" .
    "【生年月日】\n"     . $birth . "\n\n" .
    "【メールアドレス】\n" . $email . "\n\n" .
    "【電話番号】\n"     . $tel   . "\n\n" .
    "【住所】\n"         . ($address   !== '' ? $address   : "（未入力）") . "\n\n" .
    "【学歴】\n"         . ($education !== '' ? $education : "（未入力）") . "\n\n" .
    "【職歴】\n"         . ($career    !== '' ? $career    : "（未入力）") . "\n\n" .
    "【志望動機】\n"     . ($motivation!== '' ? $motivation: "（未入力）") . "\n\n" .
    "【工場見学希望】\n" . ($kengaku   !== '' ? $kengaku   : "（未選択）") . "\n";

/* 応募者宛 自動返信メール本文 */
$body_reply =
    $name . " 様\n\n" .
    "この度はご応募いただきありがとうございます。\n" .
    "以下の内容で受け付けいたしました。\n\n" .
    "【応募区分】\n"     . ($kbn !== '' ? $kbn : "（未選択）") . "\n\n" .
    "【お名前】\n"       . $name  . "\n\n" .
    "【メールアドレス】\n" . $email . "\n\n" .
    "【電話番号】\n"     . $tel   . "\n\n" .
    "【志望動機】\n"     . ($motivation !== '' ? $motivation : "（未入力）") . "\n\n" .
    "担当者より改めてご連絡いたします。\n\n" .
    "──────────────────────\n" .
    "アイシン高丘東北株式会社 採用担当\n" .
    "──────────────────────\n";

/* メールヘッダー
   - From は納品先ドメインのアドレス（$from_email）を使用（応募者のアドレスは使わない）
   - 応募者のアドレスは Reply-To に設定（返信は応募者に届く）           */
$from_header   = mb_encode_mimeheader($from_name) . " <" . $from_email . ">";
$headers_admin = "From: " . $from_header . "\r\n" . "Reply-To: " . $email;
$headers_reply = "From: " . $from_header;

/* 送信（mb_send_mail）
   ※ サーバーで mb_send_mail() / mail() が使えない（送信できない）場合は、
     PHPMailer 等を用いた SMTP 送信への切り替えが必要です。           */
$sent_admin = mb_send_mail($admin_email, $subject_admin, $body_admin, $headers_admin);
$sent_reply = mb_send_mail($email,       $subject_reply, $body_reply, $headers_reply);

/* 管理者宛が送れていれば完了とみなしてリダイレクト */
if ($sent_admin) {
    header("Location: " . $thanks_url);
    exit;
} else {
    show_error("送信処理に失敗しました。お手数ですが、時間をおいて再度お試しください。");
}

/* ===== 送信失敗・入力エラー時の表示（既存サイトのCSSを利用）======= */
function show_error($message) {
    $msg = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    echo '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8">';
    echo '<meta name="viewport" content="width=1206">';
    echo '<title>送信エラー | AT-T アイシン高丘東北株式会社 RECRUITING SITE</title>';
    echo '<link rel="stylesheet" href="css/style.css"></head><body>';
    echo '<div style="max-width:680px;margin:140px auto 100px;padding:0 24px;text-align:center;font-family:\'Noto Sans JP\',sans-serif;color:#251E1C;">';
    echo '<h1 style="font-size:24px;font-weight:700;letter-spacing:.06em;margin:0 0 20px;">送信できませんでした</h1>';
    echo '<p style="font-size:14px;line-height:2;font-weight:400;">' . $msg . '</p>';
    echo '<p style="margin-top:36px;"><a href="entry.html" style="display:inline-block;background:#2472DA;color:#fff;padding:13px 36px;border-radius:25px;text-decoration:none;font-weight:700;letter-spacing:.08em;">入力画面に戻る</a></p>';
    echo '</div></body></html>';
    exit;
}
