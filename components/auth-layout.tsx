import { Shield } from "lucide-react";
import Link from "next/link";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  showBranding = true,
  showAuthSwitcher = true,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Shield + “Digital Traffic” above the title. */
  showBranding?: boolean;
  /** Bottom “Login · Register” links — hide when the page already has its own switcher. */
  showAuthSwitcher?: boolean;
}) {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-lg flex-col overflow-hidden bg-police-950 shadow-[0_12px_48px_rgba(5,10,18,0.45)] md:rounded-[1.75rem] md:ring-1 md:ring-white/15">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain bg-gradient-to-b from-police-900 via-police-950 to-black px-4 pb-10 pt-[max(2.5rem,env(safe-area-inset-top))] [scrollbar-gutter:stable]">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center">
          <div className="mb-8 flex w-full flex-col items-center text-center">
            {showBranding ? (
              <div className="flex flex-col items-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-police-800 ring-2 ring-emerald-500/40">
                  <Shield className="h-7 w-7 text-emerald-400" strokeWidth={1.75} aria-hidden />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                  Digital Traffic
                </p>
              </div>
            ) : null}
            <h1
              className={`w-full text-center text-2xl font-bold tracking-tight text-white ${showBranding ? "mt-2" : ""}`}
            >
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 w-full text-center text-sm leading-relaxed text-slate-400">{subtitle}</p>
            ) : null}
          </div>
          <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.97] p-6 shadow-xl backdrop-blur-sm">
            {children}
          </div>
          {footer ? (
            <div className="mt-6 w-full text-center text-sm text-slate-400">{footer}</div>
          ) : null}
          {showAuthSwitcher ? (
            <p className="mt-8 w-full text-center text-xs text-slate-500">
              <Link
                href="/login"
                className="text-emerald-400/95 underline-offset-2 hover:text-emerald-300 hover:underline"
              >
                Login
              </Link>
              {" · "}
              <Link
                href="/register"
                className="text-emerald-400/95 underline-offset-2 hover:text-emerald-300 hover:underline"
              >
                Register
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
