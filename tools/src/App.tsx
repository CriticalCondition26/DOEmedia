import { useMemo, useState } from "react";
import { Check, Copy, Minus, Plus, Search, X } from "lucide-react";
import { calculate, type CalculatorInputs } from "./calculator-engine";
import {
  calculators,
  categories,
  type CalculatorDefinition,
  type FieldDefinition,
} from "./calculator-definitions";
import doeLogo from "./assets/doe-logo.svg";
import "./styles.css";

function initialInputs(tool: CalculatorDefinition): CalculatorInputs {
  return Object.fromEntries(tool.fields.map((field) => [field.key, field.defaultValue]));
}

function outputLabel(
  key: string,
  tool?: CalculatorDefinition,
  inputs?: CalculatorInputs,
) {
  const label = key.replace(/^(headline:|li:|text:)/, "");
  const labels: Record<string, string> = {
    url: "Campaign URL",
    p: "Two-tailed p-value",
    rateA: "Variant A rate",
    rateB: "Variant B rate",
    daily: "Daily budget",
    cpc: "Cost per conversion",
    clicks: "Estimated link clicks",
    store: "Total store revenue",
    mer: "MER summary",
    per1000: "Clicks per 1,000 impressions",
    retained: "Contribution retained",
    units: "Current units",
    unitsNeeded: "Units to match contribution",
  };
  const baseLabel = labels[label] ?? label;
  if (!tool || !inputs) return baseLabel;

  if (tool.id === "ad-budget-calculator" && label === "daily") {
    return `Daily budget at ${inputs.flightDays} days`;
  }
  if (
    tool.id === "roas-calculator" &&
    ["Revenue at target", "Revenue gap to target"].includes(label)
  ) {
    return `${label} at ${Number(inputs.exploreTargetRoas).toFixed(1)}x ROAS`;
  }
  if (
    tool.id === "breakeven-roas-calculator" &&
    ["Profit per order", "Ad spend per order", "Net margin"].includes(label)
  ) {
    return `${label} at ${Number(inputs.achievedRoas).toFixed(1)}x ROAS`;
  }
  if (tool.id === "cpc-calculator" && label === "clicks") {
    return `Estimated link clicks at $${Number(inputs.exploreSpend).toLocaleString("en-US")} spend`;
  }
  if (
    tool.id === "aov-calculator" &&
    ["Additional revenue", "Scenario revenue"].includes(label)
  ) {
    return `${label} at +$${Number(inputs.aovIncrease).toLocaleString("en-US")} AOV`;
  }
  if (tool.id === "cac-payback-calculator") {
    if (label === "Contribution by this month") {
      return `Contribution by month ${inputs.inspectMonth}`;
    }
    if (label === "CAC still unrecovered") {
      return `CAC unrecovered after month ${inputs.inspectMonth}`;
    }
  }
  return baseLabel;
}

function Field({
  definition,
  value,
  onChange,
  idPrefix,
}: {
  definition: FieldDefinition;
  value: string | number;
  onChange: (value: string | number) => void;
  idPrefix: string;
}) {
  const id = `${idPrefix}-field-${definition.key}`;
  const stringInput = definition.kind === "text" || definition.kind === "textarea";
  const props = {
    id,
    value,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => onChange(stringInput ? event.target.value : Number(event.target.value)),
  };

  return (
    <div className="field">
      <label htmlFor={id}>{definition.label}</label>
      <div className="input-wrap">
        {definition.unit === "$" && <span className="input-prefix">$</span>}
        {definition.kind === "textarea" ? (
          <textarea {...props} rows={4} />
        ) : definition.kind === "select" ? (
          <select {...props}>
            {definition.options?.map((option) => (
              <option key={option} value={option}>
                {option}
                {definition.unit === "%" ? "%" : ""}
              </option>
            ))}
          </select>
        ) : definition.kind === "range" ? (
          <div className="range-control">
            <input
              {...props}
              type="range"
              min={definition.min}
              max={definition.max}
              step={definition.step}
            />
            <output htmlFor={id}>
              {definition.unit === "$" ? "$" : ""}
              {Number(value).toFixed(definition.step && definition.step < 1 ? 1 : 0)}
              {definition.unit === "x" ? "x" : definition.unit === "%" ? "%" : definition.unit === "months" ? " mo" : ""}
            </output>
          </div>
        ) : (
          <input
            {...props}
            type={definition.kind === "text" ? "text" : "number"}
            min={definition.min}
            max={definition.max}
            step={definition.step ?? "any"}
          />
        )}
        {definition.unit &&
          definition.unit !== "$" &&
          definition.kind !== "select" &&
          definition.kind !== "range" && (
          <span className="input-suffix">
            {definition.unit === "count" ? "" : definition.unit}
          </span>
          )}
      </div>
    </div>
  );
}

function ProfitCurve({ inputs }: { inputs: CalculatorInputs }) {
  const value = (key: string) => Number(inputs[key] ?? 0);
  const aov = value("aov");
  const contribution =
    aov -
    value("cogs") -
    value("shipping") -
    (aov * value("processingRatePct")) / 100 -
    value("processingFixed") -
    value("otherVariable");
  const achieved = value("achievedRoas");
  const samples = Array.from({ length: 31 }, (_, index) => {
    const roas = 0.5 + index * 0.25;
    return { roas, profit: contribution - aov / roas };
  });
  const profits = samples.map((sample) => sample.profit);
  const min = Math.min(...profits, 0);
  const max = Math.max(...profits, 0);
  const span = max - min || 1;
  const x = (roas: number) => 24 + ((roas - 0.5) / 7.5) * 552;
  const y = (profit: number) => 182 - ((profit - min) / span) * 150;
  const achievedProfit = contribution - aov / achieved;

  return (
    <div className="profit-curve-card">
      <div className="chart-heading">
        <div>
          <h4>Profit Per Order Curve</h4>
          <p>Profit after variable costs and ad spend at each achieved ROAS.</p>
        </div>
        <strong>
          {achieved.toFixed(1)}x · {achievedProfit.toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </strong>
      </div>
      <svg
        viewBox="0 0 600 220"
        role="img"
        aria-label="Profit per order across ROAS from 0.5x to 8.0x"
      >
        <line className="chart-zero" x1="24" x2="576" y1={y(0)} y2={y(0)} />
        <polyline
          className="chart-line"
          points={samples.map((sample) => `${x(sample.roas)},${y(sample.profit)}`).join(" ")}
        />
        <line
          className="chart-marker-line"
          x1={x(achieved)}
          x2={x(achieved)}
          y1="22"
          y2="182"
        />
        <circle className="chart-marker" cx={x(achieved)} cy={y(achievedProfit)} r="5" />
        <text x="24" y="207">0.5x</text>
        <text x="552" y="207">8.0x</text>
        <text x="28" y={Math.max(16, y(0) - 7)}>Break-even line</text>
      </svg>
    </div>
  );
}

function CalculatorPanel({ tool }: { tool: CalculatorDefinition }) {
  const [mode, setMode] = useState(tool.modes?.[0]?.value ?? null);
  const [inputs, setInputs] = useState<CalculatorInputs>(() => initialInputs(tool));
  const [copied, setCopied] = useState(false);
  const visibleFields = tool.fields.filter(
    (field) => !field.modes || (mode && field.modes.includes(mode)),
  );
  const validation = visibleFields.find(
    (field) =>
      field.kind === "number" &&
      (!Number.isFinite(Number(inputs[field.key])) || Number(inputs[field.key]) < 0),
  );
  const output = validation ? {} : calculate(tool.id, mode, inputs);
  const calculationError =
    !validation && Object.values(output).some((value) => value === "n/a");
  const entries = Object.entries(output);
  const headline = entries.find(([key]) => key.startsWith("headline:")) ?? entries[0];
  const details = entries.filter(([key]) => key !== headline?.[0]);

  async function copyResults() {
    const copy = entries
      .map(([key, value]) => `${outputLabel(key, tool, inputs)}: ${value}`)
      .join("\n");
    await navigator.clipboard.writeText(copy);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="calculator-panel">
      {tool.modes && (
        <div className="mode-tabs" role="group" aria-label={`${tool.name} mode`}>
          {tool.modes.map((item) => (
            <button
              type="button"
              className={mode === item.value ? "active" : ""}
              key={item.value}
              onClick={() => setMode(item.value)}
              aria-pressed={mode === item.value}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="calculator-grid">
        <div className="inputs-card">
          <h4>Your Inputs</h4>
          <div className="fields-grid">
            {visibleFields.map((field) => (
              <Field
                key={field.key}
                definition={field}
                value={inputs[field.key]}
                idPrefix={tool.id}
                onChange={(value) =>
                  setInputs((current) => ({ ...current, [field.key]: value }))
                }
              />
            ))}
          </div>
          {(validation || calculationError) && (
            <p className="validation" role="alert">
              {validation
                ? `Enter zero or a positive number for ${validation.label.toLowerCase()}.`
                : "This calculation needs a non-zero value in every divisor field."}
            </p>
          )}
        </div>

        <div className="results-card" aria-live="polite">
          <div className="results-topline">
            <span>Live Result</span>
            <button
              className="copy-button"
              type="button"
              onClick={copyResults}
              disabled={!entries.length}
            >
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copied ? "Copied" : "Copy results"}
            </button>
          </div>
          {headline ? (
            <>
              <p className="result-label">{outputLabel(headline[0], tool, inputs)}</p>
              <p className={`result-value ${headline[1].length > 30 ? "long" : ""}`}>
                {headline[1]}
              </p>
            </>
          ) : (
            <p className="empty-result">Check the inputs to continue.</p>
          )}
          <div className="result-details">
            {details.map(([key, value]) => (
              <div className="result-row" key={key}>
                <span>{outputLabel(key, tool, inputs)}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {tool.id === "breakeven-roas-calculator" && <ProfitCurve inputs={inputs} />}

      <div className="explanation-grid">
        <div>
          <h4>What This Tells You</h4>
          <p>{tool.guidance}</p>
        </div>
        <div>
          <h4>How It Is Calculated</h4>
          <p>{tool.calculation}</p>
          <code>{tool.formula}</code>
        </div>
      </div>
    </div>
  );
}

function CalculatorCard({ tool }: { tool: CalculatorDefinition }) {
  const [open, setOpen] = useState(false);

  return (
    <article className={`tool-card ${open ? "open" : ""}`} id={tool.id}>
      <button
        className="tool-summary"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={`${tool.id}-panel`}
        data-state={open ? "expanded" : "collapsed"}
      >
        <span className="tool-number">
          {String(calculators.findIndex((item) => item.id === tool.id) + 1).padStart(2, "0")}
        </span>
        <span className="tool-copy">
          <span className="tool-name">{tool.name}</span>
          <span className="tool-description">{tool.tells}</span>
        </span>
        <span className="open-label">{open ? "Close" : "Open"}</span>
        <span className="toggle-icon" aria-hidden="true">
          {open ? <Minus /> : <Plus />}
        </span>
      </button>
      {open && (
        <div id={`${tool.id}-panel`}>
          <CalculatorPanel tool={tool} />
        </div>
      )}
    </article>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalize = (value: string) =>
      value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const normalized = normalize(query);
    if (!normalized) return calculators;
    return calculators.filter((tool) =>
      normalize(`${tool.name} ${tool.category} ${tool.tells}`).includes(normalized),
    );
  }, [query]);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="header-logo" href="#top" aria-label="DOE Media">
          <img src={doeLogo} alt="" />
        </a>
        <a className="topbar-link" href="#calculators">
          Browse Tools
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-glow hero-glow-red" />
          <div className="hero-glow hero-glow-purple" />
          <p className="eyebrow">Operator Tools · No Signup</p>
          <h1>
            The Numbers Behind
            <br />
            Profitable Growth.
          </h1>
          <p className="hero-copy">
            Twenty-seven calculators for media, margin, customer value, and testing.
            Put in your numbers. Get the answer that changes the next decision.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#calculators">
              Find A Calculator
            </a>
            <span>Private by default. Nothing leaves your browser.</span>
          </div>
        </section>

        <section className="tool-area" id="calculators">
          <div className="section-intro">
            <p className="eyebrow">The Calculator Library</p>
            <h2>One Question. One Clear Number.</h2>
            <p>
              Start with the lever you are working on. Every tool updates as you type
              and shows the math behind the result.
            </p>
          </div>

          <div className="sticky-controls">
            <nav className="category-nav" aria-label="Calculator sections">
              {categories.map((category) => (
                <a key={category} href={`#${category.toLowerCase().replace(" ", "-")}`}>
                  {category}
                </a>
              ))}
            </nav>
            <label className="search-box">
              <Search aria-hidden="true" />
              <span className="sr-only">Search calculators</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search all 27 tools"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                  <X aria-hidden="true" />
                </button>
              )}
            </label>
          </div>

          {categories.map((category) => {
            const tools = filtered.filter((tool) => tool.category === category);
            if (!tools.length) return null;
            return (
              <section
                className="tool-section"
                id={category.toLowerCase().replace(" ", "-")}
                key={category}
              >
                <div className="section-heading">
                  <h3>{category}</h3>
                  <span>{tools.length} tools</span>
                </div>
                <div className="tools-list">
                  {tools.map((tool) => (
                    <CalculatorCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}

          {!filtered.length && (
            <div className="no-results">
              <h3>No Matching Calculator</h3>
              <p>Try a metric such as CAC, margin, traffic, or testing.</p>
            </div>
          )}
        </section>
      </main>

      <footer>
        <div className="wordmark">
          <span>[</span> DOE Media · Data Over Ego <span>]</span>
        </div>
        <p>Directional math based only on the inputs you provide.</p>
      </footer>
    </div>
  );
}
