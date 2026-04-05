"use client";

import dynamic from "next/dynamic";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { AppShell } from "@/components/app-shell";
import { getReportById } from "@/lib/report-storage";
import type { Report } from "@/lib/types";

const ReportMap = dynamic(() => import("@/components/map/report-map"), {
  ssr: false,
  loading: () => <div className="min-h-[180px] animate-pulse rounded-xl bg-slate-200" />,
});

function statusLabel(s: Report["status"]) {
  switch (s) {
    case "pending":
      return "Pending";
    case "under_review":
      return "Under review";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return s;
  }
}

function statusStyles(s: Report["status"]) {
  switch (s) {
    case "approved":
      return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-500/30";
    case "rejected":
      return "bg-red-100 text-red-900";
    case "under_review":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const report = useMemo(() => (id ? getReportById(id) : null), [id]);

  if (!report) {
    return (
      <AuthGate>
        <AppShell title="Report" backHref="/reports">
          <p className="text-sm text-slate-600">Report not found.</p>
          <button
            type="button"
            onClick={() => router.push("/reports")}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </button>
        </AppShell>
      </AuthGate>
    );
  }

  const reportedAtLabel = new Date(report.reportedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <AuthGate>
      <AppShell title="Report details" backHref="/reports">
        <div className="flex flex-col gap-5 pb-6">
          <div
            className={`rounded-2xl px-4 py-3 text-center text-sm font-semibold ${statusStyles(report.status)}`}
          >
            Status: {statusLabel(report.status)}
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Location
            </p>
            <ReportMap lat={report.lat} lng={report.lng} className="w-full" />
          </div>

          <dl className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 text-sm">
            <div>
              <dt className="text-slate-500">Offence</dt>
              <dd className="font-medium text-slate-900">{report.offenceType}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Vehicle number</dt>
              <dd className="font-medium text-slate-900">{report.vehicleNumber}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Report time</dt>
              <dd className="font-medium text-slate-900">{reportedAtLabel}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Submitted</dt>
              <dd className="text-slate-800">
                {new Date(report.createdAt).toLocaleString()}
              </dd>
            </div>
            {report.comment ? (
              <div>
                <dt className="text-slate-500">Details</dt>
                <dd className="text-slate-800">{report.comment}</dd>
              </div>
            ) : null}
          </dl>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Evidence</p>
            <div className="flex flex-col gap-3">
              {report.imageDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={report.imageDataUrl}
                  alt="Evidence"
                  className="max-h-64 w-full rounded-xl border border-slate-200 object-contain"
                />
              ) : report.hasImage ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  Photo was included but not kept in browser storage (size limit). A future
                  upload API will store this.
                </p>
              ) : null}
              {report.videoDataUrl ? (
                <video
                  src={report.videoDataUrl}
                  controls
                  className="w-full rounded-xl border border-slate-200"
                />
              ) : report.hasVideo ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  Video was included but is not saved locally (too large for browser
                  storage). It will be uploaded when the API is available.
                </p>
              ) : null}
              {!report.imageDataUrl &&
              !report.videoDataUrl &&
              !report.hasImage &&
              !report.hasVideo ? (
                <p className="text-sm text-slate-500">No media stored.</p>
              ) : null}
            </div>
          </div>

          <Link
            href="/reports"
            className="flex items-center justify-center gap-2 text-center text-sm font-medium text-emerald-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all reports
          </Link>
        </div>
      </AppShell>
    </AuthGate>
  );
}
