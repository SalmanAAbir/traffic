"use client";

import { ArrowRight, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { setOtpContext } from "@/lib/auth-session";
import { normalizeBdPhone } from "@/lib/phone";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const n = normalizeBdPhone(phone);
    if (!n) {
      setError("Enter a valid Bangladesh mobile number (e.g. 01XXXXXXXXX).");
      return;
    }
    setOtpContext(n, "login");
    router.push("/login/otp");
  }

  return (
    <AuthLayout
      showAuthSwitcher={false}
      title="Log in"
      subtitle="We’ll send a one-time code to your number (demo: any OTP works)."
      footer={
        <span>
          New here?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="font-medium text-emerald-700 hover:underline"
          >
            Create an account
          </button>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600/50" />
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              aria-label="Mobile number"
              placeholder="Mobile number · 01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none ring-emerald-500/30 focus:ring-2"
            />
          </div>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 hover:bg-emerald-700"
        >
          Continue
          <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </form>
    </AuthLayout>
  );
}
