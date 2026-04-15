-- Migration to add CRM status columns to crei_valoraciones
ALTER TABLE public.crei_valoraciones 
ADD COLUMN IF NOT EXISTS asignado TEXT,
ADD COLUMN IF NOT EXISTS fecha_llamada DATE,
ADD COLUMN IF NOT EXISTS contesto TEXT,
ADD COLUMN IF NOT EXISTS nivel_urgencia TEXT,
ADD COLUMN IF NOT EXISTS valoracion_presencial TEXT,
ADD COLUMN IF NOT EXISTS quien_acude TEXT,
ADD COLUMN IF NOT EXISTS precio_estimado TEXT,
ADD COLUMN IF NOT EXISTS observaciones_llamada TEXT,
ADD COLUMN IF NOT EXISTS tratamiento TEXT,
ADD COLUMN IF NOT EXISTS compra_curso TEXT;

-- Update RLS if needed (assuming public access already exists for this table based on process.php)
-- If RLS is enabled, you might need:
-- ALTER TABLE public.crei_valoraciones ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow management for therapists" ON public.crei_valoraciones FOR ALL USING (true);
