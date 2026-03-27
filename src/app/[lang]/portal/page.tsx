import PortalLogin from "@/components/PortalLogin";
import type { Locale } from "@/i18n/messages";

export default async function PortalPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return <PortalLogin lang={lang} />;
}
