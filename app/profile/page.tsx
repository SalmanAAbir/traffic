"use client";

import { Award, LogOut, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/components/auth-gate";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/components/providers";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useApp();

  return (
    <AuthGate>
      <AppShell title="Profile" backHref="/home">
        {user ? (
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-police-800/5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-police-800 text-2xl font-bold text-emerald-400 ring-2 ring-emerald-500/40">
                {user.name.trim().charAt(0).toUpperCase() || "U"}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-900">{user.name}</h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4 shrink-0 text-emerald-600" />
                {user.email || "—"}
              </p>
            </div>

            <dl className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 text-sm shadow-sm ring-1 ring-police-800/5">
              <div className="flex justify-between gap-4">
                <dt className="flex items-center gap-2 text-slate-500">
                  <User className="h-4 w-4 text-emerald-600" />
                  User ID
                </dt>
                <dd className="font-mono text-right text-slate-900">{user.userId}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="flex items-center gap-2 text-slate-500">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  Mobile
                </dt>
                <dd className="text-right text-slate-900">{user.phone}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-100 pt-4">
                <dt className="flex items-center gap-2 text-slate-500">
                  <Award className="h-4 w-4 text-emerald-600" />
                  Credit points
                </dt>
                <dd className="text-lg font-bold text-emerald-700">{user.creditPoints}</dd>
              </div>
            </dl>
            <p className="text-xs text-slate-500">
              Points may increase when a report is approved (coming with backend integration).
            </p>

            <button
              type="button"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        ) : null}
      </AppShell>
    </AuthGate>
  );
}
