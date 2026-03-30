-- 1. Crear la tabla de Gastos (Comprobantes)
CREATE TABLE IF NOT EXISTS gastos (
    id BIGINT PRIMARY KEY,
    usuario TEXT NOT NULL,
    correo TEXT NOT NULL,
    concepto TEXT NOT NULL,
    importe NUMERIC(10,2) NOT NULL,
    tipo TEXT NOT NULL,
    archivo_path TEXT,
    archivo_mime TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    historial JSONB DEFAULT '[]'::jsonb
);

-- 2. Habilitar la seguridad RLS en la tabla
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;

-- 3. Crear directrices libres (para pruebas y simplicidad inicial, todos pueden leer/escribir. El Front-End maneja el filtro)
CREATE POLICY "Permitir acceso universal a gastos" ON gastos
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 4. Crear el Bucket de Almacenamiento para los comprobantes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('comprobantes', 'comprobantes', true, 10485760, ARRAY['image/jpeg', 'image/png', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Dar acceso público de lectura y escritura al Bucket
CREATE POLICY "Acceso publico comprobantes" ON storage.objects
    FOR ALL
    USING (bucket_id = 'comprobantes')
    WITH CHECK (bucket_id = 'comprobantes');
