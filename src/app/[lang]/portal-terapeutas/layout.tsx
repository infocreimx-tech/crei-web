import type { Metadata } from "next";
import PwaNotificationGate from "@/components/PwaNotificationGate";

export const metadata: Metadata = {
  manifest: "/portal-terapeutas.webmanifest",
  appleWebApp: {
    capable: true,
    title: "CREI Portal Clínico",
    statusBarStyle: "black-translucent",
  },
};

export default function TherapistPortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <PwaNotificationGate />
      {children}
    </>
  );
}
