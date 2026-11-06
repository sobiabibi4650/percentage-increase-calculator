import { spawn } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import puppeteer from "puppeteer-core";

const PORT = 4391;
const BASE = `http://127.0.0.1:${PORT}`;
const CHROME = process.env.CHROME_PATH || "/usr/local/bin/google-chrome";

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
  else console.log(`ok ${message}`);
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, files);
    else if (path.endsWith(".html")) files.push(path);
  }
  return files;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited ${code}`));
    });
  });
}

await run("npm", ["run", "build"]);

const titles = new Map();
for (const file of walk("dist")) {
  const html = readFileSync(file, "utf8");
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  assert(title.length > 0, `title present in ${file}`);
  assert(!html.includes(">NaN<") && !html.includes(">Infinity<"), `no NaN/Infinity text in ${file}`);
  if (titles.has(title)) fail(`duplicate title "${title}" in ${file} and ${titles.get(title)}`);
  else titles.set(title, file);
  if (!file.endsWith("404.html")) {
    assert(html.includes('rel="canonical"'), `canonical in ${file}`);
    assert(html.includes("https://percentageincreasecalculator.us"), `site origin in ${file}`);
  }
}

async function stopPreview() {
  await Promise.race([
    new Promise((resolve) => {
      const stop = spawn("npx", ["astro", "preview", "stop"], { stdio: "ignore" });
      stop.on("exit", () => resolve(undefined));
      stop.on("error", () => resolve(undefined));
    }),
    delay(4000),
  ]);
}

await stopPreview();

const preview = spawn(
  "npx",
  ["astro", "preview", "--ignore-lock", "--host", "127.0.0.1", "--port", String(PORT)],
  { detached: true, stdio: "ignore" },
);

function shutdownPreview() {
  if (!preview.pid) return;
  try {
    process.kill(-preview.pid, "SIGTERM");
  } catch {
    preview.kill("SIGTERM");
  }
}

let ready = false;
try {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${BASE}/`);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      await delay(250);
    }
  }
  assert(ready, "preview server started");

  const routes = [
    "/",
    "/percent-change-calculator",
    "/percentage-decrease-calculator",
    "/salary-increase-calculator",
    "/price-increase-calculator",
    "/percentage-increase-formula",
    "/how-to-calculate-percentage-increase",
    "/excel-percentage-increase",
    "/percentage-points-vs-percentage-increase",
    "/add-percentage-calculator",
    "/reverse-percentage-calculator",
    "/percentage-difference-calculator",
    "/privacy",
    "/robots.txt",
    "/sitemap-index.xml",
  ];

  for (const route of routes) {
    const response = await fetch(`${BASE}${route}`);
    assert(response.status === 200, `${route} returns 200`);
    const body = await response.text();
    if (route.endsWith(".xml")) assert(body.includes("<urlset") || body.includes("<sitemapindex"), "sitemap xml");
    if (route === "/robots.txt") assert(body.includes("sitemap-index.xml"), "robots points at sitemap");
  }

  const missing = await fetch(`${BASE}/not-a-real-page`);
  assert(missing.status === 404, "unknown path returns 404");

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });

    async function readResult() {
      return page.$eval("[data-testid='result-value']", (node) => node.textContent || "");
    }

    async function replaceField(selector, text) {
      await page.$eval(
        selector,
        (element, value) => {
          const prototype = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
          prototype?.set?.call(element, value);
          element.dispatchEvent(new Event("input", { bubbles: true }));
        },
        text,
      );
    }

    await page.goto(`${BASE}/?mode=find&from=4&to=5`, { waitUntil: "networkidle0" });
    await page.waitForFunction(
      () => document.querySelector("[data-testid='result-value']")?.textContent?.includes("25%"),
    );
    const findBox = await page.$eval("h1", (node) => {
      const rect = node.getBoundingClientRect();
      const card = document.querySelector("[data-testid='result']")?.getBoundingClientRect();
      return { h1Top: rect.top, resultBottom: card?.bottom ?? 9999 };
    });
    assert(findBox.resultBottom < 844, "home result is above the fold on a phone viewport");
    assert((await readResult()).includes("25%"), "find 4 to 5 is 25%");
    assert((await page.$eval("[data-testid='direction']", (node) => node.textContent || "")).includes("Increase"), "4 to 5 is an increase");

    await replaceField("[data-testid='input-from']", "0");
    await page.waitForFunction(
      () => document.querySelector("[data-testid='result-value']")?.textContent === "Undefined",
    );
    const zeroText = await page.$eval("[data-testid='result']", (node) => node.textContent || "");
    assert(zeroText.includes("Undefined"), "starting value 0 is undefined");
    assert(!zeroText.includes("NaN") && !zeroText.includes("Infinity"), "zero case does not show NaN or Infinity");

    await page.goto(`${BASE}/?mode=add&value=1850&percent=5`, { waitUntil: "networkidle0" });
    await page.waitForFunction(() =>
      (document.querySelector("[data-testid='result-value']")?.textContent || "").includes("1,942.5"),
    );
    assert((await readResult()).includes("1,942.5"), "add 5% to 1850");

    await replaceField("[data-testid='input-value']", "$1,850");
    await page.waitForFunction(() =>
      (document.querySelector("[data-testid='result-value']")?.textContent || "").includes("1,942.5"),
    );
    const pastedUrl = page.url();
    assert(pastedUrl.includes("mode=add"), "add mode stays in the URL after paste");
    assert(pastedUrl.includes("1850"), "pasted currency lands in the share URL");

    await page.goto(`${BASE}/?mode=reverse&new=13&percent=30`, { waitUntil: "networkidle0" });
    await page.waitForFunction(() => {
      const text = document.querySelector("[data-testid='result-value']")?.textContent || "";
      return text.includes("10") && !text.includes("100");
    });
    assert((await readResult()).trim() === "10" || (await readResult()).includes("10"), "reverse 13 at 30% is 10");

    await replaceField("[data-testid='input-percent']", "-100");
    await page.waitForFunction(
      () => document.querySelector("[data-testid='result-value']")?.textContent === "Undefined",
    );
    const reverseText = await page.$eval("[data-testid='result']", (node) => node.textContent || "");
    assert(reverseText.includes("Undefined"), "reverse of -100% is undefined");
    assert(!reverseText.includes("NaN") && !reverseText.includes("Infinity"), "reverse -100 does not show NaN or Infinity");

    await page.goto(`${BASE}/percentage-difference-calculator?a=4&b=6`, { waitUntil: "networkidle0" });
    await page.waitForFunction(() =>
      (document.querySelector("[data-testid='difference-value']")?.textContent || "").includes("40%"),
    );
    const diffText = await page.$eval("[data-testid='difference-result']", (node) => node.textContent || "");
    assert(diffText.includes("40%"), "difference of 4 and 6 is 40%");
    assert(diffText.toLowerCase().includes("not a percentage increase"), "difference page warns it is not an increase");

    await page.goto(`${BASE}/salary-increase-calculator`, { waitUntil: "networkidle0" });
    await page.waitForFunction(() => document.body.textContent?.includes("Hourly"));
    const salaryText = await page.$eval("main", (node) => node.textContent || "");
    assert(salaryText.includes("Monthly") && salaryText.includes("Hourly"), "salary page lists monthly through hourly");
    assert(salaryText.includes("10%"), "50000 to 55000 is a 10% raise");
    assert(salaryText.toLowerCase().includes("not") || salaryText.toLowerCase().includes("before taxes"), "salary disclaimer is present");

    await page.goto(`${BASE}/percentage-decrease-calculator`, { waitUntil: "networkidle0" });
    await page.waitForFunction(() =>
      (document.querySelector("[data-testid='direction']")?.textContent || "").includes("Decrease"),
    );
    assert(
      (await page.$eval("[data-testid='direction']", (node) => node.textContent || "")).includes("Decrease"),
      "80 to 60 is labeled decrease",
    );
  } finally {
    await browser.close();
  }
} finally {
  shutdownPreview();
  await stopPreview();
}

if (process.exitCode) {
  console.error("Verification failed");
  process.exit(process.exitCode);
}
console.log("Verification passed");
process.exit(0);
