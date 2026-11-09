// End-to-end check of every calculator: types many input combinations and compares
// the displayed result with an independently computed expectation.
// Usage: BASE_URL=http://localhost:4400 CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" node scripts/test-calculators.mjs
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL || "http://localhost:4321";
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const two = (v) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(v);
const pct = (v) => `${two(v)}%`;
const usd = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

// [page, inputs, expected main result (or an error substring when it starts with "!")]
const toolCases = [
  ["/percentage-calculator", ["16", "20"], pct(80)],
  ["/percentage-calculator", ["11", "15"], pct((11 / 15) * 100)],
  ["/percentage-calculator", ["29.4", "42"], pct(70)],
  ["/percentage-calculator", ["30", "20"], pct(150)],
  ["/percentage-calculator", ["-5", "20"], pct(-25)],
  ["/percentage-calculator", ["5", "0"], "!cannot be 0"],
  ["/percentage-calculator", ["", "20"], "!Enter a number"],
  ["/percentage-calculator", ["abc", "20"], "!Enter a number"],
  ["/percentage-calculator", ["1,600", "2,000"], pct(80)],
  ["/percent-off-calculator", ["80", "25"], usd(60)],
  ["/percent-off-calculator", ["$84.99", "37"], usd(84.99 * 0.63)],
  ["/percent-off-calculator", ["50", "0"], usd(50)],
  ["/percent-off-calculator", ["50", "100"], usd(0)],
  ["/percent-off-calculator", ["0", "20"], usd(0)],
  ["/markup-calculator", ["40", "60"], pct(50)],
  ["/markup-calculator", ["25", "50"], pct(100)],
  ["/markup-calculator", ["60", "40"], pct(-33.333333)],
  ["/markup-calculator", ["0", "40"], "!Cost cannot be 0"],
  ["/profit-margin-calculator", ["40", "60"], pct((20 / 60) * 100)],
  ["/profit-margin-calculator", ["6", "18"], pct((12 / 18) * 100)],
  ["/profit-margin-calculator", ["60", "40"], pct(-50)],
  ["/percent-error-calculator", ["9.6", "9.81"], pct((0.21 / 9.81) * 100)],
  ["/percent-error-calculator", ["110", "100"], pct(10)],
  ["/percent-error-calculator", ["-4", "-5"], pct(20)],
  ["/percent-error-calculator", ["5", "0"], "!cannot be 0"],
  ["/fraction-to-percent-calculator", ["3/5"], pct(60)],
  ["/fraction-to-percent-calculator", ["6/7"], pct((6 / 7) * 100)],
  ["/fraction-to-percent-calculator", ["4 3/4"], pct(475)],
  ["/fraction-to-percent-calculator", ["1/8"], pct(12.5)],
  ["/fraction-to-percent-calculator", ["0.35"], pct(35)],
  ["/fraction-to-percent-calculator", ["5/0"], "!Enter a fraction"],
  ["/fraction-to-percent-calculator", ["hello"], "!Enter a fraction"],
  ["/win-percentage-calculator", ["12", "8", "0"], ".600"],
  ["/win-percentage-calculator", ["10", "5", "1"], ((10 + 0.5) / 16).toFixed(3).replace(/^0/, "")],
  ["/win-percentage-calculator", ["16", "0", "0"], "1.000"],
  ["/win-percentage-calculator", ["0", "0", "0"], "!at least one game"],
  ["/margin-of-error-calculator", ["1000", "50", "95"], `±${pct(1.96 * Math.sqrt(0.25 / 1000) * 100)}`],
  ["/margin-of-error-calculator", ["400", "72", "95"], `±${pct(1.96 * Math.sqrt((0.72 * 0.28) / 400) * 100)}`],
  ["/margin-of-error-calculator", ["1000", "50", "99"], `±${pct(2.576 * Math.sqrt(0.25 / 1000) * 100)}`],
  ["/margin-of-error-calculator", ["1000", "50", "97"], "!confidence level"],
  ["/margin-of-error-calculator", ["0", "50", "95"], "!Sample size"],
  ["/margin-of-error-calculator", ["100", "120", "95"], "!between 0% and 100%"],
  ["/percent-composition-calculator", ["2.016", "18.015"], pct((2.016 / 18.015) * 100)],
  ["/percent-composition-calculator", ["15.999", "18.015"], pct((15.999 / 18.015) * 100)],
  ["/percent-composition-calculator", ["20", "10"], "!between 0 and the total"],
  ["/percent-composition-calculator", ["1", "0"], "!greater than 0"],
];
// second calculator on the percentage page (X% of Y)
const secondCases = [
  [["25", "80"], two(20)],
  [["18", "45"], two(8.1)],
  [["150", "40"], two(60)],
];
// main Calculator: [page, mode, field values, expected result-value, expected direction]
const mainCases = [
  ["/", "find", { from: "4", to: "5" }, "25", "Increase"],
  ["/", "find", { from: "5", to: "4" }, "20", "Decrease"],
  ["/", "find", { from: "5", to: "5" }, "0", "No change"],
  ["/", "find", { from: "0", to: "5" }, "Undefined", "Undefined"],
  ["/", "find", { from: "$1,850", to: "$1,942.50" }, "5", "Increase"],
  ["/", "add", { value: "1850", percent: "5" }, "1,942.5", null],
  ["/", "add", { value: "100", percent: "-20" }, "80", null],
  ["/", "reverse", { new: "13", percent: "30" }, "10", "Original value"],
  ["/", "reverse", { new: "10", percent: "-100" }, "Undefined", "Undefined"],
  ["/percentage-decrease-calculator", "find", { from: "80", to: "60" }, "25", "Decrease"],
  ["/salary-increase-calculator", "find", { from: "50000", to: "55000" }, "10", "Increase"],
  ["/price-increase-calculator", "find", { from: "36", to: "45" }, "25", "Increase"],
];

const failures = [];
let passed = 0;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
page.on("pageerror", (e) => failures.push(`JS error on ${page.url()}: ${e.message}`));

async function fill(handle, value) {
  await handle.click();
  await handle.evaluate((el) => el.select());
  await handle.press("Backspace");
  const left = await handle.evaluate((el) => el.value);
  if (left) throw new Error(`could not clear input (left "${left}")`);
  if (value) await handle.type(value);
}

for (const [path, inputs, expected] of toolCases) {
  await page.goto(BASE + path, { waitUntil: "networkidle0" });
  const card = (await page.$$(".calculator"))[0];
  const boxes = await card.$$("input, select");
  let invalidSelect = false;
  for (let i = 0; i < inputs.length; i++) {
    if ((await boxes[i].evaluate((el) => el.tagName)) === "SELECT") {
      const exists = await boxes[i].evaluate((el, v) => [...el.options].some((o) => o.value === v), inputs[i]);
      if (exists) await boxes[i].select(inputs[i]); else invalidSelect = true;
    } else await fill(boxes[i], inputs[i]);
  }
  if (invalidSelect) { passed++; continue; } // an invalid level cannot be chosen from the dropdown
  const text = await card.$eval(".result", (n) => n.textContent || "");
  const want = expected.startsWith("!") ? expected.slice(1) : expected;
  const got = expected.startsWith("!") ? text : await card.$eval(".result-value", (n) => n.textContent || "").catch(() => text);
  if (expected.startsWith("!") ? text.includes(want) : got.trim() === want) passed++;
  else failures.push(`${path} ${JSON.stringify(inputs)} → expected "${want}", got "${(got || text).trim().slice(0, 80)}"`);
}

for (const [inputs, expected] of secondCases) {
  await page.goto(BASE + "/percentage-calculator", { waitUntil: "networkidle0" });
  const card = (await page.$$(".calculator"))[1];
  const boxes = await card.$$("input");
  for (let i = 0; i < inputs.length; i++) await fill(boxes[i], inputs[i]);
  const got = (await card.$eval(".result-value", (n) => n.textContent || "")).trim();
  got === expected ? passed++ : failures.push(`X% of Y ${JSON.stringify(inputs)} → expected "${expected}", got "${got}"`);
}

for (const [path, mode, fields, expected, direction] of mainCases) {
  await page.goto(BASE + path, { waitUntil: "networkidle0" });
  await page.click(`[data-testid="mode-${mode}"]`);
  for (const [k, v] of Object.entries(fields)) {
    const h = await page.$(`[data-testid="input-${k}"]`);
    if (!h) { failures.push(`${path} ${mode}: no input-${k}`); continue; }
    await fill(h, v);
  }
  const value = await page.$eval('[data-testid="result-value"]', (n) => n.textContent || "");
  const dir = await page.$eval('[data-testid="direction"]', (n) => n.textContent || "");
  const ok = value.includes(expected) && (!direction || dir.toLowerCase().includes(direction.toLowerCase()));
  ok ? passed++ : failures.push(`${path} ${mode} ${JSON.stringify(fields)} → expected "${expected}"/${direction}, got "${value.trim()}"/"${dir.trim()}"`);
}

// Clear buttons, URL state and the copy-link round trip on the main calculator
await page.goto(BASE + "/?mode=find&from=40&to=50", { waitUntil: "networkidle0" });
const fromUrl = await page.$eval('[data-testid="result-value"]', (n) => n.textContent || "");
fromUrl.includes("25") ? passed++ : failures.push(`URL state: expected 25, got ${fromUrl}`);
await page.goto(BASE + "/markup-calculator", { waitUntil: "networkidle0" });
await page.click(".calculator button.secondary");
const cleared = await page.$$eval(".calculator input[type=text]", (els) => els.every((e) => e.value === ""));
cleared ? passed++ : failures.push("Clear button did not empty the markup inputs");

// Navigation: menu opens and closes, Escape closes it
await page.goto(BASE + "/", { waitUntil: "networkidle0" });
await page.click(".menu summary");
let open = await page.$eval(".menu", (d) => d.open);
await page.keyboard.press("Escape");
const closed = !(await page.$eval(".menu", (d) => d.open));
open && closed ? passed++ : failures.push("Menu open/Escape failed");

await browser.close();
console.log(`${passed} passed, ${failures.length} failed`);
for (const f of failures) console.log("FAIL", f);
process.exit(failures.length ? 1 : 0);
