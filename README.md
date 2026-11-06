# Percentage Increase Calculator

Static site for [percentageincreasecalculator.us](https://percentageincreasecalculator.us). Astro renders the pages, and a small Preact island runs the calculators in the browser.

The home tool has three modes:

- **Find percent** — old value to new value. A drop is labeled as a decrease. A starting value of 0 is undefined.
- **Add percent** — apply a percent to a value, including pasted currency such as `$1,850`.
- **Reverse** — recover the original from the new value and the percent. A change of exactly −100% is undefined.

Percentage difference uses the average of the two numbers and has its own page. It is not a fourth mode of the increase calculator.

Shareable links round-trip the inputs:

- `/?mode=find&from=4&to=5`
- `/?mode=add&value=1850&percent=5`
- `/?mode=reverse&new=13&percent=30`

## Scripts

```bash
npm install
npm test          # math tests
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/
npm run verify    # production build plus browser checks
```

`npm test` uses Node’s built-in test runner. No calculator input is sent to a server.

## Lighthouse

Mobile lab run against the preview server, with Chrome already installed:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
npx lighthouse http://127.0.0.1:4321/ \
  --form-factor=mobile \
  --screenEmulation.mobile \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new --no-sandbox" \
  --output=html \
  --output-path=./lighthouse-mobile.html
```

The target is 100 in Performance, Accessibility, Best Practices, and SEO. The page is static HTML, system fonts, and one small Preact island, with no analytics script.

## Deploy on Vercel

The project is a static Astro site.

1. Import the GitHub repository into Vercel.
2. Framework preset: **Astro**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Attach the production domain `percentageincreasecalculator.us`.

No server function is required. Canonical, Open Graph, Twitter, FAQ, and WebApplication metadata use `https://percentageincreasecalculator.us`. `public/robots.txt` points at the generated sitemap.
