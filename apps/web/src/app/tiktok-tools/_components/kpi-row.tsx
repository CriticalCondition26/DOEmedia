import type { ClientTotals } from "../_lib/calc";

function formatCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  return `${sign}$${Math.round(abs).toLocaleString("en-US")}`;
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

const cardBase =
  "rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";
const labelClass = "text-xs font-medium uppercase tracking-wide text-zinc-500";
const valueClass = "mt-2 text-2xl font-bold tracking-tight text-zinc-900";

export function KpiRow({ totals }: { totals: ClientTotals }) {
  const profitColor = totals.profit < 0 ? "text-rose-600" : "text-emerald-600";
  const marginColor = totals.margin < 0 ? "text-rose-600" : "text-emerald-600";

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <div className={cardBase}>
        <div className={labelClass}>Total Gross GMV</div>
        <div className={valueClass}>{formatCurrency(totals.gmv)}</div>
      </div>
      <div className={cardBase}>
        <div className={labelClass}>Total Costs</div>
        <div className={valueClass}>{formatCurrency(totals.costs)}</div>
      </div>
      <div className={cardBase}>
        <div className={labelClass}>Gross Profit</div>
        <div className={`${valueClass} ${profitColor}`}>{formatCurrency(totals.profit)}</div>
      </div>
      <div className={cardBase}>
        <div className={labelClass}>Margin %</div>
        <div className={`${valueClass} ${marginColor}`}>{formatPercent(totals.margin)}</div>
      </div>
      <div className={cardBase}>
        <div className={labelClass}>Blended MER</div>
        <div className={valueClass}>{totals.mer.toFixed(2)}</div>
      </div>
    </div>
  );
}
