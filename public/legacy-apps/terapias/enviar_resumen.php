<?php
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Recibir la data de la pantalla del administrador (index.html)
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    die(json_encode(["success" => false, "msg" => "No recibimos datos del frontend."]));
}

// Configuración Fija de Prueba
$to_emails = ["lulu@crei.mx", "mel@crei.mx"];
$subject = "Corte Manual de Terapias CREI";

// Extraer variables calculadas por el admin
$total  = $data["total"] ?? "$0.00";
$crei   = $data["crei"] ?? "$0.00";
$ter    = $data["ter"] ?? "$0.00";
$semana = $data["semana"] ?? "-";

$html = "
<html>
<body style='font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 20px; margin: 0;'>
    <div style='max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);'>
        
        <div style='background-color: #1e1b4b; padding: 24px; text-align: center; border-bottom: 4px solid #4f46e5;'>
            <h1 style='color: white; margin: 0; font-size: 22px;'>Reporte Financiero C.R.E.I</h1>
            <p style='color: #a5b4fc; margin: 4px 0 0 0; font-size: 14px;'>Envío Manual Solicitado por Administrador</p>
        </div>

        <div style='padding: 30px;'>
            <p style='margin-top: 0; color: #475569;'>A continuación se despliega el resumen solicitado en pantalla. Evaluando ingresos de la semana (<strong>{$semana}</strong>).</p>
            
            <div style='margin: 24px 0; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #f8fafc;'>
                <h2 style='margin: 0 0 8px 0; font-size: 24px; color: #0f172a;'>Total Físico: {$total}</h2>
                <div style='height: 1px; background: #e2e8f0; margin: 12px 0;'></div>
                <h3 style='margin: 0 0 8px 0; font-size: 18px; color: #059669;'>Ganancia Fondo CREI: {$crei}</h3>
                <h3 style='margin: 0; font-size: 18px; color: #8b5cf6;'>Nómina Terapeutas: {$ter}</h3>
            </div>

            <p style='color: #94a3b8; font-size: 12px; text-align: center; margin-bottom: 0;'>Enviado de forma segura desde los servidores de Hostinger (Módulo de Terapias).</p>
        </div>
    </div>
</body>
</html>
";

$mail = new PHPMailer(true);
try {
    // Configuración del servidor
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'resumenfinanciero@crei.mx';
    $mail->Password   = 'Resumen123.';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    // Destinatarios
    $mail->setFrom('resumenfinanciero@crei.mx', 'Resumen Financiero CREI');
    foreach ($to_emails as $email) {
        $mail->addAddress($email);
    }

    // Contenido
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $html;

    $mail->send();
    echo json_encode(["success" => true, "msg" => "Correo enviado exitosamente."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "msg" => "La función SMTP no pudo completar la solicitud. Mailer Error: {$mail->ErrorInfo}"]);
}
?>
