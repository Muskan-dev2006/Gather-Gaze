const MINUTES_PER_HOUR = 60;

export default function formatCookTime(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return "Time not set";

  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const remainingMinutes = minutes % MINUTES_PER_HOUR;
  if (!hours) return `${minutes} min`;
  if (!remainingMinutes) return `${hours} hr${hours === 1 ? "" : "s"}`;
  return `${hours} hr${hours === 1 ? "" : "s"} ${remainingMinutes} min`;
}
