export const ASSIGNABLE_THERAPIST_USERNAMES = [
  "Arturo",
  "Diego",
  "Gilberto",
  "Hector",
  "Martin",
  "Sergio",
  "Vilchis",
] as const;

function normalizedUsername(value: unknown) {
  return String(value || "").trim().toLocaleLowerCase("es-MX");
}

export function isAssignableTherapistUsername(value: unknown) {
  const normalized = normalizedUsername(value);
  return ASSIGNABLE_THERAPIST_USERNAMES.some(
    (username) => normalizedUsername(username) === normalized,
  );
}

