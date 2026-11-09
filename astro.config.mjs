import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://percentageincreasecalculator.us",
  trailingSlash: "never",
  build: { inlineStylesheets: "always" },
  integrations: [
    preact(),
    sitemap({
      filter: (page) => !page.includes("/404"),
      // Every page was reviewed and updated on this date; bump it on future content updates.
      lastmod: new Date("2026-11-09"),
      changefreq: "monthly",
    }),
  ],
});
