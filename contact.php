<?php
/**
 * Phoenix Reception — contact form handler.
 * Requires PHP mail() support, which 20i shared hosting provides out of
 * the box. Update RECIPIENT_EMAIL below before going live.
 */

declare(strict_types=1);

const RECIPIENT_EMAIL = 'hello@phoenixrisingautomation.com';
const SITE_NAME = 'Phoenix Reception';

header('Content-Type: application/json');

function respond(bool $success, string $error = ''): void {
    echo json_encode(['success' => $success, 'error' => $error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, 'Method not allowed.');
}

// Honeypot: a filled hidden field means a bot submitted the form.
if (!empty($_POST['website'])) {
    respond(true);
}

function field(string $key, int $maxLength = 2000): string {
    $value = trim((string)($_POST[$key] ?? ''));
    $value = str_replace(["\r", "\n"], ' ', $value); // header-injection guard for single-line fields
    return mb_substr($value, 0, $maxLength);
}

$name     = field('name', 150);
$business = field('business', 150);
$email    = trim((string)($_POST['email'] ?? ''));
$phone    = field('phone', 40);
$industry = field('industry', 100);
$plan     = field('plan', 100);
$interest = field('interest', 150);
$message  = trim((string)($_POST['message'] ?? ''));
$message  = mb_substr($message, 0, 4000);

if ($name === '' || $business === '' || $message === '') {
    http_response_code(422);
    respond(false, 'Please fill in your name, business, and message.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    respond(false, 'Please enter a valid email address.');
}

$subject = '[' . SITE_NAME . '] ' . ($interest !== '' ? $interest : 'New inquiry') . ' — ' . $business;

$lines = [
    "New inquiry from the Phoenix Reception website",
    "",
    "Name:      $name",
    "Business:  $business",
    "Email:     $email",
    "Phone:     " . ($phone !== '' ? $phone : '—'),
    "Industry:  " . ($industry !== '' ? $industry : '—'),
    "Plan:      " . ($plan !== '' ? $plan : '—'),
    "Interest:  " . ($interest !== '' ? $interest : '—'),
    "",
    "Message:",
    $message,
];
$body = implode("\n", $lines);

$headers = [
    'From: ' . SITE_NAME . ' Website <no-reply@' . preg_replace('/^www\./', '', (string)($_SERVER['HTTP_HOST'] ?? 'localhost')) . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = @mail(RECIPIENT_EMAIL, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(502);
    respond(false, 'We could not send your message. Please email us directly.');
}

respond(true);
