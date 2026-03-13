export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export type Messages = Record<string, string>;

const es: Messages = {
  "portal.title": "Portal del Paciente",
  "portal.subtitle":
    "Accede a tu historial, gestiona tus citas y mantén comunicación directa con tu especialista en un entorno seguro y confidencial.",
  "portal.backToHome": "Volver al inicio",
  "portal.back": "Volver",
  "portal.welcomeBack": "Bienvenido de nuevo",
  "portal.signInPrompt": "Ingresa tus credenciales para acceder",
  "portal.emailLabel": "Correo Electrónico o ID de Paciente",
  "portal.emailPlaceholder": "ej. paciente@crei.mx",
  "portal.password": "Contraseña",
  "portal.forgotPassword": "¿Olvidaste tu contraseña?",
  "portal.showPassword": "Mostrar contraseña",
  "portal.hidePassword": "Ocultar contraseña",
  "portal.signIn": "Iniciar Sesión",
  "portal.firstTime": "¿Es tu primera vez?",
  "portal.contactAdmin": "Contacta a administración",
  "portal.toActivate": "para activar tu cuenta.",
  "portal.imageAlt": "Consultorio de terapia cálido y profesional",
  "portal.loginSimulated": "Funcionalidad de login simulada"
};

const en: Messages = {
  "portal.title": "Patient Portal",
  "portal.subtitle":
    "Access your history, manage appointments, and communicate securely with your specialist in a confidential environment.",
  "portal.backToHome": "Back to home",
  "portal.back": "Back",
  "portal.welcomeBack": "Welcome back",
  "portal.signInPrompt": "Sign in with your credentials",
  "portal.emailLabel": "Email Address or Patient ID",
  "portal.emailPlaceholder": "e.g., patient@crei.mx",
  "portal.password": "Password",
  "portal.forgotPassword": "Forgot your password?",
  "portal.showPassword": "Show password",
  "portal.hidePassword": "Hide password",
  "portal.signIn": "Sign In",
  "portal.firstTime": "First time here?",
  "portal.contactAdmin": "Contact administration",
  "portal.toActivate": "to activate your account.",
  "portal.imageAlt": "Warm, professional therapy office",
  "portal.loginSimulated": "Simulated login functionality"
};

export function getMessages(locale: Locale): Messages {
  return locale === "en" ? en : es;
}
