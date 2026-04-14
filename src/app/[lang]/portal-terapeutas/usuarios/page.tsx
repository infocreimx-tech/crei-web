"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ShieldCheck, Plus, Trash2, KeyRound,
  ToggleLeft, ToggleRight, Loader2, X, Check, AlertCircle,
  UserCog, Eye, EyeOff, RefreshCw
} from "lucide-react";

const API = "/api/usuarios";



interface Usuario {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
}

type ModalType = "crear" | "password" | "eliminar" | null;

// ── Colores por rol ───────────────────────────────────────────────────────────
const roleBadge = (role: string) =>
  role === "admin"
    ? { bg: "rgba(225,29,72,0.15)", border: "rgba(225,29,72,0.4)", color: "#fb7185" }
    : { bg: "rgba(124,92,191,0.15)", border: "rgba(124,92,191,0.4)", color: "#c4b5fd" };

const roleLabel = (role: string) => (role === "admin" ? "Admin" : "Terapeuta");

// ── Avatar inicial ────────────────────────────────────────────────────────────
function Avatar({ name, isAdmin }: { name: string; isAdmin: boolean }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
      style={{
        background: isAdmin
          ? "linear-gradient(135deg, #e11d48, #9f1239)"
          : "linear-gradient(135deg, #7c5cbf, #4a2c5e)",
        color: "#fbfaff",
        boxShadow: isAdmin
          ? "0 0 12px rgba(225,29,72,0.4)"
          : "0 0 12px rgba(124,92,191,0.4)",
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function UsuariosPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Form states
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("therapist");
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // ── Verificar acceso admin ─────────────────────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem("crei_session");
    if (!raw) { router.push("/es/portal-terapeutas/dashboard"); return; }
    try {
      const parsed = JSON.parse(raw);
      if (parsed.role !== "admin") {
        router.push("/es/portal-terapeutas/dashboard");
        return;
      }
      setCurrentUser(parsed.user || parsed.username || "Admin");
    } catch {
      router.push("/es/portal-terapeutas/dashboard");
    }
  }, [router]);

  // ── Cargar usuarios via API route (server-side, bypass RLS) ───────────────
  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (Array.isArray(data)) setUsuarios(data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Crear usuario via API route ───────────────────────────────────────────
  const handleCrear = async () => {
    if (!formUsername.trim() || !formPassword.trim()) {
      setFormError("Completa todos los campos."); return;
    }
    setSaving(true); setFormError("");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formUsername.trim(),
          password: formPassword.trim(),
          role: formRole,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al crear usuario.");
      showToast(`Usuario "${formUsername.trim()}" creado exitosamente.`);
      setModal(null); resetForm(); fetchUsuarios();
    } catch (e: any) {
      setFormError(e.message || "Error al crear usuario.");
    } finally { setSaving(false); }
  };

  // ── Cambiar contraseña via API route ─────────────────────────────────────
  const handleCambiarPassword = async () => {
    if (!formPassword.trim()) { setFormError("Ingresa la nueva contraseña."); return; }
    if (!selectedUser) return;
    setSaving(true); setFormError("");
    try {
      const res = await fetch(API, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser.id, password: formPassword.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al actualizar contraseña.");
      showToast(`Contraseña de "${selectedUser.username}" actualizada.`);
      setModal(null); resetForm();
    } catch (e: any) {
      setFormError(e.message || "Error al actualizar contraseña.");
    } finally { setSaving(false); }
  };

  // ── Toggle activo/inactivo via API route ─────────────────────────────────
  const handleToggleActive = async (u: Usuario) => {
    const res = await fetch(API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, is_active: !u.is_active }),
    });
    if (res.ok) {
      showToast(`${u.username} ${!u.is_active ? "activado" : "desactivado"}.`);
      fetchUsuarios();
    }
  };

  // ── Cambiar rol via API route ────────────────────────────────────────────────────
  const handleCambiarRol = async (u: Usuario) => {
    const newRole = u.role === "admin" ? "therapist" : "admin";
    const res = await fetch(API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, role: newRole }),
    });
    if (res.ok) {
      showToast(`Rol de "${u.username}" cambiado a ${newRole === "admin" ? "Admin" : "Terapeuta"}.`);
      fetchUsuarios();
    }
  };

  // ── Eliminar usuario via API route ──────────────────────────────────────────────
  const handleEliminar = async () => {
    if (!selectedUser) return;
    setSaving(true);
    const res = await fetch(API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedUser.id }),
    });
    if (res.ok) {
      showToast(`Usuario "${selectedUser.username}" eliminado.`, true);
      setModal(null); fetchUsuarios();
    } else {
      showToast("Error al eliminar.", false);
    }
    setSaving(false);
  };

  const resetForm = () => {
    setFormUsername(""); setFormPassword(""); setFormRole("therapist");
    setFormError(""); setShowPass(false);
  };

  const openModal = (type: ModalType, user?: Usuario) => {
    resetForm();
    setSelectedUser(user || null);
    setModal(type);
  };

  // ── Input style ─────────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    background: "rgba(20, 10, 35, 0.9)",
    border: "1px solid rgba(124,92,191,0.4)",
    color: "#fbfaff",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div className="min-h-screen" style={{ background: "#150b24" }}>

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold shadow-2xl transition-all"
          style={{
            background: toast.ok ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            border: `1px solid ${toast.ok ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
            color: toast.ok ? "#6ee7b7" : "#fca5a5",
            backdropFilter: "blur(16px)",
          }}
        >
          {toast.ok ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: "rgba(21, 11, 36, 0.9)",
          borderBottom: "1px solid rgba(225, 29, 72, 0.2)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/es" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9">
                <Image src="/logo-header.png" alt="CREI" fill className="object-contain" unoptimized priority />
              </div>
              <span className="text-lg font-serif font-bold" style={{ color: "#fbfaff" }}>CREI</span>
            </Link>

            <div className="w-px h-5" style={{ background: "rgba(159,134,192,0.25)" }} />

            <Link
              href="/es/portal-terapeutas/dashboard"
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-all hover:bg-white/10"
              style={{ color: "#c4b5fd", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(159,134,192,0.3)" }}
            >
              <ArrowLeft className="w-3 h-3" />
              Volver
            </Link>

            <div className="w-px h-5" style={{ background: "rgba(159,134,192,0.25)" }} />

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "#e11d48", boxShadow: "0 0 8px #e11d48" }} />
              <span className="font-serif font-bold text-sm" style={{ color: "#fbfaff" }}>
                Gestión de Usuarios
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold tracking-widest" style={{ color: "#fb7185" }}>
            <div
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{ background: "rgba(225,29,72,0.15)", border: "1px solid rgba(225,29,72,0.3)", color: "#fb7185" }}
            >
              Solo Admin — {currentUser}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24 relative">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(225,29,72,0.08) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,92,191,0.06) 0%, transparent 60%)" }} />

        {/* Header */}
        <div className="mb-10 flex items-center justify-between relative z-10">
          <div>
            <span className="block mb-2 text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: "#e11d48" }}>
              Panel de Administración
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2" style={{ color: "#fbfaff" }}>
              Usuarios del Sistema
            </h1>
            <p className="text-sm font-medium" style={{ color: "#c4b5fd" }}>
              {usuarios.length} cuenta{usuarios.length !== 1 ? "s" : ""} registrada{usuarios.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsuarios}
              className="p-2.5 rounded-full transition-all hover:bg-white/10"
              style={{ color: "#c4b5fd", border: "1px solid rgba(159,134,192,0.3)", background: "rgba(255,255,255,0.05)" }}
              title="Recargar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => openModal("crear")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #e11d48, #9f1239)",
                color: "#fff",
                boxShadow: "0 6px 20px rgba(225,29,72,0.4)",
              }}
            >
              <Plus className="w-4 h-4" />
              Nuevo Usuario
            </button>
          </div>
        </div>

        {/* ── Tabla / Cards ─────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#e11d48" }} />
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-32" style={{ color: "#7c5cbf" }}>
            <UserCog className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="font-semibold">No hay usuarios registrados.</p>
          </div>
        ) : (
          <div className="relative z-10 rounded-[2rem] overflow-hidden"
            style={{
              background: "rgba(30,15,45,0.85)",
              border: "1px solid rgba(159,134,192,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Table header — desktop */}
            <div
              className="hidden md:grid text-[10px] uppercase tracking-widest font-bold px-6 py-4"
              style={{
                gridTemplateColumns: "2.5rem 1fr 140px 120px 180px",
                gap: "1rem",
                borderBottom: "1px solid rgba(159,134,192,0.15)",
                color: "#9f86c0",
              }}
            >
              <span>#</span>
              <span>Usuario</span>
              <span>Rol</span>
              <span>Estado</span>
              <span className="text-right">Acciones</span>
            </div>

            {/* Rows */}
            {usuarios.map((u, i) => {
              const badge = roleBadge(u.role);
              return (
                <div
                  key={u.id}
                  className="flex flex-col md:grid items-start md:items-center gap-3 px-6 py-5 transition-colors hover:bg-white/[0.02]"
                  style={{
                    gridTemplateColumns: "2.5rem 1fr 140px 120px 180px",
                    gap: "1rem",
                    borderBottom: i < usuarios.length - 1 ? "1px solid rgba(159,134,192,0.1)" : "none",
                  }}
                >
                  {/* # */}
                  <span className="hidden md:block text-xs font-bold" style={{ color: "#7c5cbf" }}>{i + 1}</span>

                  {/* Avatar + username */}
                  <div className="flex items-center gap-3">
                    <Avatar name={u.username} isAdmin={u.role === "admin"} />
                    <div>
                      <p className="font-bold text-sm" style={{ color: "#fbfaff" }}>{u.username}</p>
                    </div>
                  </div>

                  {/* Rol badge */}
                  <div className="flex items-center">
                    <button
                      onClick={() => handleCambiarRol(u)}
                      title="Click para cambiar rol"
                      className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105"
                      style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}
                    >
                      {roleLabel(u.role)}
                    </button>
                  </div>

                  {/* Estado toggle */}
                  <div className="flex items-center">
                    <button
                      onClick={() => handleToggleActive(u)}
                      title={u.is_active ? "Click para desactivar" : "Click para activar"}
                      className="flex items-center gap-1.5 text-xs font-bold transition-all hover:scale-105"
                      style={{ color: u.is_active ? "#4ade80" : "#6b7280" }}
                    >
                      {u.is_active
                        ? <ToggleRight className="w-5 h-5" />
                        : <ToggleLeft className="w-5 h-5" />}
                      <span className="text-[10px] uppercase tracking-widest">{u.is_active ? "Activo" : "Inactivo"}</span>
                    </button>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-end gap-2">
                    {/* Cambiar contraseña */}
                    <button
                      onClick={() => openModal("password", u)}
                      title="Cambiar contraseña"
                      className="p-2 rounded-xl transition-all hover:scale-110"
                      style={{
                        background: "rgba(124,92,191,0.1)",
                        border: "1px solid rgba(124,92,191,0.3)",
                        color: "#c4b5fd",
                      }}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>

                    {/* Eliminar */}
                    <button
                      onClick={() => openModal("eliminar", u)}
                      title="Eliminar usuario"
                      className="p-2 rounded-xl transition-all hover:scale-110"
                      style={{
                        background: "rgba(225,29,72,0.1)",
                        border: "1px solid rgba(225,29,72,0.3)",
                        color: "#fb7185",
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Leyenda ───────────────────────────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap items-center gap-6 relative z-10">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: "#7c5cbf" }}>
            <div className="w-2 h-2 rounded-full bg-green-400" /> Activo
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: "#7c5cbf" }}>
            <KeyRound className="w-3 h-3 text-[#9f86c0]" /> Cambiar contraseña
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: "#7c5cbf" }}>
            <span className="text-[#fb7185] text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.25)" }}>Admin</span> Click en badge cambia el rol
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* MODALES                                                              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {modal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setModal(null); resetForm(); } }}
        >
          <div
            className="w-full max-w-md rounded-[2rem] p-8 relative"
            style={{
              background: "rgba(25, 12, 40, 0.98)",
              border: "1px solid rgba(159,134,192,0.25)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
            }}
          >
            {/* Close */}
            <button
              onClick={() => { setModal(null); resetForm(); }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: "#9f86c0" }}
            >
              <X className="w-4 h-4" />
            </button>

            {/* ── MODAL: CREAR ────────────────────────────────────────────── */}
            {modal === "crear" && (
              <>
                <div className="mb-6">
                  <span className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#e11d48" }}>Nuevo Registro</span>
                  <h2 className="text-2xl font-serif font-bold" style={{ color: "#fbfaff" }}>Crear Usuario</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#c4b5fd" }}>Usuario</label>
                    <input
                      style={inputStyle}
                      placeholder="Nombre de usuario"
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#c4b5fd" }}>Contraseña</label>
                    <div className="relative">
                      <input
                        style={{ ...inputStyle, paddingRight: "48px" }}
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        style={{ color: "#9f86c0" }}
                        type="button"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#c4b5fd" }}>Rol</label>
                    <select
                      style={{ ...inputStyle, cursor: "pointer" }}
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                    >
                      <option value="therapist">Terapeuta</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  {formError && (
                    <div className="flex items-center gap-2 text-sm rounded-xl p-3"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {formError}
                    </div>
                  )}

                  <button
                    onClick={handleCrear}
                    disabled={saving}
                    className="w-full py-4 rounded-full font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 mt-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #e11d48, #9f1239)",
                      color: "#fff",
                      boxShadow: "0 8px 25px rgba(225,29,72,0.4)",
                    }}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {saving ? "Creando..." : "Crear Usuario"}
                  </button>
                </div>
              </>
            )}

            {/* ── MODAL: CAMBIAR CONTRASEÑA ───────────────────────────────── */}
            {modal === "password" && selectedUser && (
              <>
                <div className="mb-6">
                  <span className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#7c5cbf" }}>Seguridad</span>
                  <h2 className="text-2xl font-serif font-bold mb-1" style={{ color: "#fbfaff" }}>Cambiar Contraseña</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar name={selectedUser.username} isAdmin={selectedUser.role === "admin"} />
                    <span className="font-semibold text-sm" style={{ color: "#c4b5fd" }}>{selectedUser.username}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#c4b5fd" }}>Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        style={{ ...inputStyle, paddingRight: "48px" }}
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        autoComplete="new-password"
                        autoFocus
                      />
                      <button
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        style={{ color: "#9f86c0" }}
                        type="button"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {formError && (
                    <div className="flex items-center gap-2 text-sm rounded-xl p-3"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {formError}
                    </div>
                  )}

                  <button
                    onClick={handleCambiarPassword}
                    disabled={saving}
                    className="w-full py-4 rounded-full font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 mt-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #7c5cbf, #4a2c5e)",
                      color: "#fff",
                      boxShadow: "0 8px 25px rgba(124,92,191,0.4)",
                    }}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    {saving ? "Guardando..." : "Actualizar Contraseña"}
                  </button>
                </div>
              </>
            )}

            {/* ── MODAL: ELIMINAR ─────────────────────────────────────────── */}
            {modal === "eliminar" && selectedUser && (
              <>
                <div className="mb-6 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.3)" }}>
                    <Trash2 className="w-7 h-7" style={{ color: "#e11d48" }} />
                  </div>
                  <h2 className="text-2xl font-serif font-bold mb-2" style={{ color: "#fbfaff" }}>Eliminar Usuario</h2>
                  <p className="text-sm" style={{ color: "#c4b5fd" }}>
                    ¿Estás seguro de eliminar a <span className="font-bold" style={{ color: "#fb7185" }}>{selectedUser.username}</span>?
                    Esta acción no se puede deshacer.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setModal(null); resetForm(); }}
                    className="flex-1 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all hover:bg-white/10"
                    style={{ color: "#9f86c0", border: "1px solid rgba(159,134,192,0.3)" }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEliminar}
                    disabled={saving}
                    className="flex-1 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #e11d48, #9f1239)",
                      color: "#fff",
                      boxShadow: "0 6px 20px rgba(225,29,72,0.4)",
                    }}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    {saving ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
