"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useStore } from "../../../../_lib/store";
import { forecastProduct } from "../../../../_lib/calc";
import type { ProductAssumptions } from "../../../../_lib/types";

type NumKey = Exclude<keyof ProductAssumptions, "overrides">;

const FIELDS: { key: NumKey; label: string; prefix?: "$" }[] = [
  { key: "units", label: "Units sold (monthly)" },
  { key: "averagePrice", label: "Average selling price", prefix: "$" },
  { key: "cogsPerUnit", label: "COGS per unit", prefix: "$" },
  { key: "shippingPerUnit", label: "Shipping per unit", prefix: "$" },
  { key: "creatorPosts", label: "Creator posts (count)" },
  { key: "adSpendShare", label: "Share of monthly ad spend (0–1)" },
  { key: "retainerShare", label: "Share of agency retainer (0–1)" },
];

function fmt(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.round(Math.abs(value)).toLocaleString("en-US")}`;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.clientId as string;
  const productId = params.productId as string;
  const { ready, getClient, updateProduct, updateProductAssumptions } = useStore();

  const client = getClient(clientId);
  const product = client?.products.find((p) => p.id === productId);

  useEffect(() => {
    if (!ready) return;
    if (!client || !product) router.replace(`/tiktok-tools/clients/${clientId}`);
  }, [ready, client, product, clientId, router]);

  if (!ready) return <div className="text-sm text-zinc-500">Loading…</div>;
  if (!client || !product) return null;

  const forecast = forecastProduct(product, client.defaults);
  const rows: { label: string; value: number }[] = [
    { label: "Gross GMV", value: forecast.gmv },
    { label: "Discounts", value: -forecast.discount },
    { label: "Net Revenue", value: forecast.netRevenue },
    { label: "Returns", value: -forecast.returns },
    { label: "TikTok Platform Fee", value: -forecast.platformFee },
    { label: "TikTok Transaction Fee", value: -forecast.transactionFee },
    { label: "Organic Affiliate Commission", value: -forecast.organicAffiliate },
    { label: "GMV Max Affiliate Commission", value: -forecast.gmvMaxAffiliate },
    { label: "COGS", value: -forecast.cogs },
    { label: "Shipping", value: -forecast.shipping },
    { label: "Creator Posts", value: -forecast.creatorCost },
    { label: "Ad Spend", value: -forecast.adSpend },
    { label: "Agency Retainer", value: -forecast.retainer },
    { label: "Agency % Fee", value: -forecast.agencyFee },
  ];

  return (
    <div className="space-y-6">
      <Link
        href={`/tiktok-tools/clients/${clientId}`}
        className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to {client.name || "client"}
      </Link>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Product
        </p>
        <input
          value={product.name}
          onChange={(e) => updateProduct(clientId, productId, { name: e.target.value })}
          className="mt-1 w-full max-w-md rounded-md border border-transparent bg-transparent px-0 text-2xl font-bold tracking-tight text-zinc-900 focus:border-zinc-300 focus:bg-white focus:px-2 focus:outline-none"
        />
        <label className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={product.included}
            onChange={(e) => updateProduct(clientId, productId, { included: e.target.checked })}
            className="h-4 w-4 accent-black"
          />
          Include in client totals
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-lg font-bold text-zinc-900">Assumptions</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Fees and rates inherit from the client defaults unless overridden here.
          </p>
          <div className="mt-4 divide-y divide-zinc-100">
            {FIELDS.map((f) => (
              <div key={f.key} className="flex items-center justify-between gap-4 py-2.5">
                <label className="text-sm font-semibold text-zinc-700">{f.label}</label>
                <div className="flex h-9 w-44 items-center rounded-md border border-zinc-200 bg-white focus-within:border-zinc-900">
                  {f.prefix === "$" && <span className="pl-3 text-sm text-zinc-400">$</span>}
                  <input
                    type="number"
                    value={product.assumptions[f.key]}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      updateProductAssumptions(clientId, productId, {
                        [f.key]: Number.isFinite(n) ? n : 0,
                      });
                    }}
                    className="h-full flex-1 bg-transparent px-3 text-sm text-zinc-900 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-lg font-bold text-zinc-900">Forecast breakdown</h2>
          <p className="mt-1 text-sm text-zinc-500">Computed from assumptions × client defaults.</p>
          <div className="mt-4 overflow-hidden rounded-md border border-zinc-200">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-zinc-100">
                {rows.map((r) => (
                  <tr key={r.label}>
                    <td className="px-4 py-2 text-zinc-700">{r.label}</td>
                    <td
                      className={`px-4 py-2 text-right font-mono ${
                        r.value < 0 ? "text-rose-600" : "text-zinc-900"
                      }`}
                    >
                      {fmt(r.value)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-zinc-50">
                  <td className="px-4 py-2 font-semibold text-zinc-900">Total Costs</td>
                  <td className="px-4 py-2 text-right font-mono font-semibold text-zinc-900">
                    {fmt(forecast.totalCosts)}
                  </td>
                </tr>
                <tr className={forecast.roi < 0 ? "bg-rose-50" : "bg-emerald-50"}>
                  <td className="px-4 py-2 font-semibold text-zinc-900">ROI (GMV − Costs)</td>
                  <td
                    className={`px-4 py-2 text-right font-mono font-semibold ${
                      forecast.roi < 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {fmt(forecast.roi)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
