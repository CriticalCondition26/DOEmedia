"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRightLeft, Copy, Plus, Search, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import type { Client } from "../_lib/types";
import { useStore } from "../_lib/store";
import { forecastProduct } from "../_lib/calc";

function formatRoi(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.round(Math.abs(value)).toLocaleString("en-US")}`;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export function ProductList({ client }: { client: Client }) {
  const router = useRouter();
  const { createProduct, deleteProduct, duplicateProduct, updateProduct } = useStore();
  const [query, setQuery] = useState("");
  const [moveTarget, setMoveTarget] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return client.products;
    return client.products.filter((p) => p.name.toLowerCase().includes(q));
  }, [client.products, query]);

  const handleNew = () => {
    const product = createProduct(client.id);
    router.push(`/tiktok-tools/clients/${client.id}/products/${product.id}`);
  };

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Products
          </p>
          <h2 className="mt-1 text-lg font-bold text-zinc-900">Product List</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Open a product to model assumptions, projections, and exports.
          </p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-black px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
          New Product
        </button>
      </div>

      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
          className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-md border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/60 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Included</th>
              <th className="px-4 py-2 text-left">ROI</th>
              <th className="px-4 py-2 text-left">Updated</th>
              <th className="px-4 py-2 text-left">Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500">
                  {client.products.length === 0
                    ? "No products yet — add one to start forecasting."
                    : "No matches."}
                </td>
              </tr>
            )}
            {filtered.map((product) => {
              const forecast = forecastProduct(product, client.defaults);
              const negative = forecast.roi < 0;
              return (
                <tr key={product.id} className="border-t border-zinc-100">
                  <td className="px-4 py-3">
                    <Link
                      href={`/tiktok-tools/clients/${client.id}/products/${product.id}`}
                      className="font-semibold text-emerald-600 hover:underline"
                    >
                      {product.name || "Untitled Product"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={product.included}
                      onChange={(e) =>
                        updateProduct(client.id, product.id, { included: e.target.checked })
                      }
                      className="h-4 w-4 cursor-pointer accent-black"
                    />
                  </td>
                  <td className={`px-4 py-3 font-semibold ${negative ? "text-rose-600" : "text-emerald-600"}`}>
                    {formatRoi(forecast.roi)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{formatDate(product.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/tiktok-tools/clients/${client.id}/products/${product.id}`}
                        aria-label="Open"
                        className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        <SquareArrowOutUpRight className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        aria-label="Duplicate"
                        onClick={() => duplicateProduct(client.id, product.id)}
                        className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Move"
                        onClick={() => setMoveTarget(product.id)}
                        className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete"
                        onClick={() => {
                          if (window.confirm(`Delete "${product.name}"?`)) {
                            deleteProduct(client.id, product.id);
                          }
                        }}
                        className="rounded p-1.5 text-zinc-500 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {moveTarget && (
        <p className="mt-3 text-xs text-zinc-500">
          Move-to-another-client is not wired up yet.{" "}
          <button
            type="button"
            onClick={() => setMoveTarget(null)}
            className="underline hover:text-zinc-700"
          >
            Dismiss
          </button>
        </p>
      )}
    </section>
  );
}
