import { useEffect, useId, useState } from "preact/hooks";
import {
  exceedsMagnitude,
  formatNumber,
  formatPercent,
  parseNumber,
  percentageDifference,
} from "../lib/percent";

export interface DifferenceCalculatorProps {
  initialA?: string;
  initialB?: string;
  display?: "number" | "currency";
}

export default function DifferenceCalculator({
  initialA = "",
  initialB = "",
}: DifferenceCalculatorProps) {
  const hintId = useId();
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextA = params.get("a");
    const nextB = params.get("b");
    if (nextA !== null) setA(nextA);
    if (nextB !== null) setB(nextB);
  }, []);

  function readInput(event: Event): string {
    const target = event.target as { value?: unknown } | null;
    return typeof target?.value === "string" ? target.value : "";
  }

  function sync(nextA: string, nextB: string) {
    const params = new URLSearchParams();
    if (nextA) params.set("a", nextA);
    if (nextB) params.set("b", nextB);
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }

  const parsedA = parseNumber(a);
  const parsedB = parseNumber(b);
  const invalid = (a.trim() !== "" && parsedA === null) || (b.trim() !== "" && parsedB === null);
  let primary = "Enter both numbers";
  let detail = "Order does not matter. The baseline is the average of the two values.";
  let formula = "Waiting for two valid numbers.";

  if (invalid) {
    primary = "Check the numbers";
    detail = "Use a plain number, a decimal, or US currency such as $36.";
    formula = "Enter a valid number to see the formula.";
  } else if (parsedA !== null && parsedB !== null) {
    const diff = percentageDifference(parsedA, parsedB);
    const gap = Math.abs(parsedA - parsedB);
    if (diff === undefined) {
      primary = "Undefined";
      detail = "Percentage difference is undefined when the average of the two values is 0.";
      formula = `|${formatNumber(parsedA)} − ${formatNumber(parsedB)}| ÷ 0 is undefined`;
    } else {
      primary = formatPercent(diff);
      detail = `The values differ by ${formatNumber(gap)}. This is not a percentage increase, which would divide by the first number only.`;
      formula = `|${formatNumber(parsedA)} − ${formatNumber(parsedB)}| ÷ |(${formatNumber(parsedA)} + ${formatNumber(parsedB)}) ÷ 2| × 100 = ${formatPercent(diff)}`;
      if (exceedsMagnitude(parsedA, parsedB)) {
        detail = `${detail} One of these numbers is extremely large, so double-check it.`;
      }
    }
  }

  return (
    <form
      class="card calculator"
      onSubmit={(event) => event.preventDefault()}
    >
      <div class="fields">
        <label class="field">
          First value
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            spellcheck={false}
            value={a}
            data-testid="input-a"
            aria-describedby={hintId}
            onInput={(event) => {
              const next = readInput(event);
              setA(next);
              sync(next, b);
            }}
          />
        </label>
        <label class="field">
          Second value
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            spellcheck={false}
            value={b}
            data-testid="input-b"
            aria-describedby={hintId}
            onInput={(event) => {
              const next = readInput(event);
              setB(next);
              sync(a, next);
            }}
          />
        </label>
      </div>
      <p class="hint" id={hintId}>
        Neither value is “before” or “after.” Paste $36 or 36.
      </p>
      <div class="result" aria-live="polite" aria-atomic="true" data-testid="difference-result">
        <p class="direction no-change">Difference</p>
        <p class="result-value" data-testid="difference-value">
          {primary}
        </p>
        <p class="detail">{detail}</p>
        <p class="formula" data-testid="difference-formula">
          {formula}
        </p>
      </div>
      {/* Results update live; this lets keyboard and screen-reader users press Enter to submit. */}
      <button type="submit" class="sr-only">Calculate</button>
    </form>
  );
}
