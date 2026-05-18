"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useStore } from "./_lib/store";

export default function TiktokToolsHome() {
  const router = useRouter();
  const { ready, clients, createClient } = useStore();

  useEffect(() => {
    if (!ready) return;
    if (clients.length > 0) {
      router.replace(`/tiktok-tools/clients/${clients[0].id}`);
    }
  }, [ready, clients, router]);

  const handleCreate = () => {
    const client = createClient();
    router.push(`/tiktok-tools/clients/${client.id}`);
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Client Workspace
      </p>
      <h1 className="mt-2 text-2xl font-bold text-zinc-900">Start a new forecast</h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500">
        Create a client to model TikTok Shop GMV, costs, and ROI across multiple
        products with shared assumptions.
      </p>
      <button
        type="button"
        onClick={handleCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        <Plus className="h-4 w-4" />
        New Client
      </button>
    </div>
  );
}
