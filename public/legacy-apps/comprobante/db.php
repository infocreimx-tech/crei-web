<?php
function db(){
    // CONFIGURACIÓN MANUAL DIRECTA (Para descartar errores de lectura de archivos)
    $host = 'localhost'; 
    $name = 'u404859780_comprobantes';
    $user = 'u404859780_comprobante';
    $pass = 'Comp20bantes#'; // Revisa que no tenga espacios al final
    $port = '3306';

    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";
    
    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (PDOException $e) {
        // Si falla con 'localhost', intenta cambiar la variable $host arriba a '127.0.0.1'
        throw new RuntimeException("Error: " . $e->getMessage());
    }
}