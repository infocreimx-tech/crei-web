"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PushNotificationManager from "@/components/PushNotificationManager";

export default function PwaNotificationGate() {
  const pathname = usePathname();
  const [shouldPrompt, setShouldPrompt] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    const launchedFromPwa = new URLSearchParams(window.location.search).get("source") === "pwa";
    const hasPortalSession = Boolean(localStorage.getItem("crei_session"));
    const isLoginScreen = /^\/(es|en)\/portal-terapeutas\/?$/.test(pathname);
    setShouldPrompt((standalone || launchedFromPwa) && hasPortalSession && !isLoginScreen);
  }, [pathname]);

  if (!shouldPrompt) return null;
  return <PushNotificationManager promptOnMount showControl={false} />;
}
