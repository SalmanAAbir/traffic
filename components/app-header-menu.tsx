"use client";

import {
  Award,
  CircleHelp,
  Code2,
  LogOut,
  Menu,
  UserCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { useApp } from "./providers";

export function AppHeaderMenu() {
  const { user, logout } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  const handleLogout = useCallback(() => {
    close();
    logout();
    router.replace("/login");
  }, [close, logout, router]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!user) return <span className="w-10" aria-hidden />;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-amber-200 transition hover:bg-white/15"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" strokeWidth={2.25} />
      </button>

      {open ? (
        /* Same box as AppShell: mx-auto centering (no translate) + identical radius — crisp corners, no slivers */
        <div
          className="fixed bottom-0 left-0 right-0 z-[100] mx-auto w-full max-w-lg overflow-hidden [transform:translateZ(0)] md:bottom-5 md:top-5 md:rounded-[var(--app-shell-radius)]"
          aria-hidden={false}
        >
          <button
            type="button"
            className="absolute inset-0 z-0 bg-police-950/40"
            aria-label="Close menu"
            onClick={close}
          />
          <nav
            id={panelId}
            className="absolute right-0 top-0 z-10 flex h-full w-[min(20rem,100%)] flex-col overflow-hidden border-l border-white/10 bg-[#f0f4fa] shadow-[inset_4px_0_12px_rgba(0,0,0,0.06)] rounded-br-[var(--app-shell-radius)] rounded-tr-[var(--app-shell-radius)] rounded-bl-[var(--app-shell-radius)]"
            role="dialog"
            aria-modal="true"
            aria-label="Account menu"
          >
            <div className="flex shrink-0 items-center justify-end gap-0.5 border-b border-police-800 bg-police-900 px-3 py-2.5">
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-amber-100 transition hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Log out
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg p-2 text-white/80 hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="shrink-0 border-b border-slate-200 bg-gradient-to-br from-police-800 to-police-900 px-4 py-4 text-white">
              <p className="truncate text-base font-semibold">{user.name}</p>
              <p className="mt-1 font-mono text-xs text-amber-300/95">{user.userId}</p>
              <p className="mt-3 flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-white/60">Points</span>{" "}
                <span className="font-bold tabular-nums text-emerald-400">{user.creditPoints}</span>
              </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
              <Link
                href="/profile"
                onClick={close}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-police-900 hover:bg-white"
              >
                <UserCircle className="h-5 w-5 shrink-0 text-emerald-600" />
                Profile details
              </Link>
              <Link
                href="/faq"
                onClick={close}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-police-900 hover:bg-white"
              >
                <CircleHelp className="h-5 w-5 shrink-0 text-emerald-600" />
                FAQ
              </Link>
            </div>

            <div className="shrink-0 border-t border-slate-200/90 bg-slate-50/90 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <p className="flex items-center justify-center gap-1.5 text-center text-[0.65rem] leading-relaxed text-slate-500">
                <Code2 className="h-3.5 w-3.5 shrink-0 text-emerald-600/80" aria-hidden />
                <span>Powered by developer</span>
              </p>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
