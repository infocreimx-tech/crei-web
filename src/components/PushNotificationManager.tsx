"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Clock3, Loader2, ShieldCheck } from "lucide-react";

type PushNotificationManagerProps = {
  promptOnMount?: boolean;
  showControl?: boolean;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((character) => character.charCodeAt(0)));
}

async function saveSubscription(subscription: PushSubscription) {
  const response = await fetch("/api/notifications/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription.toJSON()),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || "No fue posible guardar la suscripción.");
  }
}

export default function PushNotificationManager({
  promptOnMount = false,
  showControl = true,
}: PushNotificationManagerProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(promptOnMount);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function prepare() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        if (active) {
          setMessage("Este navegador no admite notificaciones Push. Abre el portal en Chrome, Edge o Safari actualizado.");
          setShowPrompt(promptOnMount);
          setLoading(false);
        }
        return;
      }

      try {
        setIsSupported(true);
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          if (active) {
            setIsSubscribed(false);
            setShowPrompt(promptOnMount);
          }
          return;
        }

        await saveSubscription(subscription);
        if (active) {
          setIsSubscribed(true);
          setShowPrompt(false);
        }
      } catch (error) {
        if (active) {
          setIsSubscribed(false);
          setShowPrompt(promptOnMount);
          setMessage(error instanceof Error ? error.message : "No fue posible verificar las notificaciones.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    prepare();
    return () => {
      active = false;
    };
  }, [promptOnMount]);

  useEffect(() => {
    function syncSubscriptionState(event: Event) {
      const subscribed = Boolean((event as CustomEvent<{ subscribed?: boolean }>).detail?.subscribed);
      setIsSubscribed(subscribed);
      setShowPrompt(promptOnMount && !subscribed);
    }

    window.addEventListener("crei-push-subscription-change", syncSubscriptionState);
    return () => window.removeEventListener("crei-push-subscription-change", syncSubscriptionState);
  }, [promptOnMount]);

  async function enableSubscription() {
    setLoading(true);
    setMessage("");
    try {
      if (!isSupported) {
        throw new Error("Este navegador no admite notificaciones Push.");
      }
      if (Notification.permission === "denied") {
        throw new Error("Las notificaciones están bloqueadas. Habilítalas desde la configuración del navegador y vuelve a intentarlo.");
      }

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      let createdNow = false;

      if (!subscription) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          throw new Error("Debes autorizar las notificaciones para recibir los avisos de tus eventos.");
        }

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) throw new Error("Falta configurar la clave pública VAPID.");
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
        createdNow = true;
      }

      try {
        await saveSubscription(subscription);
      } catch (error) {
        if (createdNow) await subscription.unsubscribe();
        throw error;
      }

      setIsSubscribed(true);
      setShowPrompt(false);
      setMessage("Recibirás los avisos de 30, 15 y 5 minutos en este dispositivo.");
      window.dispatchEvent(new CustomEvent("crei-push-subscription-change", { detail: { subscribed: true } }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible activar las alertas.");
      if (promptOnMount) setShowPrompt(true);
    } finally {
      setLoading(false);
    }
  }

  async function disableSubscription() {
    setLoading(true);
    setMessage("");
    try {
      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      if (existing) {
        const endpoint = existing.endpoint;
        await existing.unsubscribe();
        await fetch("/api/notifications/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });
      }
      setIsSubscribed(false);
      setMessage("Alertas desactivadas en este dispositivo.");
      window.dispatchEvent(new CustomEvent("crei-push-subscription-change", { detail: { subscribed: false } }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible desactivar las alertas.");
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported && !showPrompt) return null;

  return (
    <>
      {showControl && isSupported && (
        <div className="relative">
          <button
            type="button"
            onClick={isSubscribed ? disableSubscription : enableSubscription}
            disabled={loading}
            title={isSubscribed ? "Desactivar notificaciones en este dispositivo" : "Activar notificaciones"}
            className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            style={{
              color: isSubscribed ? "#34d399" : "#d8b4e2",
              borderColor: isSubscribed ? "rgba(52,211,153,.3)" : "rgba(159,134,192,.3)",
              background: isSubscribed ? "rgba(52,211,153,.1)" : "transparent",
            }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isSubscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            <span className="hidden sm:inline">{isSubscribed ? "Alertas activas" : "Activar alertas"}</span>
          </button>
          {message && (
            <p className="absolute right-0 top-full z-[70] mt-2 w-72 rounded-xl border border-white/10 bg-[#241432] p-3 text-[11px] normal-case leading-relaxed text-[#ede7f7] shadow-xl">
              {message}
            </p>
          )}
        </div>
      )}

      {promptOnMount && showPrompt && (
        <div className="fixed inset-0 z-[160] grid place-items-center overflow-y-auto bg-[#160b25]/85 p-4 backdrop-blur-md">
          <section role="dialog" aria-modal="true" aria-labelledby="push-title" className="my-6 w-full max-w-lg overflow-hidden rounded-[2rem] border border-[#d8c9e8] bg-white shadow-2xl">
            <div className="bg-gradient-to-br from-[#2f2144] via-[#3d2b57] to-[#20152f] px-7 py-8 text-white">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-amber-300/30 bg-amber-300/10 text-amber-200">
                <Bell className="h-7 w-7" />
              </div>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[.2em] text-amber-200">Paso necesario</p>
              <h2 id="push-title" className="mt-2 font-serif text-3xl font-bold">Activa las notificaciones</h2>
              <p className="mt-3 text-sm leading-6 text-violet-100/80">Para usar Eventos importantes y no perder una reunión, autoriza los avisos en este dispositivo.</p>
            </div>

            <div className="space-y-5 p-7 text-[#392d48]">
              <div className="grid grid-cols-3 gap-2">
                {[30, 15, 5].map((minutes) => (
                  <div key={minutes} className="rounded-2xl border border-[#e6ddeb] bg-[#faf8fc] p-3 text-center">
                    <Clock3 className="mx-auto h-4 w-4 text-[#7c5cbf]" />
                    <b className="mt-2 block text-sm">{minutes} min</b>
                    <span className="text-[10px] text-[#7d7187]">antes</span>
                  </div>
                ))}
              </div>

              <p className="flex items-start gap-2 text-xs leading-5 text-[#6b6075]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> Solo recibirás avisos de los eventos asignados a tu perfil.</p>

              {message && <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-900">{message}</div>}

              <button
                type="button"
                onClick={enableSubscription}
                disabled={loading || !isSupported}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7650b7] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                {loading ? "Verificando dispositivo…" : "Activar notificaciones"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
