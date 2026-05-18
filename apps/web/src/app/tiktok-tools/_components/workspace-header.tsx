"use client";

import { useState } from "react";
import type { Client } from "../_lib/types";
import { useStore } from "../_lib/store";

export function WorkspaceHeader({ client }: { client: Client }) {
  const { updateClient } = useStore();
  const [editingName, setEditingName] = useState(false);
  const [editingVertical, setEditingVertical] = useState(false);

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Client Workspace
      </p>
      {editingName ? (
        <input
          autoFocus
          value={client.name}
          onChange={(e) => updateClient(client.id, { name: e.target.value })}
          onBlur={() => setEditingName(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") setEditingName(false);
          }}
          className="-ml-1 mt-1 w-full max-w-md rounded-md border border-zinc-300 bg-white px-2 py-1 text-2xl font-bold text-zinc-900 focus:border-zinc-900 focus:outline-none"
        />
      ) : (
        <h1
          className="mt-1 cursor-text text-2xl font-bold tracking-tight text-zinc-900"
          onClick={() => setEditingName(true)}
        >
          {client.name || "Untitled Client"}
        </h1>
      )}
      {editingVertical ? (
        <input
          autoFocus
          value={client.vertical}
          placeholder="Vertical (e.g. Cosmetics)"
          onChange={(e) => updateClient(client.id, { vertical: e.target.value })}
          onBlur={() => setEditingVertical(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") setEditingVertical(false);
          }}
          className="-ml-1 mt-1 rounded-md border border-zinc-300 bg-white px-2 py-0.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
        />
      ) : (
        <p
          className="mt-1 cursor-text text-sm font-medium text-sky-600 hover:text-sky-700"
          onClick={() => setEditingVertical(true)}
        >
          {client.vertical || "Add vertical"}
        </p>
      )}
    </div>
  );
}
