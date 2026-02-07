import type { Metadata } from "next";
import "./globals.css";
import { APP_CONFIG } from "@/lib/app-config";

export const metadata: Metadata = {
  title: `${APP_CONFIG.branding.orgName} — Ballot Lookup`,
  description: APP_CONFIG.branding.headerSubtitle,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
