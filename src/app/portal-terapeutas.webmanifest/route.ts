import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(
    {
      id: "/es/portal-terapeutas/",
      name: "CREI Portal Clínico",
      short_name: "CREI Clínico",
      description: "Agenda clínica, expedientes y eventos importantes del equipo CREI.",
      start_url: "/es/portal-terapeutas/dashboard?source=pwa",
      scope: "/es/portal-terapeutas/",
      display: "standalone",
      background_color: "#150b24",
      theme_color: "#150b24",
      icons: [
        {
          src: "/app-logo.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/app-logo.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/manifest+json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
