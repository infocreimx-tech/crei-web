<?php
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// CRON QUINCENAL - ESTE ARCHIVO ES EL QUE EJECUTA LA TAREA AUTOMÁTICA
// No se manda llamar con botones mortales. Hostinger lo consultará de fondo automáticamente cada 15 días.

$supabase_url = "https://uywihjppwzrrfjkguvot.supabase.co/rest/v1/terapias";
$supabase_key = "sb_publishable_oW-4o2d_roO8yYzTwHdIww_gjO0hL1S"; 

// Determinar la quincena actual basado en el día de ejecución
$diaActual = (int)date("d");
$mesActual = date("Y-m");

if ($diaActual <= 15) {
    // Si corre el día 15 (o antes), es la primera quincena
    $desde = $mesActual . "-01";
    $hasta = $mesActual . "-15";
} else {
    // Si corre a fin de mes (día 28, 30, 31), es la segunda quincena
    $desde = $mesActual . "-16";
    $hasta = date("Y-m-t"); // 't' da el último día del mes actual
}

// Consulta a Supabase vía API REST (Monto, CREI $, Terapeuta $) en ese rango.
$url = $supabase_url . "?fecha=gte." . $desde . "&fecha=lte." . $hasta . "&select=monto,crei_monto,ter_monto";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "apikey: $supabase_key",
    "Authorization: Bearer $supabase_key"
));
$response = curl_exec($ch);
curl_close($ch);

$terapias = json_decode($response, true);

$total = 0; 
$crei = 0; 
$ter = 0;

if(is_array($terapias)) {
    foreach($terapias as $t) {
        $total += (float)$t['monto'];
        $crei += (float)$t['crei_monto'];
        $ter += (float)$t['ter_monto'];
    }
}

// Configuración Fija de Prueba
$to_emails = ["lulu@crei.mx", "karen@crei.mx"];
$subject = "Corte Quincenal Automático de Terapias ($desde a $hasta)";

$totalF = "$" . number_format($total, 2);
$creiF = "$" . number_format($crei, 2);
$terF = "$" . number_format($ter, 2);

$html = "
<html>
<body style='font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 20px; margin: 0;'>
    <div style='max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);'>
        
        <div style='background-color: #059669; padding: 24px; text-align: center; border-bottom: 4px solid #10b981;'>
            <h1 style='color: white; margin: 0; font-size: 22px;'>Reporte Automático Semestral / Quincenal</h1>
            <p style='color: #d1fae5; margin: 4px 0 0 0; font-size: 14px;'>Sistema Hostinger CRON — CREI</p>
        </div>

        <div style='padding: 30px;'>
            <p style='margin-top: 0; color: #475569;'>Este es el resumen automatizado por Hostinger recolectando todos los comprobantes médicos en el periodo de <strong>{$desde}</strong> hasta el <strong>{$hasta}</strong>.</p>
            
            <div style='margin: 24px 0; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #ecfdf5;'>
                <h2 style='margin: 0 0 8px 0; font-size: 24px; color: #064e3b;'>Suma Bruta Registrada: {$totalF}</h2>
                <div style='height: 1px; background: #6ee7b7; margin: 12px 0;'></div>
                <h3 style='margin: 0 0 8px 0; font-size: 18px; color: #059669;'>Ingresos CREI (Neto): {$creiF}</h3>
                <h3 style='margin: 0; font-size: 18px; color: #8b5cf6;'>Pagos a Terapeutas: {$terF}</h3>
            </div>

            <p style='color: #94a3b8; font-size: 12px; text-align: center; margin-bottom: 0;'>Este es un informe automático que no requiere respuesta.</p>
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
    $mail->setFrom('resumenfinanciero@crei.mx', 'Finanzas Bot CREI');
    foreach ($to_emails as $email) {
        $mail->addAddress($email);
    }

    // Contenido
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $html;

    $mail->send();
    echo "[$hasta] CRON ejecutado exitosamente. Email enviado a la bandeja.\n";
} catch (Exception $e) {
    echo "[$hasta] ERROR: Ocurrió una falla conectando al SMTP. Mailer Error: {$mail->ErrorInfo}\n";
}
?>
