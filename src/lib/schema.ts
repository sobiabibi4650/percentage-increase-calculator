export const SITE_ORIGIN = "https://percentageincreasecalculator.us";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Crumb {
  name: string;
  path: string;
}

export function absoluteUrl(path: string): string {
  if (path === "" || path === "/") return `${SITE_ORIGIN}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function webApplicationSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript for the interactive calculator.",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: Crumb[]) {
  const crumbs = [{ name: "Home", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
