import PortalLogin from "@/components/PortalLogin";
import type { Locale } from "@/i18n/messages";

export default function PortalPage({ params }: { params: { lang: Locale } }) {
  return <PortalLogin lang={params.lang} />;
}
