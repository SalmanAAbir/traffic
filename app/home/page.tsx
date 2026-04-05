"use client";

import { AlertTriangle, ClipboardList } from "lucide-react";
import Link from "next/link";
import { AuthGate } from "@/components/auth-gate";
import { AppShell } from "@/components/app-shell";

export default function HomePage() {
  return (
    <AuthGate>
      <AppShell title="Home">
        <div className="flex flex-1 flex-col gap-5">
          <p className="text-center text-[0.9375rem] font-medium leading-relaxed text-slate-700">
            Report unsafe traffic behaviour or follow up on what you’ve submitted.
          </p>

          <div className="rounded-3xl border border-emerald-200/80 bg-white/90 p-5 shadow-[0_12px_40px_-12px_rgba(5,150,105,0.35)] ring-1 ring-emerald-100">
            <div className="flex flex-col gap-4">
              <Link
                href="/report"
                className="relative flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 px-6 py-[1.15rem] text-center text-lg font-bold text-white shadow-[0_10px_28px_-4px_rgba(4,120,87,0.65),inset_0_1px_0_0_rgba(255,255,255,0.22)] ring-2 ring-emerald-300/50 transition hover:brightness-105 active:scale-[0.98]"
              >
                <AlertTriangle
                  className="relative h-7 w-7 shrink-0 text-amber-200 drop-shadow-md"
                  strokeWidth={2.25}
                />
                <span className="relative drop-shadow-sm">Report offence</span>
              </Link>

              <Link
                href="/reports"
                className="flex items-center justify-center gap-3 rounded-2xl border-2 border-emerald-500 bg-white px-6 py-[1.1rem] text-center text-lg font-bold text-emerald-800 shadow-[0_6px_20px_-6px_rgba(16,185,129,0.4)] transition hover:bg-emerald-50 hover:shadow-md active:scale-[0.98]"
              >
                <ClipboardList
                  className="h-7 w-7 shrink-0 text-emerald-600"
                  strokeWidth={2.25}
                />
                Reported offence
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    </AuthGate>
  );
}
