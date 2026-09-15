import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AssignedPatientsInbox from "@/components/AssignedPatientsInbox";
import { isAssignableTherapistUsername } from "@/lib/assignableTherapists";
import {
  THERAPIST_COOKIE,
  verifyTherapistSession,
} from "@/lib/therapistSession";

export const dynamic = "force-dynamic";

export default async function AssignedPatientsPage({
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
  if (!isAssignableTherapistUsername(session.username)) {
    redirect(`/${lang}/portal-terapeutas/dashboard`);
  }

  return (
    <AssignedPatientsInbox lang={lang} therapistName={session.username} />
  );
}

