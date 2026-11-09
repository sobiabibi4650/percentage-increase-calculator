import { useState } from "preact/hooks";
import { parseNumber, formatNumber as fmtNum, formatCurrency } from "../lib/percent";

// Display rounding for these tools: at most 2 decimals keeps results scannable.
const two = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const formatNumber = (v: number) => (Number.isFinite(v) ? two.format(v) : fmtNum(v));
const formatPercent = (v: number) => (Number.isFinite(v) ? `${two.format(v)}%` : "undefined");

export type Tool = "percentOf" | "off" | "markup" | "profit" | "error" | "fraction" | "win";

interface Field { key: string; label: string; def: string; prefix?: string }
interface Out { main: string; label: string; steps: string[]; extra?: [string, string][] }

const FIELDS: Record<Tool, Field[]> = {
  percentOf: [{ key: "a", label: "Part (X)", def: "16" }, { key: "b", label: "Whole (Y)", def: "20" }],
  off: [{ key: "a", label: "Original price ($)", def: "80" }, { key: "b", label: "Percent off (%)", def: "25" }],
  markup: [{ key: "a", label: "Cost ($)", def: "40" }, { key: "b", label: "Selling price ($)", def: "60" }],
  profit: [{ key: "a", label: "Cost ($)", def: "40" }, { key: "b", label: "Revenue / selling price ($)", def: "60" }],
  error: [{ key: "a", label: "Measured (experimental) value", def: "9.6" }, { key: "b", label: "Actual (theoretical) value", def: "9.81" }],
  fraction: [{ key: "a", label: "Fraction or mixed number", def: "3/5" }],
  win: [{ key: "a", label: "Wins", def: "12" }, { key: "b", label: "Losses", def: "8" }, { key: "c", label: "Ties", def: "0" }],
};

function parseFraction(raw: string): number | null {
  const s = raw.trim().replace(/\s+/g, " ");
  const mixed = s.match(/^(-?\d+(?:\.\d+)?) (\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (mixed) {
    const w = Number(mixed[1]), n = Number(mixed[2]), d = Number(mixed[3]);
    if (!d) return null;
    return w < 0 ? w - n / d : w + n / d;
  }
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (frac) { const d = Number(frac[2]); return d ? Number(frac[1]) / d : null; }
  return parseNumber(s);
}

function compute(tool: Tool, v: Record<string, string>): Out | string {
  if (tool === "fraction") {
    const x = parseFraction(v.a);
    if (x === null) return "Enter a fraction such as 3/5, a mixed number such as 4 1/4, or a decimal.";
    return { main: formatPercent(x * 100), label: `${v.a.trim()} as a percent`, steps: [`${v.a.trim()} = ${formatNumber(x)}`, `${formatNumber(x)} × 100 = ${formatPercent(x * 100)}`] };
  }
  const a = parseNumber(v.a), b = parseNumber(v.b ?? "");
  if (a === null || b === null) return "Enter a number in each box.";
  switch (tool) {
    case "percentOf": {
      if (b === 0) return "The whole (Y) cannot be 0.";
      const p = (a / b) * 100;
      return { main: formatPercent(p), label: `${formatNumber(a)} is ${formatPercent(p)} of ${formatNumber(b)}`,
        steps: [`${formatNumber(a)} ÷ ${formatNumber(b)} = ${formatNumber(a / b)}`, `${formatNumber(a / b)} × 100 = ${formatPercent(p)}`],
        extra: [["As a fraction", `${formatNumber(a)}/${formatNumber(b)}`], ["Remaining", formatPercent(100 - p)]] };
    }
    case "off": {
      const save = a * (b / 100), price = a - save;
      return { main: formatCurrency(price), label: "Sale price",
        steps: [`Savings = ${formatCurrency(a)} × ${formatNumber(b)}% = ${formatCurrency(save)}`, `Sale price = ${formatCurrency(a)} − ${formatCurrency(save)} = ${formatCurrency(price)}`],
        extra: [["You save", formatCurrency(save)], ["You pay", `${formatPercent(100 - b)} of price`]] };
    }
    case "markup":
    case "profit": {
      if (a === 0) return "Cost cannot be 0 for a markup percentage.";
      const profit = b - a, markup = (profit / a) * 100, margin = b !== 0 ? (profit / b) * 100 : NaN;
      const isMarkup = tool === "markup";
      return { main: formatPercent(isMarkup ? markup : margin), label: isMarkup ? "Markup" : "Profit margin",
        steps: isMarkup
          ? [`Profit = ${formatCurrency(b)} − ${formatCurrency(a)} = ${formatCurrency(profit)}`, `Markup = ${formatCurrency(profit)} ÷ ${formatCurrency(a)} × 100 = ${formatPercent(markup)}`]
          : [`Profit = ${formatCurrency(b)} − ${formatCurrency(a)} = ${formatCurrency(profit)}`, `Margin = ${formatCurrency(profit)} ÷ ${formatCurrency(b)} × 100 = ${Number.isFinite(margin) ? formatPercent(margin) : "undefined"}`],
        extra: [["Profit", formatCurrency(profit)], [isMarkup ? "Gross margin" : "Markup on cost", isMarkup ? (Number.isFinite(margin) ? formatPercent(margin) : "—") : formatPercent(markup)]] };
    }
    case "error": {
      if (b === 0) return "The actual value cannot be 0.";
      const e = (Math.abs(a - b) / Math.abs(b)) * 100;
      return { main: formatPercent(e), label: "Percent error",
        steps: [`|${formatNumber(a)} − ${formatNumber(b)}| = ${formatNumber(Math.abs(a - b))}`, `${formatNumber(Math.abs(a - b))} ÷ |${formatNumber(b)}| × 100 = ${formatPercent(e)}`],
        extra: [["Absolute error", formatNumber(Math.abs(a - b))], ["Signed error", formatPercent(((a - b) / Math.abs(b)) * 100)]] };
    }
    case "win": {
      const c = parseNumber(v.c ?? "0") ?? 0, games = a + b + c;
      if (games <= 0) return "Enter at least one game.";
      const pct = (a + c / 2) / games;
      return { main: pct.toFixed(3).replace(/^0/, ""), label: "Win percentage",
        steps: [`Games = ${formatNumber(a)} + ${formatNumber(b)} + ${formatNumber(c)} = ${formatNumber(games)}`, `(${formatNumber(a)} + ${formatNumber(c)} ÷ 2) ÷ ${formatNumber(games)} = ${pct.toFixed(3)}`],
        extra: [["As a percent", formatPercent(pct * 100)], ["Record", `${a}-${b}${c ? `-${c}` : ""}`]] };
    }
  }
  return "";
}

export default function ToolCalc({ tool }: { tool: Tool }) {
  const fields = FIELDS[tool];
  const [vals, setVals] = useState<Record<string, string>>(Object.fromEntries(fields.map((f) => [f.key, f.def])));
  const out = compute(tool, vals);
  return (
    <div class="card calculator">
      <div class="fields">
        {fields.map((f) => (
          <label class={`field${fields.length === 3 && f.key === "c" ? " wide-field" : ""}`} key={f.key}>
            {f.label}
            <input type="text" inputMode={tool === "fraction" ? "text" : "decimal"} autoComplete="off" value={vals[f.key]}
              onInput={(e) => setVals({ ...vals, [f.key]: (e.target as HTMLInputElement).value })} />
          </label>
        ))}
      </div>
      <div class="result" aria-live="polite">
        {typeof out === "string" ? <p class="detail">{out}</p> : (
          <>
            <p class="detail" style="margin:0 0 4px">{out.label}</p>
            <p class="result-value">{out.main}</p>
            {out.extra && <dl class="result-grid">{out.extra.map(([k, x]) => <div key={k}><dt>{k}</dt><dd>{x}</dd></div>)}</dl>}
            <div class="formula">{out.steps.map((s) => <div key={s}>{s}</div>)}</div>
          </>
        )}
      </div>
      <div class="actions">
        <button type="button" class="secondary" onClick={() => setVals(Object.fromEntries(fields.map((f) => [f.key, ""])))}>Clear</button>
      </div>
    </div>
  );
}
