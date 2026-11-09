export interface NavLink { href: string; label: string; blurb?: string }

export const calculators: NavLink[] = [
  { href: "/", label: "Percentage Increase", blurb: "Old vs new value" },
  { href: "/percent-change-calculator", label: "Percent Change", blurb: "Up or down, signed" },
  { href: "/percentage-decrease-calculator", label: "Percentage Decrease", blurb: "How far it fell" },
  { href: "/percentage-difference-calculator", label: "Percentage Difference", blurb: "Compare two values" },
  { href: "/percentage-calculator", label: "Percentage Calculator", blurb: "X% of Y, X is what % of Y" },
  { href: "/percent-off-calculator", label: "Percent Off / Discount", blurb: "Sale price and savings" },
  { href: "/markup-calculator", label: "Markup Calculator", blurb: "Cost to selling price" },
  { href: "/profit-margin-calculator", label: "Profit Percentage", blurb: "Margin and markup" },
  { href: "/percent-error-calculator", label: "Percent Error", blurb: "Measured vs actual" },
  { href: "/fraction-to-percent-calculator", label: "Fraction to Percent", blurb: "3/5, 4 1/4, 16/20" },
  { href: "/win-percentage-calculator", label: "Win Percentage", blurb: "Wins, losses, ties" },
  { href: "/add-percentage-calculator", label: "Add a Percentage", blurb: "Number plus X%" },
  { href: "/reverse-percentage-calculator", label: "Reverse Percentage", blurb: "Find the original" },
  { href: "/salary-increase-calculator", label: "Salary Increase", blurb: "Raises and pay periods" },
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
