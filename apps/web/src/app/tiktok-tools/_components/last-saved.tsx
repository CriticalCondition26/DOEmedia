"use client";

import { useStore } from "../_lib/store";

function formatTime(ts: number): string {
  const d = new Date(ts);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export function LastSaved() {
  const { lastSavedAt } = useStore();
  if (!lastSavedAt) return null;
  return (
    <span className="text-xs text-zinc-500">
      Last saved {formatTime(lastSavedAt)}
    </span>
  );
}
