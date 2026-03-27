<?php
require __DIR__ . '/db.php';
header('Content-Type: text/html; charset=UTF-8');
?>
<!doctype html>
<meta charset="utf-8">
<title>DB Test</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:2rem;line-height:1.5;color:#0f172a}
  code{background:#f1f5f9;padding:.15rem .35rem;border-radius:.35rem}
  table{border-collapse:collapse;margin-top:1rem}
  th,td{border:1px solid #e2e8f0;padding:.5rem .6rem}
  th{background:#f8fafc}
</style>
<?php
echo '<h1>Prueba de conexión e inserción</h1>';
try{
  $pdo=db();
  echo '<p>Conexión: <strong style="color:#16a34a">OK</strong></p>';
  $pdo->exec('CREATE TABLE IF NOT EXISTS gastos (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, usuario VARCHAR(64) NOT NULL, correo VARCHAR(160) NOT NULL, concepto VARCHAR(160) NOT NULL, importe DECIMAL(10,2) NOT NULL, tipo VARCHAR(32) NOT NULL, archivo_path VARCHAR(255) NOT NULL, archivo_mime VARCHAR(128) NULL, creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
  $stmt=$pdo->prepare('INSERT INTO gastos(usuario,correo,concepto,importe,tipo,archivo_path,archivo_mime) VALUES(?,?,?,?,?,?,?)');
  $concepto='Prueba '.date('Y-m-d H:i:s');
  $stmt->execute(['Prueba','gastos@crei.mx',$concepto,12.34,'Ticket','uploads/test.txt','text/plain']);
  $id=$pdo->lastInsertId();
  echo '<p>Inserción: <strong style="color:#16a34a">OK</strong> (ID '.$id.')</p>';
  $rows=$pdo->query('SELECT id,usuario,correo,concepto,importe,tipo,creado_en FROM gastos ORDER BY id DESC LIMIT 5')->fetchAll();
  echo '<table><tr><th>ID</th><th>Usuario</th><th>Correo</th><th>Concepto</th><th>Importe</th><th>Tipo</th><th>Creado</th></tr>';
  foreach($rows as $r){
    echo '<tr><td>'.htmlspecialchars($r['id']).'</td><td>'.htmlspecialchars($r['usuario']).'</td><td>'.htmlspecialchars($r['correo']).'</td><td>'.htmlspecialchars($r['concepto']).'</td><td>$'.number_format((float)$r['importe'],2).'</td><td>'.htmlspecialchars($r['tipo']).'</td><td>'.$r['creado_en'].'</td></tr>';
  }
  echo '</table>';
}catch(Throwable $e){
  echo '<p>Conexión/Inserción: <strong style="color:#dc2626">ERROR</strong></p>';
  echo '<pre>'.htmlspecialchars($e->getMessage()).'</pre>';
  $hint = [
    'DB_HOST'=>getenv('DB_HOST')?:($_SERVER['DB_HOST']??null),
    'DB_NAME'=>getenv('DB_NAME')?:($_SERVER['DB_NAME']??null),
    'DB_USER'=>getenv('DB_USER')?:($_SERVER['DB_USER']??null),
    'DB_PORT'=>getenv('DB_PORT')?:($_SERVER['DB_PORT']??null),
  ];
  echo '<p>Variables detectadas (sin contraseña):</p><ul>';
  foreach($hint as $k=>$v){echo '<li><code>'.$k.'</code>=<code>'.htmlspecialchars($v??'NULL').'</code></li>';}
  echo '</ul>';
}
echo '<p style="margin-top:1rem;color:#64748b">Elimina este archivo tras la prueba.</p>';
?>
