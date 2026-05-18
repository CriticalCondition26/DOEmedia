"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Client } from "../../_lib/types";
import { useStore } from "../../_lib/store";
import { totalsForClient, type ClientTotals } from "../../_lib/calc";
import { WorkspaceHeader } from "../../_components/workspace-header";
import { ViewTabs, type WorkspaceView } from "../../_components/view-tabs";
import { KpiRow } from "../../_components/kpi-row";
import { ProductList } from "../../_components/product-list";
import { ClientDefaultsPanel } from "../../_components/client-defaults";
import { LastSaved } from "../../_components/last-saved";

export default function ClientWorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.clientId as string;
  const { ready, getClient } = useStore();
  const [view, setView] = useState<WorkspaceView>("client-view");

  const client = getClient(clientId);

  useEffect(() => {
    if (ready && !client) router.replace("/tiktok-tools");
  }, [ready, client, router]);

  if (!ready) {
    return <div className="text-sm text-zinc-500">Loading…</div>;
  }
  if (!client) return null;

  const totals = totalsForClient(client);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <WorkspaceHeader client={client} />
        <LastSaved />
      </div>

      <ViewTabs value={view} onChange={setView} />

      {view === "client-view" ? (
        <>
          <KpiRow totals={totals} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ProductList client={client} />
            <ClientDefaultsPanel client={client} />
          </div>
        </>
      ) : (
        <BusinessPerformance client={client} totals={totals} />
      )}
    </div>
  );
}

function BusinessPerformance({ client, totals }: { client: Client; totals: ClientTotals }) {
  const included = client.products.filter((p) => p.included).length;
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h2 className="text-lg font-bold text-zinc-900">Business performance summary</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Rolled up across {included} included product{included === 1 ? "" : "s"}.
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
        <div>
          <dt className="text-zinc-500">Gross GMV</dt>
          <dd className="text-base font-semibold text-zinc-900">
            ${Math.round(totals.gmv).toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Total Costs</dt>
          <dd className="text-base font-semibold text-zinc-900">
            ${Math.round(totals.costs).toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Gross Profit</dt>
          <dd className={`text-base font-semibold ${totals.profit < 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {totals.profit < 0 ? "-" : ""}${Math.abs(Math.round(totals.profit)).toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Margin</dt>
          <dd className={`text-base font-semibold ${totals.margin < 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {(totals.margin * 100).toFixed(1)}%
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Blended MER</dt>
          <dd className="text-base font-semibold text-zinc-900">{totals.mer.toFixed(2)}</dd>
        </div>
      </dl>
    </section>
  );
}
