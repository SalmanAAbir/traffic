"use client";

import { ChevronLeft, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppHeaderMenu } from "./app-header-menu";

export function AppShell({
  title,
  children,
  showProfile = true,
  backHref,
}: {
  title: string;
  children: React.ReactNode;
  showProfile?: boolean;
  backHref?: string;
}) {
  const router = useRouter();

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-lg flex-col overflow-hidden bg-gradient-to-b from-white via-emerald-50/40 to-sky-50/60 shadow-[0_16px_56px_rgba(2,6,23,0.55)] ring-1 ring-white/30 md:rounded-[var(--app-shell-radius)]">
      <header className="z-40 flex shrink-0 items-center gap-3 border-b-2 border-amber-400/90 bg-gradient-to-br from-[#0c4a6e] via-[#0f172a] to-[#042f2e] px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
        {backHref ? (
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="rounded-xl p-2 text-amber-100 transition hover:bg-white/15"
            aria-label="Back"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.25} />
          </button>
        ) : (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-police-800 ring-2 ring-emerald-500/40"
            aria-hidden
          >
            <Shield className="h-5 w-5 text-emerald-400" strokeWidth={1.75} />
          </div>
        )}
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-[0.68rem] font-bold uppercase tracking-[0.22em] text-amber-300 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
            Digital Traffic
          </p>
          <h1 className="truncate text-lg font-bold tracking-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">
            {title}
          </h1>
        </div>
        {showProfile ? <AppHeaderMenu /> : <span className="w-10" />}
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain bg-transparent p-4 pb-safe [scrollbar-gutter:stable]">
        {children}
      </main>
    </div>
  );
}
