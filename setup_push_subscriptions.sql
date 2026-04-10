-- Creación de la tabla de suscripciones Push
CREATE TABLE push_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- opcional, por si queremos vincular a usuario logueado
  endpoint TEXT NOT NULL UNIQUE,
  keys_auth TEXT NOT NULL,
  keys_p256dh TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de Seguridad RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede insertar/crear su suscripción (incluso anónimos)
CREATE POLICY "Allow anonymous inserts"
  ON push_subscriptions FOR INSERT 
  TO public
  WITH CHECK (true);

-- Solo admins o roles autenticados pueden ver todas (Opcional, depende de uso)
CREATE POLICY "Allow view for authenticated"
  ON push_subscriptions FOR SELECT
  TO authenticated
  USING (true);

-- Solo el dueño o anónimo de esa subscripción puede borrarla (o dejar sin política restrictiva por ahora)
CREATE POLICY "Allow updates and deletes"
  ON push_subscriptions FOR DELETE
  TO public
  USING (true);
