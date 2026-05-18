"use client";

import type { Client, ClientDefaults } from "../_lib/types";
import { useStore } from "../_lib/store";

type FieldDef = {
  key: keyof ClientDefaults;
  label: string;
  suffix: "%" | "$";
};

type IdentityField = {
  key: "name" | "vertical";
  label: string;
};

const IDENTITY_FIELDS: IdentityField[] = [
  { key: "name", label: "Client Name" },
  { key: "vertical", label: "Client Vertical" },
];

const PLATFORM_FIELDS: FieldDef[] = [
  { key: "tiktokPlatformFeePct", label: "TikTok Platform Fee %", suffix: "%" },
  { key: "tiktokTransactionFeePct", label: "TikTok Transaction Fee", suffix: "%" },
  { key: "returnRatePct", label: "Return Rate", suffix: "%" },
  { key: "averageDiscountPct", label: "Average Discount", suffix: "%" },
  { key: "monthlyAdSpend", label: "Monthly Ad Spend", suffix: "$" },
  { key: "agencyRetainer", label: "Agency Retainer", suffix: "$" },
  { key: "agencyFeePct", label: "Agency % Fee", suffix: "%" },
];

const CREATOR_FIELDS: FieldDef[] = [
  { key: "creatorPostRate", label: "Creator Post Rate", suffix: "$" },
  { key: "organicAffiliateCommissionPct", label: "Organic Affiliate Commission %", suffix: "%" },
  { key: "gmvMaxAffiliateCommissionPct", label: "GMV Max Affiliate Commission %", suffix: "%" },
];

function NumberField({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix: "$" | "%";
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <label className="text-sm font-semibold text-zinc-700">{label}</label>
      <div className="flex h-9 w-44 items-center rounded-md border border-zinc-200 bg-white focus-within:border-zinc-900">
        {suffix === "$" && (
          <span className="pl-3 text-sm text-zinc-400">$</span>
        )}
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const n = Number(e.target.value);
            onChange(Number.isFinite(n) ? n : 0);
          }}
          className="h-full flex-1 bg-transparent px-3 text-sm text-zinc-900 focus:outline-none"
        />
        {suffix === "%" && (
          <span className="pr-3 text-sm text-zinc-400">%</span>
        )}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <label className="text-sm font-semibold text-zinc-700">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-44 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
      />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-zinc-100 pt-4">
      <h4 className="text-sm font-bold text-zinc-900">{title}</h4>
      <div className="mt-1 divide-y divide-zinc-100">{children}</div>
    </div>
  );
}

export function ClientDefaultsPanel({ client }: { client: Client }) {
  const { updateClient, updateClientDefaults } = useStore();

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {client.name || "Client"}
      </p>
      <h2 className="mt-1 text-lg font-bold text-zinc-900">Client Defaults</h2>
      <p className="mt-1 text-sm text-zinc-500">
        These values feed new products and any still-inherited product assumptions.
      </p>

      <div className="mt-5 space-y-6">
        <Section title="Client Details">
          {IDENTITY_FIELDS.map((f) => (
            <TextField
              key={f.key}
              label={f.label}
              value={client[f.key] ?? ""}
              placeholder={f.key === "vertical" ? "e.g. Cosmetics" : undefined}
              onChange={(s) => updateClient(client.id, { [f.key]: s })}
            />
          ))}
        </Section>

        <Section title="Platform & Fees">
          {PLATFORM_FIELDS.map((f) => (
            <NumberField
              key={f.key}
              label={f.label}
              value={client.defaults[f.key]}
              suffix={f.suffix}
              onChange={(n) => updateClientDefaults(client.id, { [f.key]: n })}
            />
          ))}
        </Section>

        <Section title="Creator Program">
          {CREATOR_FIELDS.map((f) => (
            <NumberField
              key={f.key}
              label={f.label}
              value={client.defaults[f.key]}
              suffix={f.suffix}
              onChange={(n) => updateClientDefaults(client.id, { [f.key]: n })}
            />
          ))}
        </Section>
      </div>
    </section>
  );
}
