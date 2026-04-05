"use client";

import { CircleHelp } from "lucide-react";
import { AuthGate } from "@/components/auth-gate";
import { AppShell } from "@/components/app-shell";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "What is Digital Traffic?",
    a: "Digital Traffic is a citizen reporting tool for traffic offences. You can submit evidence such as photos or short videos along with location and vehicle details. Authorities may review reports in line with local regulations.",
  },
  {
    q: "Who can register?",
    a: "Registration uses a Bangladesh mobile number. You verify with an OTP (simulated in this prototype). After verification, you add your name and email so we can identify your account and contact you if needed.",
  },
  {
    q: "How do credit points work?",
    a: "You start with a baseline of points on your profile. In a future version, points may increase when a report is approved by the relevant authority. This prototype shows a fixed value until the backend and rules are connected.",
  },
  {
    q: "Why didn’t my photo or video save with the report?",
    a: "This demo stores data in your browser. Large files can exceed storage limits, so videos may not be kept locally and images may be compressed or omitted. A future release will upload media to a server so nothing is lost.",
  },
  {
    q: "Can I edit or delete a report after submitting?",
    a: "Not in this prototype. Once APIs exist, you may be able to track status and follow instructions from the traffic authority for corrections or appeals.",
  },
  {
    q: "Is my location always shared?",
    a: "The report form uses your device location to place the map pin. You must allow location in the browser when prompted. If you deny access, a default area may be shown until permission is granted.",
  },
];

export default function FaqPage() {
  return (
    <AuthGate>
      <AppShell title="FAQ" backHref="/home">
        <div className="flex flex-col gap-2 pb-8">
          <p className="mb-2 flex items-start gap-2 text-sm text-slate-600">
            <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <span>
              Common questions about using Digital Traffic. Tap a question to expand the answer.
            </span>
          </p>
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.q}
              className="rounded-xl border border-slate-200/90 bg-white open:shadow-md open:ring-1 open:ring-emerald-600/15"
            >
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-2">
                  <span className="flex items-start gap-2">
                    <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600/80" />
                    {item.q}
                  </span>
                  <span className="faq-chevron shrink-0 text-slate-400 transition-transform">▼</span>
                </span>
              </summary>
              <div className="border-t border-slate-100 px-4 py-3 pl-10 text-sm leading-relaxed text-slate-600">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </AppShell>
    </AuthGate>
  );
}
