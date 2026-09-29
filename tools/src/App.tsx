import { useMemo, useState } from "react";
import { Check, ChevronDown, Copy, Search, X } from "lucide-react";
import { calculate, type CalculatorInputs } from "./calculator-engine";
import {
  calculators,
  categories,
  type CalculatorDefinition,
  type FieldDefinition,
} from "./calculator-definitions";
import "./styles.css";

function initialInputs(tool: CalculatorDefinition): CalculatorInputs {
  return Object.fromEntries(tool.fields.map((field) => [field.key, field.defaultValue]));
}

function outputLabel(key: string) {
  return key.replace(/^(headline:|li:|text:)/, "");
}

function Field({
  definition,
  value,
  onChange,
}: {
  definition: FieldDefinition;
  value: string | number;
  onChange: (value: string | number) => void;
}) {
  const id = `field-${definition.key}`;
  const stringInput = definition.kind === "text" || definition.kind === "textarea";
  const props = {
    id,
    value,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => onChange(stringInput ? event.target.value : Number(event.target.value)),
    "aria-describedby": `${id}-unit`,
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
        ) : (
          <input
            {...props}
            type={definition.kind === "text" ? "text" : "number"}
            min={definition.min}
            max={definition.max}
            step={definition.step ?? "any"}
          />
        )}
        {definition.unit && definition.unit !== "$" && definition.kind !== "select" && (
          <span className="input-suffix" id={`${id}-unit`}>
            {definition.unit === "count" ? "" : definition.unit}
          </span>
        )}
      </div>
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
  const entries = Object.entries(output);
  const headline = entries.find(([key]) => key.startsWith("headline:"));
  const details = entries.filter(([key]) => !key.startsWith("headline:"));

  async function copyResults() {
    const copy = entries
      .map(([key, value]) => `${outputLabel(key)}: ${value}`)
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
                onChange={(value) =>
                  setInputs((current) => ({ ...current, [field.key]: value }))
                }
              />
            ))}
          </div>
          {validation && (
            <p className="validation" role="alert">
              Enter zero or a positive number for {validation.label.toLowerCase()}.
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
              <p className="result-label">{outputLabel(headline[0])}</p>
              <p className="result-value">{headline[1]}</p>
            </>
          ) : (
            <p className="empty-result">Check the inputs to continue.</p>
          )}
          <div className="result-details">
            {details.map(([key, value]) => (
              <div className="result-row" key={key}>
                <span>{outputLabel(key)}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="explanation-grid">
        <div>
          <h4>What This Tells You</h4>
          <p>{tool.tells}</p>
        </div>
        <div>
          <h4>How It Is Calculated</h4>
          <p>{tool.calculation}</p>
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
      >
        <span className="tool-number">
          {String(calculators.findIndex((item) => item.id === tool.id) + 1).padStart(2, "0")}
        </span>
        <span className="tool-copy">
          <span className="tool-name">{tool.name}</span>
          <span className="tool-description">{tool.tells}</span>
        </span>
        <span className="open-label">{open ? "Close" : "Open"}</span>
        <ChevronDown className="chevron" aria-hidden="true" />
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
    const normalized = query.trim().toLowerCase();
    if (!normalized) return calculators;
    return calculators.filter((tool) =>
      `${tool.name} ${tool.category} ${tool.tells}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="DOE Media calculators home">
          <span>[</span> DOE Media · Data Over Ego <span>]</span>
        </a>
        {/* DOE_SVG_LOGO_SLOT: Replace this text wordmark when an approved SVG is supplied. */}
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
