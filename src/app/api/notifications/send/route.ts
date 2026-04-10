import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);



export async function POST(req: Request) {
  try {
    const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
    const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

    webpush.setVapidDetails(
      'mailto:infocreimx@gmail.com',
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );
    const { title, body, url } = await req.json();

    // Obtener todas las suscripciones de Supabase
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error || !subscriptions) {
      return NextResponse.json({ error: 'Error obteniendo suscripciones' }, { status: 500 });
    }

    const payload = JSON.stringify({
      title: title || 'Actualización CREI',
      body: body || 'Tienes una nueva alerta en el portal',
      url: url || '/es/app',
    });

    const sendPromises = subscriptions.map((sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.keys_auth,
          p256dh: sub.keys_p256dh,
        },
      };
      
      return webpush.sendNotification(pushSubscription, payload).catch((err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // El endpoint expiró, removerlo de Supabase
          return supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
        }
        console.error("Push send Error:", err);
      });
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true, sent: subscriptions.length });
  } catch (e) {
    console.error("Broadcast push error:", e);
    return NextResponse.json({ error: 'Error enviando notificaciones' }, { status: 500 });
  }
}
