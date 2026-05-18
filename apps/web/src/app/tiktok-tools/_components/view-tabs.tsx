"use client";

export type WorkspaceView = "client-view" | "business-performance";

const TABS: { id: WorkspaceView; label: string }[] = [
  { id: "client-view", label: "Client View" },
  { id: "business-performance", label: "Client Business Performance" },
];

export function ViewTabs({
  value,
  onChange,
}: {
  value: WorkspaceView;
  onChange: (next: WorkspaceView) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1">
      {TABS.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
