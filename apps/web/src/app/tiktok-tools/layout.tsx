import type { Metadata } from "next";
import { StoreProvider } from "./_lib/store";
import { Sidebar } from "./_components/sidebar";

export const metadata: Metadata = {
  title: "Doe Media — TikTok Tools",
};

export default function TiktokToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex min-h-screen bg-white text-zinc-900">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-[1400px] px-8 py-8">{children}</div>
        </main>
      </div>
    </StoreProvider>
  );
}
