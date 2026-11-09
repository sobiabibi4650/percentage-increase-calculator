export interface Post {
  slug: string;
  title: string;
  description: string;
  published: string;
  readMins: number;
  tool: { href: string; label: string };
  html: string;
}

export const posts: Post[] = [
  {
    slug: "how-to-find-percent-off",
    title: "How to Find Percent Off: 3 Fast Methods (With Examples)",
    description: "Three quick ways to work out a percent-off discount in your head, on a phone, or in a spreadsheet, plus the stacking-coupon trap.",
    published: "2026-11-09",
    readMins: 4,
    tool: { href: "/percent-off-calculator", label: "Percent off calculator" },
    html: `
<p>A store tag says <strong>30% off</strong> a $70 jacket. What do you actually pay? Here are three ways to answer, from fastest to most exact.</p>
<h2>Method 1: Multiply by what you keep</h2>
<p>If 30% comes off, you pay 70%. Multiply the price by 0.70: $70 × 0.70 = <strong>$49</strong>. This one-step method is the fastest on a phone calculator.</p>
<h2>Method 2: Find the savings, then subtract</h2>
<p>Find 30% of $70: 0.30 × 70 = $21. Subtract: $70 − $21 = $49. Two steps, but you also learn how much you saved.</p>
<h2>Method 3: The 10% trick for mental math</h2>
<p>Move the decimal one place left to get 10%: $7.00. Multiply by 3 for 30%: $21. Subtract from $70 and you have $49. This works for any discount that is a multiple of 5 (use half of 10% for 5%).</p>
<h2>Watch out: discounts do not add up</h2>
<p>“30% off, plus an extra 20% at checkout” is not 50% off. You pay 0.70 × 0.80 = 0.56 of the price, which is a <strong>44% total discount</strong>. On our $70 jacket that is $39.20, not $35.</p>
<h2>Finding the percent off from two prices</h2>
<p>If you know the original and sale prices, divide the drop by the original. $70 down to $49 is $21 ÷ $70 = 30% off. That is a percentage decrease, so the <a href="/percentage-decrease-calculator">percentage decrease calculator</a> handles it directly.</p>`,
  },
  {
    slug: "markup-vs-margin",
    title: "Markup vs Margin: Formulas and Conversion Chart",
    description: "Markup divides profit by cost; margin divides it by price. See why a 50% markup is only a 33% margin and how to convert between them.",
    published: "2026-11-09",
    readMins: 5,
    tool: { href: "/markup-calculator", label: "Markup calculator" },
    html: `
<p>Markup and margin both describe profit as a percentage, which is why they get confused. The difference is the denominator.</p>
<h2>The two formulas</h2>
<pre>Markup = (Price − Cost) ÷ Cost
Margin = (Price − Cost) ÷ Price</pre>
<p>Buy a lamp for $40 and sell it for $60. Profit is $20. Markup is $20 ÷ $40 = <strong>50%</strong>. Margin is $20 ÷ $60 = <strong>33.33%</strong>. Same sale, two very different numbers.</p>
<h2>Why it matters</h2>
<p>If you want a 50% margin but price with a 50% markup, you fall short by almost 17 points. On $100,000 of sales that is roughly $16,700 of expected profit that never shows up.</p>
<h2>Converting between them</h2>
<pre>Margin = Markup ÷ (1 + Markup)
Markup = Margin ÷ (1 − Margin)</pre>
<div class="table-scroll"><table class="data"><thead><tr><th>Markup</th><th>Margin</th></tr></thead><tbody>
<tr><td>25%</td><td>20%</td></tr><tr><td>50%</td><td>33.33%</td></tr><tr><td>75%</td><td>42.86%</td></tr><tr><td>100%</td><td>50%</td></tr><tr><td>200%</td><td>66.67%</td></tr></tbody></table></div>
<h2>Which one should you use?</h2>
<p>Retailers often set prices with markup because it starts from a known cost. Accountants and investors report margin because it compares to revenue. Use the <a href="/profit-margin-calculator">profit margin calculator</a> when you need the margin view.</p>`,
  },
  {
    slug: "how-to-calculate-percentage-of-a-number",
    title: "How to Calculate the Percentage of a Number",
    description: "The two everyday percentage questions, solved with one rule: X% of Y, and X out of Y as a percent. Includes test-score examples.",
    published: "2026-11-09",
    readMins: 4,
    tool: { href: "/percentage-calculator", label: "Percentage calculator" },
    html: `
<p>Almost every everyday percentage question is one of two shapes. Both come from the same idea: a percent is a number out of 100.</p>
<h2>1. What is X% of Y?</h2>
<p>Turn the percent into a decimal and multiply. 15% of 80 = 0.15 × 80 = <strong>12</strong>. A tip, a tax, or a commission all work this way.</p>
<h2>2. X is what percent of Y?</h2>
<p>Divide, then multiply by 100. On a test, 16 out of 20 = 16 ÷ 20 = 0.8 = <strong>80%</strong>. 24 out of 30 is also 80%, and 11 out of 15 is about 73.33%.</p>
<h2>A handy symmetry</h2>
<p>X% of Y always equals Y% of X. So 8% of 50 is the same as 50% of 8, which is 4. Flip the question when one side is easier.</p>
<h2>When the number changes</h2>
<p>If you are comparing an old and a new value, you want a percent change instead: (new − old) ÷ old × 100. The <a href="/percent-change-calculator">percent change calculator</a> labels the result as an increase or decrease.</p>`,
  },
];
