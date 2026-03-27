<?php
require __DIR__ . '/db.php';
function bad($m){http_response_code(400);echo '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.14/dist/tailwind.min.css" rel="stylesheet"><body class="bg-slate-50 min-h-screen flex items-center justify-center p-6"><div class="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-8 text-center"><div class="text-rose-600 text-2xl font-bold mb-3">Error</div><p class="text-slate-700">'.htmlspecialchars($m).'</p><a class="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-800 text-white px-5 py-3 font-semibold" href="index.php">Volver</a></div></body></html>';exit;}
if($_SERVER['REQUEST_METHOD']!=='POST') bad('Solicitud inválida');
$usuario=isset($_POST['usuario'])?trim($_POST['usuario']):'';$correo=isset($_POST['correo'])?trim($_POST['correo']):'';$concepto=isset($_POST['concepto'])?trim($_POST['concepto']):'';$importe=isset($_POST['importe'])?trim($_POST['importe']):'';$tipo=isset($_POST['tipo'])?trim($_POST['tipo']):'';
if($usuario===''||$correo===''||$concepto===''||$importe===''||$tipo==='') bad('Completa todos los campos obligatorios');
if(!filter_var($correo,FILTER_VALIDATE_EMAIL)) bad('Correo no válido');
if(!is_numeric($importe)||$importe<0) bad('El importe no es válido');
if(!isset($_FILES['comprobante'])||$_FILES['comprobante']['error']!==UPLOAD_ERR_OK) bad('Archivo no recibido');
$f=$_FILES['comprobante'];$allowed=['pdf','jpg','jpeg','png'];$ext=strtolower(pathinfo($f['name'],PATHINFO_EXTENSION));
if(!in_array($ext,$allowed)) bad('Tipo de archivo no permitido');
if($f['size']>10*1024*1024) bad('El archivo supera 10MB');
$dir=__DIR__ . '/uploads';if(!is_dir($dir)) mkdir($dir,0755,true);
$base=preg_replace('/[^A-Za-z0-9_\-\.]/','_',basename($f['name']));$dest=uniqid('cmp_').'_'.($base?:('archivo.'.$ext));$path=$dir.'/'.$dest;
if(!move_uploaded_file($f['tmp_name'],$path)) bad('No se pudo guardar el archivo');
$rel='uploads/'.$dest;$mime=mime_content_type($path)?:$f['type'];
try{$pdo=db();}catch(Throwable $e){bad('Conexión a base de datos fallida');}
$pdo->exec('CREATE TABLE IF NOT EXISTS gastos (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, usuario VARCHAR(64) NOT NULL, correo VARCHAR(160) NOT NULL, concepto VARCHAR(160) NOT NULL, importe DECIMAL(10,2) NOT NULL, tipo VARCHAR(32) NOT NULL, archivo_path VARCHAR(255) NOT NULL, archivo_mime VARCHAR(128) NULL, creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
try{$pdo->exec('ALTER TABLE gastos ADD COLUMN correo VARCHAR(160) NOT NULL');}catch(Throwable $e){}
$stmt=$pdo->prepare('INSERT INTO gastos(usuario,correo,concepto,importe,tipo,archivo_path,archivo_mime) VALUES(?,?,?,?,?,?,?)');
$stmt->execute([$usuario,$correo,$concepto,number_format((float)$importe,2,'.',''),$tipo,$rel,$mime]);
if(isset($_SERVER['HTTP_HOST'])){
 $scheme=(!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off')?'https':'http';
 $base=$scheme.'://'.$_SERVER['HTTP_HOST'].rtrim(dirname($_SERVER['SCRIPT_NAME']),'/\\');
}else{$base='';}
$link=$base?($base.'/'.ltrim($rel,'/')):$rel;
$to=$correo;
$subject='Copia de tu registro de gasto';
$body="<div style=\"font-family:Arial,sans-serif;color:#0f172a\"><h2 style=\"margin:0 0 12px\">Registro de gasto</h2><p><strong>Usuario:</strong> ".htmlspecialchars($usuario)."</p><p><strong>Concepto:</strong> ".htmlspecialchars($concepto)."</p><p><strong>Importe:</strong> $".number_format((float)$importe,2)."</p><p><strong>Tipo:</strong> ".htmlspecialchars($tipo)."</p><p><strong>Comprobante:</strong> <a href=\"".$link."\">Ver archivo</a></p><p style=\"margin-top:16px;color:#475569\">Gracias.</p></div>";
$headers="MIME-Version: 1.0\r\nContent-type: text/html; charset=UTF-8\r\nFrom: No-Reply <no-reply@".($_SERVER['HTTP_HOST']??'localhost').">\r\n";
@mail($to,$subject,$body,$headers);
header('Location: index.php?ok=1');exit;
