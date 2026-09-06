// Presentation layer for PerfTrack — "Midnight Precision".
//
// Colour is a signal here, not decoration: the interface is monochrome
// and hue only ever means status. Every value is tuned for the #08090b
// ground and kept distinguishable under common colour-vision deficiencies.

export const STATUS = {
  PENDING:     { label: "Not started",     color: "#8b929c", soft: "rgba(139,146,156,.10)", ink: "#9aa1ab" },
  IN_PROGRESS: { label: "In progress",     color: "#7aa2f7", soft: "rgba(122,162,247,.10)", ink: "#96b7ff" },
  SUBMITTED:   { label: "Awaiting review", color: "#c8a45c", soft: "rgba(200,164,92,.10)",  ink: "#d9bb80" },
  COMPLETED:   { label: "Approved",        color: "#4ade80", soft: "rgba(74,222,128,.10)",  ink: "#6ee7a0" },
};

export const STATUS_ORDER = ["PENDING", "IN_PROGRESS", "SUBMITTED", "COMPLETED"];

export const statusOf = (s) => STATUS[s] || STATUS.PENDING;

/** Chart and meter colours. The headline series is plain white on purpose. */
export const SERIES = {
  score:      "#e8eaed",
  completion: "#e8eaed",
  onTime:     "#8b929c",
  quality:    "#8b929c",
};

/**
 * Performance bands. Same thresholds the backend uses for warnings,
 * so the UI never disagrees with the score it is showing.
 */
export function band(score) {
  if (score >= 80) return { label: "Good",     color: "#4ade80", soft: "rgba(74,222,128,.10)",  ink: "#6ee7a0" };
  if (score >= 70) return { label: "Average",  color: "#c8a45c", soft: "rgba(200,164,92,.10)",  ink: "#d9bb80" };
  if (score >= 50) return { label: "Low",      color: "#f0a35e", soft: "rgba(240,163,94,.10)",  ink: "#f5bb85" };
  return              { label: "Critical", color: "#f0656f", soft: "rgba(240,101,111,.10)", ink: "#f68d95" };
}

export const TREND = {
  Improving: { label: "Improving", ink: "#6ee7a0", soft: "rgba(74,222,128,.10)",  arrow: "M10 15V5M6 9l4-4 4 4" },
  Declining: { label: "Declining", ink: "#f68d95", soft: "rgba(240,101,111,.10)", arrow: "M10 5v10M6 11l4 4 4-4" },
  Stable:    { label: "Stable",    ink: "#9aa1ab", soft: "rgba(139,146,156,.10)", arrow: "M5 10h10" },
};
export const trendOf = (t) =>
  TREND[t] || { label: t || "No data", ink: "#9aa1ab", soft: "rgba(139,146,156,.10)", arrow: "M5 10h10" };

export const pct = (n) => `${Math.round(Number(n) || 0)}%`;

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value.length <= 10 ? value + "T00:00:00" : value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function isOverdue(dueDate, status) {
  if (!dueDate || status === "COMPLETED") return false;
  const d = new Date(dueDate + "T00:00:00");
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}
