import type { Metadata } from "next";
import { notFound } from "next/navigation";
import I18nProvider from "@/i18n/I18nProvider";
import { getMessages, locales, type Locale } from "@/i18n/messages";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam === "en" ? "en" : langParam === "es" ? "es" : null;
  if (!lang) notFound();

  const isEn = lang === "en";
  const title = isEn ? "CREI | Comprehensive Emotional Restructuring Center" : "CREI | Centro de Reestructuración Emocional Integral";
  const description = isEn
    ? "Reshape your inner world. Premium mental health and addiction care."
    : "Reestructura tu mundo interior. Centro de salud mental y adicciones de élite.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        "es-MX": "/es",
        "en-US": "/en"
      }
    },
    openGraph: {
      locale: isEn ? "en_US" : "es_MX",
      title,
      description,
      url: `https://crei.mx/${lang}`
    }
  };
}

export default async function LangLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = langParam === "en" ? "en" : langParam === "es" ? "es" : null;
  if (!lang) notFound();

  const messages = getMessages(lang as Locale);

  return <I18nProvider lang={lang as Locale} messages={messages}>{children}</I18nProvider>;
}
