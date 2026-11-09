import puppeteer from "puppeteer-core";
const out = process.argv[2];
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;width:1200px;height:630px;font-family:"Segoe UI",system-ui,sans-serif;background:linear-gradient(135deg,#eff6ff 0%,#ffffff 55%,#f0fdfa 100%);color:#0f172a;display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box;position:relative;overflow:hidden}
.brand{display:flex;align-items:center;gap:18px;font-size:34px;font-weight:600;letter-spacing:-.02em}
.brand b{color:#1d4ed8;font-weight:800}.brand small{color:#475569;font-size:24px}
h1{font-size:76px;line-height:1.05;margin:42px 0 22px;letter-spacing:-.035em;font-weight:900;max-width:820px}
p{font-size:30px;color:#475569;margin:0;max-width:600px}
.chips{display:flex;gap:14px;margin-top:40px}
.chips span{background:#fff;border:2px solid #e2e8f0;border-radius:999px;padding:10px 22px;font-size:24px;font-weight:700}
.card{position:absolute;right:80px;top:150px;width:300px;padding:30px;border-radius:28px;background:#fff;box-shadow:0 30px 60px -25px rgba(15,23,42,.35)}
.card .k{font-size:22px;color:#475569}.card .v{font-size:84px;font-weight:900;letter-spacing:-.04em}
.card .tag{display:inline-block;background:#dcfce7;color:#166534;font-weight:800;font-size:20px;border-radius:999px;padding:6px 14px}
</style></head><body>
<div class="brand"><svg width="64" height="64" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1d4ed8"/><stop offset="1" stop-color="#0d9488"/></linearGradient></defs><rect width="40" height="40" rx="11" fill="url(#g)"/><circle cx="12.5" cy="13" r="4.2" fill="none" stroke="#fff" stroke-width="3"/><circle cx="27.5" cy="27" r="4.2" fill="none" stroke="#fff" stroke-width="3"/><path d="M10 31 L29.5 9.5" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M22.5 9 H30 V16.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Percentage<b>Increase</b><small>.us</small></span></div>
<h1>Free percentage calculators</h1>
<p>Percent increase, change, off, markup, margin, and more, with the working shown.</p>
<div class="chips"><span>Free</span><span>No sign-up</span><span>Private</span></div>
<div class="card"><span class="tag">Increase</span><div class="v">25%</div><div class="k">From 4 to 5</div></div>
</body></html>`;
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: "load" });
await page.screenshot({ path: out, type: "png" });
await browser.close();
console.log("wrote", out);
