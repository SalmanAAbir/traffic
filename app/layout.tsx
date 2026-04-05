import type { Metadata, Viewport } from "next";
import { AppProvider } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Traffic",
  description: "Report traffic offences and track your reports",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c4a6e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-dvh min-h-0">
      <body className="flex h-dvh min-h-0 flex-col overflow-hidden antialiased text-slate-900 md:px-2 md:py-5">
        <AppProvider>
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}
