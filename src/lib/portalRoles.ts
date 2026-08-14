export type PortalRole = "superadmin" | "admin" | "therapist";

export function normalizePortalRole(role: unknown): PortalRole {
  const normalized = String(role || "").trim().toLocaleLowerCase("es-MX");
  if (normalized === "superadmin") return "superadmin";
  if (normalized === "admin") return "admin";
  return "therapist";
}

export function isAdministrativeRole(role: unknown) {
  const normalized = normalizePortalRole(role);
  return normalized === "admin" || normalized === "superadmin";
}

export function isSuperAdminRole(role: unknown) {
  return normalizePortalRole(role) === "superadmin";
}
