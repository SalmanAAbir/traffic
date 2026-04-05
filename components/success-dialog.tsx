"use client";

import { CheckCircle2 } from "lucide-react";

export function SuccessDialog({
  open,
  title,
  message,
  onClose,
}: {
  open: boolean;
  title: string;
  message?: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-police-950/50 p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl border border-white/20 bg-white p-6 shadow-2xl"
      >
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" strokeWidth={2.25} />
        </div>
        <h2 className="text-lg font-semibold text-police-900">{title}</h2>
        {message ? (
          <p className="mt-2 text-sm text-slate-600">{message}</p>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-700"
        >
          OK
        </button>
      </div>
    </div>
  );
}
