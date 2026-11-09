import { useEffect, useId, useState } from "preact/hooks";
import {
  addPercent,
  buildQuery,
  directionLabel,
  directionOf,
  exceedsMagnitude,
  formatCurrency,
  formatNumber,
  formatPercent,
  grossPayPeriods,
  parseNumber,
  parseQuery,
  percentChange,
  reversePercent,
  type CalcMode,
  type PayBreakdown,
} from "../lib/percent";

export interface CalculatorProps {
  initialMode?: CalcMode;
  initialFrom?: string;
  initialTo?: string;
  initialValue?: string;
  initialPercent?: string;
  initialNew?: string;
  display?: "number" | "currency";
  showPayPeriods?: boolean;
}

interface Fields {
  mode: CalcMode;
  from: string;
  to: string;
  value: string;
  percent: string;
  newValue: string;
}

function formatAmount(value: number, display: "number" | "currency"): string {
  return display === "currency" ? formatCurrency(value) : formatNumber(value);
}

function readInput(event: Event): string {
  const target = event.target as { value?: unknown } | null;
  return typeof target?.value === "string" ? target.value : "";
}

export default function Calculator({
  initialMode = "find",
  initialFrom = "",
  initialTo = "",
  initialValue = "",
  initialPercent = "",
  initialNew = "",
  display = "number",
  showPayPeriods = false,
}: CalculatorProps) {
  const baseId = useId();
  const [mode, setMode] = useState<CalcMode>(initialMode);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [value, setValue] = useState(initialValue);
  const [percent, setPercent] = useState(initialPercent);
  const [newValue, setNewValue] = useState(initialNew);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const query = parseQuery(window.location.search);
    if (!query.mode && query.from == null && query.to == null && query.value == null && query.percent == null && query.newValue == null) {
      return;
    }
    const nextMode = query.mode ?? initialMode;
    setMode(nextMode);
    if (query.from != null) setFrom(query.from);
    if (query.to != null) setTo(query.to);
    if (query.value != null) setValue(query.value);
    if (query.percent != null) setPercent(query.percent);
    if (query.newValue != null) setNewValue(query.newValue);
  }, [initialMode]);

  function snapshot(partial: Partial<Fields> = {}): Fields {
    return { mode, from, to, value, percent, newValue, ...partial };
  }

  function syncUrl(partial: Partial<Fields> = {}) {
    const next = snapshot(partial);
    const query = buildQuery({
      mode: next.mode,
      from: next.from,
      to: next.to,
      value: next.value,
      percent: next.percent,
      newValue: next.newValue,
    });
    const path = `${window.location.pathname}${query}`;
    window.history.replaceState(null, "", path);
  }

  function shareHref(partial: Partial<Fields> = {}) {
    const next = snapshot(partial);
    const query = buildQuery({
      mode: next.mode,
      from: next.from,
      to: next.to,
      value: next.value,
      percent: next.percent,
      newValue: next.newValue,
    });
    return `${window.location.origin}${window.location.pathname}${query}`;
  }

  const labels = showPayPeriods
    ? {
        from: "Current annual salary",
        to: "New annual salary",
        value: "Current annual salary",
        percent: "Raise percent",
        new: "New annual salary",
        reversePercent: "Percent change",
      }
    : display === "currency"
      ? {
          from: "Original price",
          to: "New price",
          value: "Original price",
          percent: "Percent",
          new: "New price",
          reversePercent: "Percent change",
        }
      : {
          from: "Starting value",
          to: "New value",
          value: "Starting value",
          percent: "Percent",
          new: "New value",
          reversePercent: "Percent change",
        };

  const parsed = {
    from: parseNumber(from),
    to: parseNumber(to),
    value: parseNumber(value),
    percent: parseNumber(percent),
    newValue: parseNumber(newValue),
  };

  let direction = "undefined";
  let directionClass = "undefined";
  let primary = "Enter both numbers";
  let detail = "The formula updates with each keystroke. Commas and a dollar sign are fine.";
  let formula = "Waiting for two valid numbers.";
  let invalid = false;
  let pay: PayBreakdown | undefined;
  let rangeWarning = false;

  if (mode === "find") {
    if (from.trim() && parsed.from === null) invalid = true;
    if (to.trim() && parsed.to === null) invalid = true;
    if (parsed.from !== null && parsed.to !== null) {
      rangeWarning = exceedsMagnitude(parsed.from, parsed.to);
      const change = percentChange(parsed.from, parsed.to);
      const delta = parsed.to - parsed.from;
      if (change === undefined) {
        primary = "Undefined";
        detail =
          "Percentage change is undefined when the starting value is 0. The formula divides by that starting value, so there is no real percent. If these numbers are just two readings with no before and after, use the percentage difference calculator.";
        formula = `(${formatAmount(parsed.to, display)} − ${formatAmount(parsed.from, display)}) ÷ 0 is undefined`;
      } else {
        const kind = directionOf(change);
        direction = kind ? directionLabel(kind) : "Undefined";
        directionClass = kind ?? "undefined";
        primary = formatPercent(change);
        detail =
          change < 0
            ? `Down ${formatAmount(Math.abs(delta), display)} from the start. A drop is labeled as a decrease.`
            : change > 0
              ? `Up ${formatAmount(delta, display)} from the start.`
              : "The new value matches the starting value.";
        formula = `((${formatAmount(parsed.to, display)} − ${formatAmount(parsed.from, display)}) ÷ ${formatAmount(parsed.from, display)}) × 100 = ${formatPercent(change)}`;
        if (showPayPeriods) pay = grossPayPeriods(parsed.to);
      }
    }
  } else if (mode === "add") {
    if (value.trim() && parsed.value === null) invalid = true;
    if (percent.trim() && parsed.percent === null) invalid = true;
    if (parsed.value !== null && parsed.percent !== null) {
      rangeWarning = exceedsMagnitude(parsed.value, parsed.percent);
      const next = addPercent(parsed.value, parsed.percent);
      if (next === undefined) {
        primary = "Undefined";
        formula = "That percent cannot be applied to this value.";
      } else {
        const delta = next - parsed.value;
        const kind = directionOf(parsed.percent);
        direction = kind ? directionLabel(kind) : "Undefined";
        directionClass = kind ?? "undefined";
        primary = formatAmount(next, display === "currency" || showPayPeriods ? "currency" : display);
        detail =
          parsed.percent < 0
            ? `The value falls by ${formatAmount(Math.abs(delta), display === "currency" || showPayPeriods ? "currency" : display)}. A negative percent is a decrease.`
            : parsed.percent > 0
              ? `Added ${formatAmount(delta, display === "currency" || showPayPeriods ? "currency" : display)}.`
              : "A 0% change leaves the value as it is.";
        formula = `${formatAmount(parsed.value, display === "currency" || showPayPeriods ? "currency" : "number")} × (1 + ${formatNumber(parsed.percent)} ÷ 100) = ${formatAmount(next, display === "currency" || showPayPeriods ? "currency" : "number")}`;
        if (showPayPeriods) pay = grossPayPeriods(next);
      }
    }
  } else {
    if (newValue.trim() && parsed.newValue === null) invalid = true;
    if (percent.trim() && parsed.percent === null) invalid = true;
    if (parsed.newValue !== null && parsed.percent !== null) {
      rangeWarning = exceedsMagnitude(parsed.newValue, parsed.percent);
      const original = reversePercent(parsed.newValue, parsed.percent);
      if (original === undefined) {
        primary = "Undefined";
        direction = "Undefined";
        detail =
          "The original value is undefined when the change is exactly −100%. A −100% change means the new value is 0 for every starting number, so there is no single original.";
        formula = `${formatAmount(parsed.newValue, display)} ÷ (1 + (−100) ÷ 100) is undefined`;
      } else {
        // Reverse mode answers "what was the original?", so label the value itself, not the change.
        direction = "Original value";
        directionClass = "no-change";
        primary = formatAmount(original, display === "currency" || showPayPeriods ? "currency" : display);
        detail = `The new figure is ${formatAmount(parsed.newValue, display === "currency" || showPayPeriods ? "currency" : display)} after a ${formatPercent(parsed.percent)} change.`;
        formula = `${formatAmount(parsed.newValue, display === "currency" || showPayPeriods ? "currency" : "number")} ÷ (1 + ${formatNumber(parsed.percent)} ÷ 100) = ${formatAmount(original, display === "currency" || showPayPeriods ? "currency" : "number")}`;
        if (showPayPeriods) pay = grossPayPeriods(parsed.newValue);
      }
    }
  }

  if (invalid) {
    primary = "Check the numbers";
    detail = "Use a plain number, a decimal, or US currency such as $1,850. Words and extra decimal points are ignored.";
    formula = "Enter a valid number to see the formula.";
    direction = "Undefined";
    directionClass = "undefined";
  } else if (rangeWarning) {
    detail = `${detail} One of these numbers is larger than 1,000,000,000,000,000, so double-check it.`;
  }

  const hintId = `${baseId}-hint`;
  const liveId = `${baseId}-live`;

  return (
    <form
      class="card calculator"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <fieldset class="modes">
        <legend>Calculator mode</legend>
        {(
          [
            ["find", "Find percent", "Find the percent increase or decrease"],
            ["add", "Add percent", "Add a percent to a value"],
            ["reverse", "Reverse", "Recover the original from a new value and a percent"],
          ] as const
        ).map(([id, label, aria]) => (
          <label class={mode === id ? "on" : ""} key={id}>
            <input
              type="radio"
              name={`${baseId}-mode`}
              value={id}
              checked={mode === id}
              aria-label={aria}
              data-testid={`mode-${id}`}
              onChange={() => {
                setMode(id);
                syncUrl({ mode: id });
              }}
            />
            {label}
          </label>
        ))}
      </fieldset>

      <div class="fields">
        {mode === "find" ? (
          <>
            <label class="field">
              {labels.from}
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellcheck={false}
                value={from}
                data-testid="input-from"
                aria-describedby={hintId}
                onInput={(event) => {
                  const next = readInput(event);
                  setFrom(next);
                  syncUrl({ from: next });
                }}
              />
            </label>
            <label class="field">
              {labels.to}
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellcheck={false}
                value={to}
                data-testid="input-to"
                aria-describedby={hintId}
                onInput={(event) => {
                  const next = readInput(event);
                  setTo(next);
                  syncUrl({ to: next });
                }}
              />
            </label>
          </>
        ) : null}

        {mode === "add" ? (
          <>
            <label class="field">
              {labels.value}
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellcheck={false}
                value={value}
                data-testid="input-value"
                aria-describedby={hintId}
                onInput={(event) => {
                  const next = readInput(event);
                  setValue(next);
                  syncUrl({ value: next });
                }}
              />
            </label>
            <label class="field">
              {labels.percent}
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellcheck={false}
                value={percent}
                data-testid="input-percent"
                aria-describedby={hintId}
                onInput={(event) => {
                  const next = readInput(event);
                  setPercent(next);
                  syncUrl({ percent: next });
                }}
              />
            </label>
          </>
        ) : null}

        {mode === "reverse" ? (
          <>
            <label class="field">
              {labels.new}
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellcheck={false}
                value={newValue}
                data-testid="input-new"
                aria-describedby={hintId}
                onInput={(event) => {
                  const next = readInput(event);
                  setNewValue(next);
                  syncUrl({ newValue: next });
                }}
              />
            </label>
            <label class="field">
              {labels.reversePercent}
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellcheck={false}
                value={percent}
                data-testid="input-percent"
                aria-describedby={hintId}
                onInput={(event) => {
                  const next = readInput(event);
                  setPercent(next);
                  syncUrl({ percent: next });
                }}
              />
            </label>
          </>
        ) : null}
      </div>
      <p class="hint" id={hintId}>
        Paste plain numbers or US currency, such as $1,850.
      </p>

      <div class="result" id={liveId} aria-live="polite" aria-atomic="true" data-testid="result">
        <p class={`direction ${directionClass}`} data-testid="direction">
          {direction}
        </p>
        <p class="result-value" data-testid="result-value">
          {primary}
        </p>
        <p class="detail">{detail}</p>
        <p class="formula" data-testid="formula">
          {formula}
        </p>
        {pay ? (
          <table class="pay-table">
            <caption>Gross pay from the new annual salary</caption>
            <thead>
              <tr>
                <th scope="col">Period</th>
                <th scope="col">Gross</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Annual</th>
                <td>{formatCurrency(pay.annual)}</td>
              </tr>
              <tr>
                <th scope="row">Monthly</th>
                <td>{formatCurrency(pay.monthly)}</td>
              </tr>
              <tr>
                <th scope="row">Semimonthly</th>
                <td>{formatCurrency(pay.semimonthly)}</td>
              </tr>
              <tr>
                <th scope="row">Biweekly</th>
                <td>{formatCurrency(pay.biweekly)}</td>
              </tr>
              <tr>
                <th scope="row">Weekly</th>
                <td>{formatCurrency(pay.weekly)}</td>
              </tr>
              <tr>
                <th scope="row">Hourly</th>
                <td>{formatCurrency(pay.hourly)}</td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </div>

      <div class="actions">
        <button
          type="button"
          data-testid="copy-link"
          onClick={async () => {
            const href = shareHref();
            syncUrl();
            try {
              await navigator.clipboard.writeText(href);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            } catch {
              setCopied(false);
              window.prompt("Copy this link", href);
            }
          }}
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <button
          type="button"
          class="secondary"
          onClick={() => {
            setFrom("");
            setTo("");
            setValue("");
            setPercent("");
            setNewValue("");
            syncUrl({ from: "", to: "", value: "", percent: "", newValue: "" });
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
}
