import type { Report, ReportStatus } from "./types";

const REPORTS_KEY = "dt_reports";

/** Base64 data URLs grow fast; keep a conservative cap so a few reports still fit in ~5MB. */
const MAX_IMAGE_DATA_URL_CHARS = 280_000;

function isQuotaError(e: unknown): boolean {
  return (
    e instanceof DOMException &&
    (e.name === "QuotaExceededError" ||
      e.code === 22 ||
      // Safari / older
      (e as { code?: number }).code === 1014)
  );
}

function normalizeReport(raw: Report): Report {
  return {
    ...raw,
    hasImage: raw.hasImage ?? !!raw.imageDataUrl,
    hasVideo: raw.hasVideo ?? !!raw.videoDataUrl,
  };
}

/** Never persist video data URLs (too large). Optionally keep a small image. */
function toPersistedReport(r: Report): Report {
  const imageOk =
    r.imageDataUrl &&
    r.imageDataUrl.length > 0 &&
    r.imageDataUrl.length <= MAX_IMAGE_DATA_URL_CHARS;

  return {
    ...r,
    hasImage: r.hasImage ?? !!r.imageDataUrl,
    hasVideo: r.hasVideo ?? !!r.videoDataUrl,
    videoDataUrl: null,
    imageDataUrl: imageOk ? r.imageDataUrl : null,
  };
}

function read(): Report[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Report[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((r) => normalizeReport(r));
  } catch {
    return [];
  }
}

function write(reports: Report[]) {
  const slim = reports.map(toPersistedReport);
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(slim));
    return;
  } catch (e) {
    if (!isQuotaError(e)) throw e;
  }

  const noImages = slim.map((r) => ({
    ...r,
    imageDataUrl: null,
    videoDataUrl: null,
  }));
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(noImages));
    return;
  } catch (e2) {
    if (!isQuotaError(e2)) throw e2;
  }

  const minimal = noImages.map((r) => ({
    ...r,
    comment: r.comment.length > 500 ? `${r.comment.slice(0, 500)}…` : r.comment,
  }));
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(minimal));
  } catch (e3) {
    if (!isQuotaError(e3)) throw e3;
    throw new Error(
      "Browser storage is full. Clear site data for this app or remove old reports.",
    );
  }
}

export function getReports(): Report[] {
  return read().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getReportById(id: string): Report | null {
  return read().find((r) => r.id === id) ?? null;
}

export function addReport(report: Report) {
  const list = read();
  list.push(normalizeReport(report));
  write(list);
}

export function reportId(): string {
  return `RPT-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function isInProgressStatus(s: ReportStatus): boolean {
  return s === "pending" || s === "under_review";
}
