<?php
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');
header('Content-Security-Policy: default-src \'none\'; style-src \'self\' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src \'self\' data:;');

function loadEnv($file){
  if(!file_exists($file)) return;
  $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach($lines as $line){
    $trim = ltrim($line);
    if($trim==='' || $trim[0]==='#') continue;
    $pos = strpos($line,'=');
    if($pos===false) continue;
    $key = trim(substr($line,0,$pos));
    $val = trim(substr($line,$pos+1));
    $val = trim($val, "\"'");
    if($key!==''){
      putenv("$key=$val");
      $_ENV[$key] = $val;
      $_SERVER[$key] = $val;
    }
  }
}
loadEnv(__DIR__.'/.env');

function v($k){return isset($_POST[$k]) ? trim((is_array($_POST[$k])?implode(', ', array_map('trim', $_POST[$k])):$_POST[$k])) : '';}
function s($k){return htmlspecialchars(v($k), ENT_QUOTES, 'UTF-8');}

$quien = v('quien_ayuda');
$nombre_contacto = v('nombre_contacto');
$email = v('email');
$telefono = v('telefono');
$fecha_nacimiento = v('fecha_nacimiento');
$ciudad_pais = v('ciudad_pais');
$nombre_persona = v('nombre_persona');
$sustancias = v('sustancias');
$sustancias_otro = v('sustancias_otro');
$tiempo = v('tiempo_problema');
$frecuencia = v('frecuencia');
$tratamiento_antes = v('tratamiento_antes');
$tratamientos = v('tratamientos');
$tratamientos_otro = v('tratamientos_otro');
$medio = v('medio_conocio');
$medio_otro = v('medio_otro');
$internamientos = v('internamientos');
$lugares_previos = v('lugares_previos');
$inversion = v('inversion');
$ayuda_buscada = v('ayuda_buscada');
$urgencia = v('urgencia');

$to = 'cambiar@tu-dominio.com';
$subject = 'Nueva valoración confidencial';
$body = "Quien pide ayuda: $quien\n".
        "Nombre contacto: $nombre_contacto\n".
        "Email: $email\n".
        "Teléfono: $telefono\n".
        "Fecha de nacimiento: $fecha_nacimiento\n".
        "Ciudad y país: $ciudad_pais\n".
        "Nombre de la persona: $nombre_persona\n".
        "Sustancias: $sustancias\n".
        "Sustancias (otro): $sustancias_otro\n".
        "Tiempo del problema: $tiempo\n".
        "Frecuencia: $frecuencia\n".
        "Tratamiento antes: $tratamiento_antes\n".
        "Tratamientos: $tratamientos\n".
        "Tratamientos (otro): $tratamientos_otro\n".
        "Medio por el que conoció: $medio\n".
        "Medio (otro): $medio_otro\n".
        "Internamientos: $internamientos\n".
        "Lugares de ayuda previos: $lugares_previos\n".
        "Inversión aproximada: $inversion\n".
        "Tipo de ayuda buscada: $ayuda_buscada\n".
        "Urgencia (1-5): $urgencia\n".
        "Fecha de envío: ".date('Y-m-d H:i:s');
$headers = "From: notificaciones@".$_SERVER['HTTP_HOST']."\r\n".
           "Reply-To: ".$email."\r\n".
           "Content-Type: text/plain; charset=UTF-8\r\n";

@mail($to, $subject, $body, $headers);

$dir = __DIR__ . DIRECTORY_SEPARATOR . 'data';
if(!is_dir($dir)) mkdir($dir, 0755, true);
$file = $dir . DIRECTORY_SEPARATOR . 'submissions.csv';
$isNew = !file_exists($file);
$fp = fopen($file, 'a');
if($fp){
  if($isNew){
    fputcsv($fp, ['fecha_envio','quien_ayuda','nombre_contacto','email','telefono','fecha_nacimiento','ciudad_pais','nombre_persona','sustancias','sustancias_otro','tiempo_problema','frecuencia','tratamiento_antes','tratamientos','tratamientos_otro','medio_conocio','medio_otro','internamientos','lugares_previos','inversion','ayuda_buscada','urgencia']);
  }
  fputcsv($fp, [date('c'),$quien,$nombre_contacto,$email,$telefono,$fecha_nacimiento,$ciudad_pais,$nombre_persona,$sustancias,$sustancias_otro,$tiempo,$frecuencia,$tratamiento_antes,$tratamientos,$tratamientos_otro,$medio,$medio_otro,$internamientos,$lugares_previos,$inversion,$ayuda_buscada,$urgencia]);
  fclose($fp);
}

$db_host = getenv('DB_HOST');
$db_name = getenv('DB_NAME');
$db_user = getenv('DB_USER');
$db_pass = getenv('DB_PASS');
$db_table = getenv('DB_TABLE') ?: 'crei_valoraciones';
if($db_host && $db_name && $db_user && $db_pass){
  try{
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",$db_user,$db_pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
    $sql = "INSERT INTO $db_table
    (fecha_envio,quien_ayuda,nombre_contacto,email,telefono,fecha_nacimiento,ciudad_pais,nombre_persona,sustancias,sustancias_otro,tiempo_problema,frecuencia,tratamiento_antes,tratamientos,tratamientos_otro,medio_conocio,medio_otro,internamientos,lugares_previos,inversion,ayuda_buscada,urgencia,created_at)
    VALUES (NOW(),:quien_ayuda,:nombre_contacto,:email,:telefono,:fecha_nacimiento,:ciudad_pais,:nombre_persona,:sustancias,:sustancias_otro,:tiempo_problema,:frecuencia,:tratamiento_antes,:tratamientos,:tratamientos_otro,:medio_conocio,:medio_otro,:internamientos,:lugares_previos,:inversion,:ayuda_buscada,:urgencia,NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':quien_ayuda'=>$quien,
      ':nombre_contacto'=>$nombre_contacto,
      ':email'=>$email,
      ':telefono'=>$telefono,
      ':fecha_nacimiento'=>$fecha_nacimiento?:null,
      ':ciudad_pais'=>$ciudad_pais,
      ':nombre_persona'=>$nombre_persona?:null,
      ':sustancias'=>$sustancias,
      ':sustancias_otro'=>$sustancias_otro?:null,
      ':tiempo_problema'=>$tiempo,
      ':frecuencia'=>$frecuencia,
      ':tratamiento_antes'=>$tratamiento_antes,
      ':tratamientos'=>$tratamientos?:null,
      ':tratamientos_otro'=>$tratamientos_otro?:null,
      ':medio_conocio'=>$medio?:null,
      ':medio_otro'=>$medio_otro?:null,
      ':internamientos'=>$internamientos?:null,
      ':lugares_previos'=>$lugares_previos?:null,
      ':inversion'=>$inversion?:null,
      ':ayuda_buscada'=>$ayuda_buscada?:null,
      ':urgencia'=>$urgencia!==''?$urgencia:null
    ]);
  }catch(Exception $e){
  }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gracias</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root{--bg:#0b0d12;--card:#121621;--text:#e7ecf5;--muted:#8b93a7;--primary:#6a7bff;--primary2:#9c68ff}
    body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(1200px 600px at 10% -20%, #1e1b3e 0%, transparent 60%), radial-gradient(1000px 500px at 120% -40%, #1b2736 0%, transparent 60%), var(--bg);font-family:Inter,system-ui}
    .card{background:var(--card);border:1px solid #1e2333;border-radius:16px;max-width:560px;padding:28px;color:var(--text);box-shadow:0 20px 60px rgba(0,0,0,.35);margin:20px}
    h1{margin:0 0 10px 0}
    p{color:var(--muted)}
    .btn{display:inline-block;margin-top:18px;padding:12px 16px;border-radius:10px;background:linear-gradient(90deg,var(--primary),var(--primary2));color:white;text-decoration:none;font-weight:700}
    .resume{margin-top:18px;font-size:14px}
    .resume b{color:#fff}
  </style>
  <meta http-equiv="refresh" content="12; url=./index.html">
</head>
<body>
  <div class="card">
    <h1>Registro recibido</h1>
    <p>Gracias. Tu información fue enviada de forma confidencial. Nuestro equipo te contactará lo antes posible.</p>
    <div class="resume">
      <div><b>Nombre:</b> <?php echo s('nombre_contacto'); ?></div>
      <div><b>Correo:</b> <?php echo s('email'); ?></div>
      <div><b>Teléfono:</b> <?php echo s('telefono'); ?></div>
    </div>
    <a class="btn" href="./index.html">Volver al formulario</a>
  </div>
</body>
</html>

