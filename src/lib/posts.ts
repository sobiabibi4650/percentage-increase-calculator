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
<h2>Method 3: How to do percentages off in your head</h2>
<p>Move the decimal one place left to get 10%: $7.00. Multiply by 3 for 30%: $21. Subtract from $70 and you have $49. This works for any discount that is a multiple of 5 (use half of 10% for 5%).</p>
<h2>Watch out: discounts do not add up</h2>
<p>“30% off, plus an extra 20% at checkout” is not 50% off. You pay 0.70 × 0.80 = 0.56 of the price, which is a <strong>44% total discount</strong>. On our $70 jacket that is $39.20, not $35.</p>
<h2>Finding the percent off from two prices</h2>
<p>If you know the original and sale prices, divide the drop by the original. $70 down to $49 is $21 ÷ $70 = 30% off. That is a percentage decrease, so the <a href="/percentage-decrease-calculator">percentage decrease calculator</a> handles it directly.</p>
<h2>Don't forget sales tax</h2>
<p>In most US states, tax is added after the discount. Our $70 jacket at 30% off costs $49 before tax. With an 8% sales tax, the total at the register is $49 × 1.08 = $52.92. If you are budgeting, add tax as the last step, not the first.</p>
<h2>Quick reference for common discounts</h2>
<p>These are worth memorizing because they come up constantly:</p>
<ul>
<li><strong>10% off:</strong> pay 90%. Move the decimal one place and subtract.</li>
<li><strong>20% off:</strong> pay 80%. Double the 10% figure and subtract.</li>
<li><strong>25% off:</strong> pay 75%. Take a quarter off.</li>
<li><strong>33% off:</strong> pay about two thirds.</li>
<li><strong>50% off:</strong> pay half.</li>
</ul>
<p>When the math gets messy, such as 37% off $84.99, let the <a href="/percent-off-calculator">percent off calculator</a> do it. It shows both the sale price and how much you keep in your pocket.</p>`,
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
<p>Retailers often set prices with markup because it starts from a known cost. Accountants and investors report margin because it compares to revenue. Use the <a href="/profit-margin-calculator">profit margin calculator</a> when you need the margin view.</p>
<h2>A pricing example from start to finish</h2>
<p>Say you run a small online shop and a phone case costs you $8 to make and ship. You want a 60% gross margin. Using the margin formula backward, the price is $8 ÷ (1 − 0.60) = $20. Check it: profit is $12, and $12 ÷ $20 is 60%. Measured on cost instead, that same $12 is a 150% markup.</p>
<p>Now imagine you had told a new employee to "add 60%" to cost. They would price the case at $8 × 1.6 = $12.80, which is only a 37.5% margin. Spelling out which number you mean saves real money.</p>
<h2>Three mistakes to avoid</h2>
<ul>
<li><strong>Quoting a margin target but pricing with markup.</strong> This is the costly one shown above.</li>
<li><strong>Leaving out hidden costs.</strong> Payment fees, shipping, and returns all come out of your margin even if they are not part of the product cost.</li>
<li><strong>Comparing your markup with a competitor's margin.</strong> The two numbers are not on the same scale, so a 50% markup is not "the same" as a 50% margin.</li>
</ul>
<p>If you want to work from cost, the <a href="/markup-calculator">markup calculator</a> shows both figures side by side.</p>`,
  },
  {
    slug: "why-a-50-percent-loss-needs-a-100-percent-gain",
    title: "Why a 50% Loss Needs a 100% Gain to Break Even",
    description: "Percent changes are not symmetric. See why drops hurt more than equal gains help, with a recovery table for investors, prices, and sales.",
    published: "2026-11-09",
    readMins: 4,
    tool: { href: "/percent-change-calculator", label: "Percent change calculator" },
    html: `
<p>If a $100 investment falls 50%, it is worth $50. A 50% gain on that $50 only brings it back to $75. To get back to $100, it has to double, which is a <strong>100% gain</strong>. This lopsided math catches out investors, shoppers, and anyone reading sales reports.</p>
<h2>The base keeps moving</h2>
<p>Every percent change is measured against the number you start from. After a drop, you are starting from a smaller base, so the same dollar gap is a bigger share of it. Going from $100 to $50 is $50 off a base of $100, which is 50%. Coming back from $50 to $100 is $50 on a base of $50, which is 100%.</p>
<h2>Recovery table</h2>
<div class="table-scroll"><table class="data"><thead><tr><th>Loss</th><th>Gain needed to break even</th></tr></thead><tbody>
<tr><td>10%</td><td>11.11%</td></tr><tr><td>20%</td><td>25%</td></tr><tr><td>25%</td><td>33.33%</td></tr><tr><td>33.33%</td><td>50%</td></tr><tr><td>50%</td><td>100%</td></tr><tr><td>75%</td><td>300%</td></tr><tr><td>90%</td><td>900%</td></tr></tbody></table></div>
<p>The formula behind the table is: gain needed = loss ÷ (1 − loss). For a 20% loss, 0.20 ÷ 0.80 = 0.25, or 25%.</p>
<h2>Where this shows up in real life</h2>
<p><strong>Prices.</strong> A store that cuts a $200 coat by 25% to $150 has to raise it 33.33%, not 25%, to get back to $200.</p>
<p><strong>Pay.</strong> A 10% pay cut followed by a 10% raise leaves you 1% behind. $1,000 becomes $900, and $900 plus 10% is $990.</p>
<p><strong>Business numbers.</strong> If monthly sales fall from 4,000 to 3,000 units, that is a 25% drop. A report saying sales are "up 25%" the next month would only bring them to 3,750.</p>
<h2>Check your own numbers</h2>
<p>Enter the before and after values in the <a href="/percent-change-calculator">percent change calculator</a> to see the true change in either direction. If you know the final value and the percent, the <a href="/reverse-percentage-calculator">reverse percentage calculator</a> recovers the starting number.</p>`,
  },
];
