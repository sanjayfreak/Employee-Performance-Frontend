// Presentation layer for PerfTrack AI — dark theme.
// Status and series colours are picked for contrast on a #060912 ground
// and kept distinguishable under common colour-vision deficiencies.

export const STATUS = {
  PENDING:     { label: "Not started",    color: "#F5B33C", soft: "rgba(245,179,60,.14)",  ink: "#F8CC7A" },
  IN_PROGRESS: { label: "In progress",    color: "#4C9AFF", soft: "rgba(76,154,255,.16)",  ink: "#96C4FF" },
  SUBMITTED:   { label: "Awaiting review",color: "#A78BFA", soft: "rgba(167,139,250,.18)", ink: "#CBBAFD" },
  COMPLETED:   { label: "Approved",       color: "#34D399", soft: "rgba(52,211,153,.15)",  ink: "#7BE7BE" },
};

export const STATUS_ORDER = ["PENDING", "IN_PROGRESS", "SUBMITTED", "COMPLETED"];

export const statusOf = (s) => STATUS[s] || STATUS.PENDING;

/** Chart series — tuned for a dark ground. */
export const SERIES = {
  score:      "#A78BFA",
  completion: "#4C9AFF",
  onTime:     "#FB923C",
  quality:    "#34D399",
};

/**
 * Performance bands. The same thresholds the backend uses for warnings,
 * so the UI never disagrees with the score it is showing.
 */
export function band(score) {
  if (score >= 80) return { label: "Good",     color: "#34D399", soft: "rgba(52,211,153,.15)",  ink: "#7BE7BE" };
  if (score >= 70) return { label: "Average",  color: "#F5B33C", soft: "rgba(245,179,60,.15)",  ink: "#F8CC7A" };
  if (score >= 50) return { label: "Low",      color: "#FB923C", soft: "rgba(251,146,60,.15)",  ink: "#FDBE8A" };
  return              { label: "Critical", color: "#F87171", soft: "rgba(248,113,113,.15)", ink: "#FCA5A5" };
}

export const TREND = {
  Improving: { label: "Improving", ink: "#7BE7BE", soft: "rgba(52,211,153,.15)",  arrow: "M10 15V5M6 9l4-4 4 4" },
  Declining: { label: "Declining", ink: "#FCA5A5", soft: "rgba(248,113,113,.15)", arrow: "M10 5v10M6 11l4 4 4-4" },
  Stable:    { label: "Stable",    ink: "#A9B4C7", soft: "rgba(148,163,184,.14)", arrow: "M5 10h10" },
};
export const trendOf = (t) =>
  TREND[t] || { label: t || "No data", ink: "#A9B4C7", soft: "rgba(148,163,184,.14)", arrow: "M5 10h10" };

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
