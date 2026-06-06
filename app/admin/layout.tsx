import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// The auth guard lives in middleware (session refresh + owner check) and is
// re-asserted in each admin page via requireAdmin(). This layout just frames it.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-[100svh]">{children}</div>;
}
