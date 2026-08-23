// Presentation layer for PerfTrack AI.
// Status and series colours are validated for colour-vision deficiency
// (worst all-pairs CVD deltaE 13.0 for statuses, 9.2 for chart series).

export const STATUS = {
  PENDING:     { label: "Not started", color: "#eda100", soft: "#fdf3dc", ink: "#7a5300" },
  IN_PROGRESS: { label: "In progress", color: "#2a78d6", soft: "#e4eefb", ink: "#1b4d8a" },
  SUBMITTED:   { label: "Awaiting review", color: "#4a3aa7", soft: "#e8e6f7", ink: "#332a73" },
  COMPLETED:   { label: "Approved", color: "#008300", soft: "#e0f0e0", ink: "#005400" },
};

export const STATUS_ORDER = ["PENDING", "IN_PROGRESS", "SUBMITTED", "COMPLETED"];

export const statusOf = (s) => STATUS[s] || STATUS.PENDING;

/** Chart series — first three validated slots. */
export const SERIES = {
  score:      "#4a3aa7",
  completion: "#2a78d6",
  onTime:     "#eb6834",
  quality:    "#1baf7a",
};

/**
 * Performance bands. The same thresholds the backend uses for warnings,
 * so the UI never disagrees with the score it is showing.
 */
export function band(score) {
  if (score >= 80) return { label: "Good",     color: "#008300", soft: "#e0f0e0", ink: "#005400" };
  if (score >= 70) return { label: "Average",  color: "#eda100", soft: "#fdf3dc", ink: "#7a5300" };
  if (score >= 50) return { label: "Low",      color: "#ec835a", soft: "#fdeae2", ink: "#8f3f1c" };
  return              { label: "Critical", color: "#d03b3b", soft: "#fbe6e6", ink: "#a12525" };
}

export const TREND = {
  Improving: { label: "Improving", ink: "#005400", soft: "#e0f0e0", arrow: "M10 15V5M6 9l4-4 4 4" },
  Declining: { label: "Declining", ink: "#a12525", soft: "#fbe6e6", arrow: "M10 5v10M6 11l4 4 4-4" },
  Stable:    { label: "Stable",    ink: "#4a5565", soft: "#eef1f5", arrow: "M5 10h10" },
};
export const trendOf = (t) =>
  TREND[t] || { label: t || "No data", ink: "#4a5565", soft: "#eef1f5", arrow: "M5 10h10" };

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
