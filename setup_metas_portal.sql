-- Tabla para almacenar las metas de los pacientes
CREATE TABLE IF NOT EXISTS public.metas_pacientes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  texto text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('diaria', 'semanal', 'mensual')),
  completada boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Seguridad de Nivel de Fila (RLS)
ALTER TABLE public.metas_pacientes ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad (El paciente solo ve y edita sus propias metas)
CREATE POLICY "Pacientes pueden ver sus metas"
  ON public.metas_pacientes FOR SELECT
  USING (auth.uid() = paciente_id);

CREATE POLICY "Pacientes pueden crear metas"
  ON public.metas_pacientes FOR INSERT
  WITH CHECK (auth.uid() = paciente_id);

CREATE POLICY "Pacientes pueden actualizar sus metas"
  ON public.metas_pacientes FOR UPDATE
  USING (auth.uid() = paciente_id);

CREATE POLICY "Pacientes pueden borrar sus metas"
  ON public.metas_pacientes FOR DELETE
  USING (auth.uid() = paciente_id);
