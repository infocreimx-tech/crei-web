"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkSubscription();
    } else {
      setLoading(false);
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const subscribeButton = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Permiso denegado");
      }

      const registration = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error("VAPID KEY is missing");

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      // Guardar en Supabase a traves del API Route
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      if (response.ok) {
        setIsSubscribed(true);
      } else {
        throw new Error("Error guardando suscripción en base de datos");
      }
    } catch (e) {
      console.error(e);
      alert("No se pudieron activar las notificaciones. " + e);
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={subscribeButton}
      disabled={loading || isSubscribed}
      title={isSubscribed ? "Notificaciones Activadas" : "Activar Notificaciones"}
      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all disabled:opacity-50"
      style={{
        color: isSubscribed ? "#34d399" : "#d8b4e2",
        border: `1px solid ${isSubscribed ? "rgba(52, 211, 153, 0.3)" : "rgba(159, 134, 192, 0.3)"}`,
        background: isSubscribed ? "rgba(52, 211, 153, 0.1)" : "transparent"
      }}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isSubscribed ? (
        <Bell className="w-4 h-4" />
      ) : (
        <BellOff className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">{isSubscribed ? "Activas" : "Alertas"}</span>
    </button>
  );
}
