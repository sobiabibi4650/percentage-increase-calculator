export type CalcMode = "find" | "add" | "reverse";

export type Direction = "increase" | "decrease" | "no-change";

export const MAX_ABS = 1e15;

export const PAY_PERIODS = {
  months: 12,
  semimonths: 24,
  biweeks: 26,
  weeks: 52,
  hours: 2080,
} as const;

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
});

const percentFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
  minimumFractionDigits: 0,
});

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function parseNumber(input: string): number | null {
  if (typeof input !== "string") return null;
  let source = input.trim();
  if (!source) return null;

  let negative = false;
  if (source.startsWith("(") && source.endsWith(")") && source.length > 2) {
    negative = true;
    source = source.slice(1, -1).trim();
  }

  source = source.replace(/[−–]/g, "-");
  if (source.startsWith("+")) {
    source = source.slice(1).trim();
  } else if (source.startsWith("-")) {
    negative = !negative;
    source = source.slice(1).trim();
  }

  source = source.replace(/[$£€¥\s]/g, "").replace(/,/g, "");
  if (source.endsWith("%")) source = source.slice(0, -1);
  if (source.endsWith(".")) source = source.slice(0, -1);
  if (!source) return null;
  if (!/^(\d+\.?\d*|\.\d+)$/.test(source)) return null;

  const value = Number(source);
  if (!Number.isFinite(value)) return null;
  return negative ? -value : value;
}

export function isWithinRange(value: number): boolean {
  return Number.isFinite(value) && Math.abs(value) <= MAX_ABS;
}

export function exceedsMagnitude(...values: number[]): boolean {
  return values.some((value) => Number.isFinite(value) && Math.abs(value) > MAX_ABS);
}

export function percentChange(from: number, to: number): number | undefined {
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === 0) return undefined;
  const result = ((to - from) / from) * 100;
  return Number.isFinite(result) ? result : undefined;
}

export function addPercent(value: number, percent: number): number | undefined {
  if (!Number.isFinite(value) || !Number.isFinite(percent)) return undefined;
  const result = value * (1 + percent / 100);
  return Number.isFinite(result) ? result : undefined;
}

export function reversePercent(newValue: number, percent: number): number | undefined {
  if (!Number.isFinite(newValue) || !Number.isFinite(percent) || percent === -100) {
    return undefined;
  }
  const factor = 1 + percent / 100;
  if (factor === 0) return undefined;
  const original = newValue / factor;
  return Number.isFinite(original) ? original : undefined;
}

export function percentageDifference(a: number, b: number): number | undefined {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return undefined;
  const average = (a + b) / 2;
  if (average === 0) return undefined;
  const result = (Math.abs(a - b) / Math.abs(average)) * 100;
  return Number.isFinite(result) ? result : undefined;
}

export function directionOf(value: number): Direction | undefined {
  if (!Number.isFinite(value)) return undefined;
  if (value > 0) return "increase";
  if (value < 0) return "decrease";
  return "no-change";
}

export function directionLabel(direction: Direction): string {
  if (direction === "increase") return "Increase";
  if (direction === "decrease") return "Decrease";
  return "No change";
}

export interface PayBreakdown {
  annual: number;
  monthly: number;
  semimonthly: number;
  biweekly: number;
  weekly: number;
  hourly: number;
}

export function grossPayPeriods(annual: number): PayBreakdown | undefined {
  if (!Number.isFinite(annual)) return undefined;
  return {
    annual,
    monthly: annual / PAY_PERIODS.months,
    semimonthly: annual / PAY_PERIODS.semimonths,
    biweekly: annual / PAY_PERIODS.biweeks,
    weekly: annual / PAY_PERIODS.weeks,
    hourly: annual / PAY_PERIODS.hours,
  };
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "undefined";
  return numberFormat.format(value);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "undefined";
  return `${percentFormat.format(value)}%`;
}

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "undefined";
  return currencyFormat.format(value);
}

export interface QueryState {
  mode: CalcMode;
  from?: string;
  to?: string;
  value?: string;
  percent?: string;
  newValue?: string;
}

function canonicalParam(raw: string | undefined): string | undefined {
  if (!raw) return raw;
  const parsed = parseNumber(raw);
  if (parsed === null) return raw;
  return Object.is(parsed, -0) ? "0" : String(parsed);
}

export function buildQuery(state: QueryState): string {
  const params = new URLSearchParams();
  params.set("mode", state.mode);
  const from = canonicalParam(state.from);
  const to = canonicalParam(state.to);
  const value = canonicalParam(state.value);
  const percent = canonicalParam(state.percent);
  const newValue = canonicalParam(state.newValue);
  if (state.mode === "find") {
    if (from) params.set("from", from);
    if (to) params.set("to", to);
  } else if (state.mode === "add") {
    if (value) params.set("value", value);
    if (percent) params.set("percent", percent);
  } else {
    if (newValue) params.set("new", newValue);
    if (percent) params.set("percent", percent);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function parseQuery(search: string): Partial<QueryState> & { rawNew?: string } {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const modeRaw = params.get("mode");
  const mode = modeRaw === "find" || modeRaw === "add" || modeRaw === "reverse" ? modeRaw : undefined;
  const read = (key: string) => {
    const value = params.get(key);
    return value === null ? undefined : value;
  };
  return {
    mode,
    from: read("from"),
    to: read("to"),
    value: read("value"),
    percent: read("percent"),
    newValue: read("new"),
    rawNew: read("new"),
  };
}
