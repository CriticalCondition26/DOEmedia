"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { useStore } from "../_lib/store";

export function Sidebar() {
  const router = useRouter();
  const params = useParams();
  const selectedId = params?.clientId as string | undefined;
  const { ready, clients, createClient, deleteClient } = useStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(q));
  }, [clients, query]);

  const handleCreate = () => {
    const client = createClient();
    router.push(`/tiktok-tools/clients/${client.id}`);
  };

  const handleDelete = (id: string) => {
    deleteClient(id);
    if (selectedId === id) router.push(`/tiktok-tools`);
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-4 bg-black p-4 text-white">
      <Link href="/tiktok-tools" className="block px-1 pt-1">
        <div className="text-4xl font-black leading-none tracking-tight">DOE</div>
        <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400">
          TikTok Tools
        </div>
      </Link>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clients"
          className="h-10 w-full rounded-md bg-zinc-900/70 pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {ready && filtered.length === 0 && (
          <p className="px-1 py-2 text-xs text-zinc-500">
            {clients.length === 0 ? "No clients yet." : "No matches."}
          </p>
        )}
        {filtered.map((client) => {
          const active = client.id === selectedId;
          return (
            <div
              key={client.id}
              className={`group flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-zinc-800 text-white ring-1 ring-zinc-700"
                  : "text-zinc-300 hover:bg-zinc-900/70"
              }`}
            >
              <Link href={`/tiktok-tools/clients/${client.id}`} className="flex-1 truncate">
                {client.name || "Untitled Client"}
              </Link>
              <button
                type="button"
                aria-label={`Delete ${client.name}`}
                onClick={() => {
                  if (window.confirm(`Delete "${client.name}"?`)) handleDelete(client.id);
                }}
                className="rounded p-1 text-zinc-500 opacity-0 transition-opacity hover:bg-zinc-800 hover:text-zinc-200 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleCreate}
        className="flex items-center justify-center gap-2 rounded-md border border-zinc-700/80 bg-transparent py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-900"
      >
        <Plus className="h-4 w-4" />
        New Client
      </button>
    </aside>
  );
}
