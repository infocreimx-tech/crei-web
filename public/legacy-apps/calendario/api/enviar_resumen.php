<?php
header('Content-Type: application/json; charset=utf-8');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos']);
    exit;
}

$mes = $data['mes'] ?? 'N/A';
$terapeuta = $data['terapeuta'] ?? 'Todos';
$activas = $data['activas'] ?? 0;
$canceladas = $data['canceladas'] ?? 0;

$to = "lulu@crei.mx, mel@crei.mx";
$subject = "Resumen Mensual de Terapias - $mes ($terapeuta)";
$from = "terapias@crei.mx";

$html = "
<html>
<head><title>Resumen Mensual de Terapias</title></head>
<body style='font-family: Arial, sans-serif; color: #333;'>
    <h2 style='color: #2563eb;'>Resumen de Terapias</h2>
    <p><strong>Mes:</strong> $mes</p>
    <p><strong>Terapeuta(s):</strong> $terapeuta</p>
    <table border='1' cellpadding='15' cellspacing='0' style='border-collapse: collapse; margin-top: 20px; text-align: center;'>
        <tr style='background-color: #f1f5f9;'>
            <th style='color: #059669;'>Terapias Dadas (Activas)</th>
            <th style='color: #e11d48;'>Terapias Canceladas</th>
        </tr>
        <tr>
            <td style='font-size: 24px; font-weight: bold; color: #059669;'>$activas</td>
            <td style='font-size: 24px; font-weight: bold; color: #e11d48;'>$canceladas</td>
        </tr>
    </table>
    <p style='margin-top: 40px; font-size: 11px; color: #94a3b8;'>Este correo es generado automáticamente por el sistema del Calendario Clínico.</p>
</body>
</html>
";

function sendSMTPMail($host, $port, $username, $password, $from, $to, $subject, $body) {
    $socket = fsockopen("ssl://" . $host, $port, $errno, $errstr, 15);
    if (!$socket) return false;

    function serverParse($socket, $expected_response) {
        $server_response = '';
        while (substr($server_response, 3, 1) != ' ') {
            if (!($server_response = fgets($socket, 256))) return false;
        }
        if (!(substr($server_response, 0, 3) == $expected_response)) return false;
        return true;
    }

    serverParse($socket, '220');

    fwrite($socket, "EHLO " . $host . "\r\n");
    serverParse($socket, '250');

    fwrite($socket, "AUTH LOGIN\r\n");
    serverParse($socket, '334');

    fwrite($socket, base64_encode($username) . "\r\n");
    serverParse($socket, '334');

    fwrite($socket, base64_encode($password) . "\r\n");
    serverParse($socket, '235');

    fwrite($socket, "MAIL FROM: <" . $from . ">\r\n");
    serverParse($socket, '250');

    $recipients = explode(',', $to);
    foreach ($recipients as $email) {
        fwrite($socket, "RCPT TO: <" . trim($email) . ">\r\n");
        serverParse($socket, '250');
    }

    fwrite($socket, "DATA\r\n");
    serverParse($socket, '354');

    $headers = "From: CREI Calendario <$from>\r\n";
    $headers .= "To: $to\r\n";
    $headers .= "Subject: $subject\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    fwrite($socket, $headers . "\r\n" . $body . "\r\n.\r\n");
    serverParse($socket, '250');

    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    return true;
}

// Datos de acceso de Hostinger SMTP
$host = "smtp.hostinger.com";
$port = 465;
$username = "terapias@crei.mx";
$password = "Terapias123.";

$success = sendSMTPMail($host, $port, $username, $password, $from, $to, $subject, $html);

if ($success) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo enviar el correo mediante SMTP Hostinger.']);
}
