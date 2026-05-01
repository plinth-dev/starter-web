import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
// Wire the forms adapters once at process boot. This file's side
// effects register revalidate / redirect / authContext functions used
// by every server action created via `@plinth-dev/forms/server`.
import "@/lib/forms.server.js";

export const metadata: Metadata = {
  title: "Plinth — Web starter",
  description: "Clone-ready Next.js 16 starter with @plinth-dev SDKs pre-wired.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="max-w-5xl mx-auto p-8">{children}</main>
      </body>
    </html>
  );
}
