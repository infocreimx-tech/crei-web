import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Suscripción inválida' }, { status: 400 });
    }

    // Guardar en la base de datos de Supabase
    const { error } = await supabase.from('push_subscriptions').upsert({
      endpoint: subscription.endpoint,
      keys_auth: subscription.keys.auth,
      keys_p256dh: subscription.keys.p256dh,
    }, { onConflict: 'endpoint' });

    if (error) {
      console.error("DB Error:", error);
      return NextResponse.json({ error: 'Error guardando en Supabase' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Suscripción guardada exitosamente.' });
  } catch (err) {
    console.error("Subs Error:", err);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
