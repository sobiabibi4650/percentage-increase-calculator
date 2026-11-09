export interface NavLink { href: string; label: string; blurb?: string; short?: string }

export const calculators: NavLink[] = [
  { href: "/", label: "Percentage Increase", blurb: "Old vs new value", short: "Increase" },
  { href: "/percent-change-calculator", label: "Percent Change", blurb: "Up or down, signed", short: "Percent Change" },
  { href: "/percentage-decrease-calculator", label: "Percentage Decrease", blurb: "How far it fell", short: "Decrease" },
  { href: "/percentage-difference-calculator", label: "Percentage Difference", blurb: "Compare two values", short: "Difference" },
  { href: "/percentage-calculator", label: "Percentage Calculator", blurb: "X% of Y, X is what % of Y", short: "X of Y" },
  { href: "/percent-off-calculator", label: "Percent Off / Discount", blurb: "Sale price and savings", short: "Percent Off" },
  { href: "/markup-calculator", label: "Markup Calculator", blurb: "Cost to selling price", short: "Markup" },
  { href: "/profit-margin-calculator", label: "Profit Percentage", blurb: "Margin and markup", short: "Profit Margin" },
  { href: "/percent-error-calculator", label: "Percent Error", blurb: "Measured vs actual", short: "Percent Error" },
  { href: "/fraction-to-percent-calculator", label: "Fraction to Percent", blurb: "3/5, 4 1/4, 16/20", short: "Fraction to %" },
  { href: "/win-percentage-calculator", label: "Win Percentage", blurb: "Wins, losses, ties", short: "Win %" },
  { href: "/add-percentage-calculator", label: "Add a Percentage", blurb: "Number plus X%" },
  { href: "/reverse-percentage-calculator", label: "Reverse Percentage", blurb: "Find the original", short: "Reverse %" },
  { href: "/salary-increase-calculator", label: "Salary Increase", blurb: "Raises and pay periods", short: "Salary Raise" },
  { href: "/price-increase-calculator", label: "Price Increase", blurb: "Price hikes" },
];

export const guides: NavLink[] = [
  { href: "/percentage-increase-formula", label: "Percentage increase formula" },
  { href: "/how-to-calculate-percentage-increase", label: "How to calculate percentage increase" },
  { href: "/excel-percentage-increase", label: "Percentage increase in Excel" },
  { href: "/percentage-points-vs-percentage-increase", label: "Percentage points vs percent" },
  { href: "/blog", label: "Blog" },
];

export const company: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/disclaimer", label: "Disclaimer" },
];

/** Order of the quick-access chip row under the header (most-searched first). */
export const quick: NavLink[] = [
  "/", "/percent-change-calculator", "/percentage-calculator", "/percent-off-calculator", "/markup-calculator",
  "/profit-margin-calculator", "/percentage-decrease-calculator", "/percentage-difference-calculator",
  "/fraction-to-percent-calculator", "/percent-error-calculator", "/salary-increase-calculator", "/win-percentage-calculator",
].map((href) => calculators.find((c) => c.href === href)!);
