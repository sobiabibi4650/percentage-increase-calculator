import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Astro inlines the island style inside <body>, which is invalid HTML. Move it into <head> after the build.
const hoistIslandStyle = {
  name: "hoist-island-style",
  hooks: {
    "astro:build:done": async ({ pages, dir }) => {
      for (const { pathname } of pages) {
        const file = fileURLToPath(new URL(pathname === "" ? "index.html" : pathname.endsWith(".html") ? pathname : `${pathname.replace(/\/$/, "")}/index.html`, dir));
        let html;
        try { html = await readFile(file, "utf8"); } catch { continue; }
        const re = /<style>astro-island,astro-slot,astro-static-slot\{display:contents\}<\/style>/g;
        if (!re.test(html)) continue;
        html = html.replace(re, "").replace("</head>", "<style>astro-island,astro-slot,astro-static-slot{display:contents}</style></head>");
        await writeFile(file, html);
      }
    },
  },
};

export default defineConfig({
  site: "https://percentageincreasecalculator.us",
  trailingSlash: "never",
  build: { inlineStylesheets: "always" },
  integrations: [
    preact(),
    hoistIslandStyle,
    sitemap({
      filter: (page) => !page.includes("/404"),
      // Every page was reviewed and updated on this date; bump it on future content updates.
      lastmod: new Date("2026-11-09"),
      changefreq: "monthly",
    }),
  ],
});
