import type { ReactNode } from "react";
import { Header } from "./header.tsx";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 pt-6 pb-24">{children}</main>
    </div>
  );
}
