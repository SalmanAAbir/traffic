"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "./providers";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) router.replace("/login");
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center text-sm text-gold-400/80">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
