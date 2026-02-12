import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import StarfallOverlay from "@/components/StarfallOverlay";
import CookieConsent from "@/components/CookieConsent";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CREI | Centro de Reestructuración Emocional Integral",
  description: "Reestructura tu mundo interior. Centro de salud mental de élite.",
  keywords: [
    "salud mental",
    "adicciones",
    "psicoterapia",
    "psiquiatría",
    "terapia de pareja",
    "rehabilitación",
    "ansiedad",
    "depresión",
    "trauma",
    "México"
  ],
  metadataBase: new URL("https://crei.mx"),
  alternates: {
    canonical: "https://crei.mx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://crei.mx",
    siteName: "CREI",
    title: "CREI | Centro de Reestructuración Emocional Integral",
    description: "Reestructura tu mundo interior. Centro de salud mental de élite.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "CREI Centro de Reestructuración Emocional Integral",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@CREI",
    creator: "@CREI",
    title: "CREI | Centro de Reestructuración Emocional Integral",
    description: "Reestructura tu mundo interior. Centro de salud mental de élite.",
    images: ["https://images.unsplash.com/photo-1573497019236-17f8177b81e8?q=80&w=1200&auto=format&fit=crop"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground font-sans relative`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalClinic",
              name: "CREI | Centro de Reestructuración Emocional Integral",
              url: "https://crei.mx",
              logo: "https://crei.mx/favicon.ico",
              sameAs: [
                "https://www.facebook.com/",
                "https://www.instagram.com/",
                "https://www.linkedin.com/"
              ],
              address: {
                "@type": "PostalAddress",
                addressCountry: "MX"
              },
              description: "Centro de salud mental y adicciones con enfoque clínico integral.",
              medicalSpecialty: [
                "Psychiatry",
                "MentalHealth",
                "Addiction"
              ],
              availableService: [
                {
                  "@type": "MedicalProcedure",
                  name: "Psicoterapia Individual"
                },
                {
                  "@type": "MedicalProcedure",
                  name: "Psiquiatría de Enlace"
                },
                {
                  "@type": "MedicalProcedure",
                  name: "Intervención en Crisis"
                }
              ]
            })
          }}
        />
        {/* Global Noise Overlay */}
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{/* removed pre-hydration html mutations to avoid hydration mismatch */}catch(e){}})();",
          }}
        />
        <StarfallOverlay />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
