import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/messages";

export default async function FondoPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/portal-terapeutas/dashboard`);
}
