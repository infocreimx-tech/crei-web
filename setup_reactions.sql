-- Tabla para guardar el conteo de cada emoji por artículo
CREATE TABLE IF NOT EXISTS comunidad_reactions (
    slug TEXT PRIMARY KEY,
    reaction_love INT DEFAULT 0,  -- ❤️
    reaction_like INT DEFAULT 0,  -- 👍
    reaction_laugh INT DEFAULT 0, -- 😂
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Opcional pero recomendado para Supabase)
-- ALTER TABLE comunidad_reactions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Cualquiera puede leer" ON comunidad_reactions FOR SELECT USING (true);
-- Las inserciones se manejarán usando service_role a través de la API, o usando el RPC de abajo.

-- Función atómica para evitar condición de carrera cuando varios den like a la vez
CREATE OR REPLACE FUNCTION increment_reaction(target_slug TEXT, reaction_type TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Intentar insertar la fila si el artículo aún no existía
    INSERT INTO comunidad_reactions (slug)
    VALUES (target_slug)
    ON CONFLICT (slug) DO NOTHING;

    -- Incrementar basado en el emoji enviado (tipo)
    IF reaction_type = 'love' THEN
        UPDATE comunidad_reactions SET reaction_love = reaction_love + 1, updated_at = NOW() WHERE slug = target_slug;
    ELSIF reaction_type = 'like' THEN
        UPDATE comunidad_reactions SET reaction_like = reaction_like + 1, updated_at = NOW() WHERE slug = target_slug;
    ELSIF reaction_type = 'laugh' THEN
        UPDATE comunidad_reactions SET reaction_laugh = reaction_laugh + 1, updated_at = NOW() WHERE slug = target_slug;
    END IF;
END;
$$;
