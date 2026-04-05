"use client";

import { ArrowRight, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { getOtpContext } from "@/lib/auth-session";
import { formatBdPhoneDisplay } from "@/lib/phone";

export default function RegisterOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
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
    const code = otp.trim();
    if (code.length < 1) {
      setError("Enter the code (demo accepts any input).");
      return;
    }
    router.push("/register/profile");
  }

  return (
    <AuthLayout
      showAuthSwitcher={false}
      title="Verify number"
      subtitle={
        phone
          ? `Code sent to ${formatBdPhoneDisplay(phone)} (simulated).`
          : "Loading…"
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600/50" />
            <input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label="One-time code"
              placeholder="Enter OTP (demo: any digits)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-lg tracking-widest outline-none ring-emerald-500/30 focus:ring-2"
            />
          </div>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
        <button
          type="submit"
          disabled={!phone}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
        >
          Continue
          <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </form>
    </AuthLayout>
  );
}
