import PortalRegister from "@/components/PortalRegister";
import type { Locale } from "@/i18n/messages";

export async function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

export default async function RegistroPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return <PortalRegister lang={lang} />;
}
