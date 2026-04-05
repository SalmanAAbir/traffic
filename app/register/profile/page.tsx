"use client";

import { ArrowRight, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { useApp } from "@/components/providers";
import { clearOtpContext, getOtpContext } from "@/lib/auth-session";
import { generateUserId } from "@/lib/user-storage";

export default function RegisterProfilePage() {
  const router = useRouter();
  const { setUser } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const phone = useMemo(() => {
    if (!mounted) return null;
    const ctx = getOtpContext();
    if (!ctx || ctx.mode !== "register") return null;
    return ctx.phone;
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const ctx = getOtpContext();
    if (!ctx || ctx.mode !== "register") router.replace("/register");
  }, [mounted, router]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!phone) return;
    const n = name.trim();
    const em = email.trim();
    if (n.length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError("Please enter a valid email.");
      return;
    }
    const user = {
      userId: generateUserId(),
      phone,
      name: n,
      email: em,
      creditPoints: 100,
    };
    setUser(user);
    clearOtpContext();
    router.replace("/home");
  }

  return (
    <AuthLayout
      showAuthSwitcher={false}
      title="Your details"
      subtitle="We’ll use this on your profile and reports."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600/50" />
            <input
              id="name"
              autoComplete="name"
              aria-label="Full name"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none ring-emerald-500/30 focus:ring-2"
            />
          </div>
        </div>
        <div>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600/50" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-label="Email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none ring-emerald-500/30 focus:ring-2"
            />
          </div>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={!phone}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
        >
          Finish registration
          <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </form>
    </AuthLayout>
  );
}
