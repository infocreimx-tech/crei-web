import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PaulinaPatientRegistry from "@/components/PaulinaPatientRegistry";
import {
  THERAPIST_COOKIE,
  verifyTherapistSession,
} from "@/lib/therapistSession";

export const dynamic = "force-dynamic";

export default async function PaulinaPatientsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = langParam === "en" ? "en" : "es";
  const cookieStore = await cookies();
  const session = verifyTherapistSession(
    cookieStore.get(THERAPIST_COOKIE)?.value,
  );

  if (!session) redirect(`/${lang}/portal-terapeutas`);
  const isPaulina =
    session.username.trim().toLocaleLowerCase("es-MX") === "paulina";
  if (!isPaulina && session.role !== "admin") {
    redirect(`/${lang}/portal-terapeutas/dashboard`);
  }

  return (
    <PaulinaPatientRegistry
      lang={lang}
      therapistName={session.username}
      canCreate={isPaulina}
    />
  );
}
