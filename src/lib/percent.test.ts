import assert from "node:assert/strict";
import { describe, it } from "node:test";
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
  percentageDifference,
  reversePercent,
} from "./percent.ts";

function near(actual: number | undefined, expected: number): void {
  assert.equal(typeof actual, "number");
  assert.ok(Math.abs((actual as number) - expected) < 1e-9, `${actual} ~ ${expected}`);
}

describe("percentage math", () => {
  it("finds a 25% increase from 4 to 5", () => {
    near(percentChange(4, 5), 25);
  });

  it("finds a 20% drop from 5 to 4", () => {
    near(percentChange(5, 4), -20);
  });

  it("finds no change when the values match", () => {
    near(percentChange(100, 100), 0);
  });

  it("returns undefined when the starting value is 0, not NaN or Infinity", () => {
    const result = percentChange(0, 5);
    assert.equal(result, undefined);
    assert.ok(result !== Number.NaN);
    assert.ok(result !== Number.POSITIVE_INFINITY);
    assert.ok(result !== Number.NEGATIVE_INFINITY);
    assert.equal(percentChange(0, 0), undefined);
  });

  it("allows an increase above 100%", () => {
    near(percentChange(100, 250), 150);
  });

  it("handles decimal starting and ending values", () => {
    near(percentChange(10.5, 12.6), 20);
  });

  it("rejects non-finite inputs for percent change", () => {
    assert.equal(percentChange(Number.NaN, 5), undefined);
    assert.equal(percentChange(4, Number.POSITIVE_INFINITY), undefined);
  });

  it("adds 5% to 1850", () => {
    near(addPercent(1850, 5), 1942.5);
  });

  it("leaves a value unchanged when the percent is 0", () => {
    near(addPercent(100, 0), 100);
  });

  it("subtracts when the percent is negative", () => {
    near(addPercent(80, -25), 60);
  });

  it("keeps zero at zero when a percent is added", () => {
    near(addPercent(0, 15), 0);
  });

  it("rejects non-finite inputs when adding a percent", () => {
    assert.equal(addPercent(Number.NaN, 5), undefined);
    assert.equal(addPercent(10, Number.NEGATIVE_INFINITY), undefined);
  });

  it("recovers 10 as the original of 13 after a 30% increase", () => {
    near(reversePercent(13, 30), 10);
  });

  it("reverses a 5% increase on 1850", () => {
    near(reversePercent(1942.5, 5), 1850);
  });

  it("returns undefined for a reverse of exactly -100%, not Infinity", () => {
    const result = reversePercent(13, -100);
    assert.equal(result, undefined);
    assert.ok(result !== Number.POSITIVE_INFINITY);
    assert.ok(result !== Number.NEGATIVE_INFINITY);
    assert.equal(Number.isFinite(result as number), false);
  });

  it("returns undefined when reversing -100% of a new value of 0", () => {
    assert.equal(reversePercent(0, -100), undefined);
  });

  it("recovers the original after a decrease", () => {
    near(reversePercent(75, -25), 100);
  });

  it("rejects non-finite inputs when reversing a percent", () => {
    assert.equal(reversePercent(Number.POSITIVE_INFINITY, 30), undefined);
    assert.equal(reversePercent(13, Number.NaN), undefined);
  });

  it("parses US currency and thousands separators", () => {
    assert.equal(parseNumber("$1,850"), 1850);
    assert.equal(parseNumber("$1,850.50"), 1850.5);
    assert.equal(parseNumber("  1,850.5 "), 1850.5);
  });

  it("parses signs, percents, unicode minus, and accounting parentheses", () => {
    assert.equal(parseNumber("5%"), 5);
    assert.equal(parseNumber("−20"), -20);
    assert.equal(parseNumber("-$20"), -20);
    assert.equal(parseNumber("($1,200)"), -1200);
    assert.equal(parseNumber("+8.25"), 8.25);
  });

  it("rejects blank, junk, and ambiguous numbers", () => {
    assert.equal(parseNumber(""), null);
    assert.equal(parseNumber("   "), null);
    assert.equal(parseNumber("abc"), null);
    assert.equal(parseNumber("12.3.4"), null);
    assert.equal(parseNumber("$"), null);
    assert.equal(parseNumber("1e5"), null);
  });

  it("labels positive change as increase, negative as decrease, and zero as no change", () => {
    assert.equal(directionOf(25), "increase");
    assert.equal(directionLabel("increase"), "Increase");
    assert.equal(directionOf(-20), "decrease");
    assert.equal(directionLabel("decrease"), "Decrease");
    assert.equal(directionOf(0), "no-change");
    assert.equal(directionLabel("no-change"), "No change");
    assert.equal(directionOf(Number.NaN), undefined);
  });

  it("computes average-based percentage difference", () => {
    near(percentageDifference(4, 6), 40);
  });

  it("treats percentage difference as order-independent", () => {
    near(percentageDifference(6, 4), percentageDifference(4, 6) as number);
  });

  it("returns 0 difference when the two values match", () => {
    near(percentageDifference(18, 18), 0);
  });

  it("returns undefined percentage difference when the average is 0", () => {
    assert.equal(percentageDifference(5, -5), undefined);
    assert.equal(percentageDifference(0, 0), undefined);
  });

  it("breaks an annual gross salary into monthly through hourly pay", () => {
    const pay = grossPayPeriods(52000);
    assert.ok(pay);
    near(pay.annual, 52000);
    near(pay.monthly, 52000 / 12);
    near(pay.semimonthly, 52000 / 24);
    near(pay.biweekly, 2000);
    near(pay.weekly, 1000);
    near(pay.hourly, 25);
  });

  it("applies a 10% raise to a 50000 salary", () => {
    const next = addPercent(50000, 10);
    near(next, 55000);
    near((next as number) - 50000, 5000);
    const periods = grossPayPeriods(next as number);
    near(periods?.monthly as number, 55000 / 12);
    near(periods?.hourly as number, 55000 / 2080);
  });

  it("round-trips find mode query params", () => {
    const query = "?mode=find&from=4&to=5";
    assert.equal(buildQuery({ mode: "find", from: "4", to: "5" }), query);
    const parsed = parseQuery(query);
    assert.equal(parsed.mode, "find");
    assert.equal(parsed.from, "4");
    assert.equal(parsed.to, "5");
  });

  it("round-trips add mode query params", () => {
    const query = "?mode=add&value=1850&percent=5";
    assert.equal(buildQuery({ mode: "add", value: "1850", percent: "5" }), query);
    assert.equal(buildQuery({ mode: "add", value: "$1,850", percent: "5%" }), query);
    const parsed = parseQuery(query);
    assert.equal(parsed.mode, "add");
    assert.equal(parsed.value, "1850");
    assert.equal(parsed.percent, "5");
  });

  it("round-trips reverse mode query params", () => {
    const query = "?mode=reverse&new=13&percent=30";
    assert.equal(buildQuery({ mode: "reverse", newValue: "13", percent: "30" }), query);
    const parsed = parseQuery(query);
    assert.equal(parsed.mode, "reverse");
    assert.equal(parsed.newValue, "13");
    assert.equal(parsed.percent, "30");
  });

  it("ignores an unknown mode in the query string", () => {
    const parsed = parseQuery("?mode=difference&from=1&to=2");
    assert.equal(parsed.mode, undefined);
    assert.equal(parsed.from, "1");
    assert.equal(parsed.to, "2");
  });

  it("formats finite numbers and never prints NaN or Infinity", () => {
    assert.equal(formatPercent(25), "25%");
    assert.equal(formatPercent(-20), "-20%");
    assert.equal(formatNumber(1850), "1,850");
    assert.equal(formatCurrency(1942.5), "$1,942.50");
    for (const formatted of [
      formatPercent(Number.NaN),
      formatPercent(Number.POSITIVE_INFINITY),
      formatNumber(Number.NEGATIVE_INFINITY),
      formatCurrency(Number.NaN),
    ]) {
      assert.equal(formatted, "undefined");
      assert.equal(formatted.includes("NaN"), false);
      assert.equal(formatted.includes("Infinity"), false);
    }
  });

  it("flags magnitudes above 1e15", () => {
    assert.equal(exceedsMagnitude(1e15), false);
    assert.equal(exceedsMagnitude(1e15 + 1), true);
    assert.equal(exceedsMagnitude(4, 5), false);
    assert.equal(exceedsMagnitude(-1e16), true);
  });
});
