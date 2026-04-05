"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSessionPhone, getUserByPhone } from "@/lib/user-storage";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const phone = getSessionPhone();
    const user = phone ? getUserByPhone(phone) : null;
    if (user) router.replace("/home");
    else router.replace("/login");
  }, [router]);

  return (
    <div className="flex h-full min-h-0 flex-1 items-center justify-center text-sm text-gold-400/80">
      Loading…
    </div>
  );
}
