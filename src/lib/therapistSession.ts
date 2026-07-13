import crypto from "crypto";
import { getTherapistSessionSecret } from "@/lib/serverSupabaseConfig";

export const THERAPIST_COOKIE = "crei_therapist_session";

export type TherapistSession = {
  id: string;
  username: string;
  role: "admin" | "therapist";
  exp: number;
};

function secret() {
  return getTherapistSessionSecret();
}

export function signTherapistSession(input: Omit<TherapistSession, "exp">) {
  const payload: TherapistSession = { ...input, exp: Date.now() + 8 * 60 * 60 * 1000 };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyTherapistSession(token?: string | null): TherapistSession | null {
  if (!token) return null;
  try {
    const [encoded, supplied] = token.split(".");
    if (!encoded || !supplied) return null;
    const expected = crypto.createHmac("sha256", secret()).update(encoded).digest("base64url");
    const suppliedBuffer = Buffer.from(supplied);
    const expectedBuffer = Buffer.from(expected);
    if (suppliedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)) return null;
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as TherapistSession;
    if (!payload.id || !payload.username || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
