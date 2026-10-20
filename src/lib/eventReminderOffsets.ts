export const EVENT_REMINDER_MINUTES = [1440, 60, 30, 15, 5] as const;

export function formatEventReminderOffset(minutes: number) {
  if (minutes === 1440) return "1 día";
  if (minutes === 60) return "1 hora";
  return `${minutes} minutos`;
}
