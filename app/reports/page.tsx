"use client";

import { CheckCircle2, ClipboardList, Loader } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { AppShell } from "@/components/app-shell";
import { getReports, isInProgressStatus } from "@/lib/report-storage";
import type { Report } from "@/lib/types";

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

export default function ReportsPage() {
  const [tab, setTab] = useState<"progress" | "done">("progress");
  const reports = useMemo(() => getReports(), []);

  const filtered = useMemo(() => {
    return reports.filter((r) =>
      tab === "progress" ? isInProgressStatus(r.status) : !isInProgressStatus(r.status),
    );
  }, [reports, tab]);

  return (
    <AuthGate>
      <AppShell title="Reported offence" backHref="/home">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex rounded-xl bg-police-900/10 p-1 ring-1 ring-police-800/10">
            <button
              type="button"
              onClick={() => setTab("progress")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition ${
                tab === "progress"
                  ? "bg-white text-police-900 shadow-sm ring-1 ring-emerald-600/25"
                  : "text-slate-600"
              }`}
            >
              <Loader className="h-4 w-4 text-emerald-600" />
              In progress
            </button>
            <button
              type="button"
              onClick={() => setTab("done")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition ${
                tab === "done"
                  ? "bg-white text-police-900 shadow-sm ring-1 ring-emerald-600/25"
                  : "text-slate-600"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Done
            </button>
          </div>

          <p className="text-center text-sm text-slate-600">
            {filtered.length} report{filtered.length === 1 ? "" : "s"}
          </p>

          <ul className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <li className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                No reports in this tab yet.
              </li>
            ) : (
              filtered.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/reports/${encodeURIComponent(r.id)}`}
                    className="block rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition hover:border-police-600/40 hover:shadow-md active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="flex items-start gap-2 font-semibold text-slate-900">
                          <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          {r.offenceType}
                        </p>
                        <p className="truncate text-sm text-slate-600">{r.vehicleNumber}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(r.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        {statusLabel(r.status)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </AppShell>
    </AuthGate>
  );
}
