// Programmatic pages. Only conversions with measured US search demand (Semrush, Nov 2026) are listed,
// so every generated page answers a real query instead of padding the site.

export interface Score { part: number; whole: number }
export interface Fraction { whole: number; num: number; den: number }

export const scores: Score[] = [
  { part: 16, whole: 20 }, { part: 15, whole: 20 }, { part: 17, whole: 20 }, { part: 18, whole: 20 },
  { part: 14, whole: 20 }, { part: 24, whole: 30 }, { part: 25, whole: 30 }, { part: 11, whole: 15 },
  { part: 14, whole: 25 }, { part: 20, whole: 25 },
];

export const fractions: Fraction[] = [
  { whole: 0, num: 6, den: 7 }, { whole: 0, num: 1, den: 8 }, { whole: 0, num: 1, den: 6 }, { whole: 0, num: 4, den: 5 },
  { whole: 0, num: 3, den: 5 }, { whole: 0, num: 3, den: 2 }, { whole: 0, num: 5, den: 8 }, { whole: 0, num: 5, den: 4 },
  { whole: 5, num: 1, den: 5 }, { whole: 0, num: 2, den: 5 }, { whole: 0, num: 1, den: 5 }, { whole: 0, num: 1, den: 3 },
  { whole: 4, num: 3, den: 4 }, { whole: 4, num: 1, den: 4 }, { whole: 0, num: 3, den: 8 }, { whole: 0, num: 1, den: 4 },
  { whole: 0, num: 5, den: 7 },
];

export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
export const round2 = (v: number) => Math.round(v * 100) / 100;
export const pctText = (v: number) => `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(v)}%`;

/** Standard US letter-grade scale used by most schools. */
export function letterGrade(pct: number): string {
  if (pct >= 97) return "A+"; if (pct >= 93) return "A"; if (pct >= 90) return "A−";
  if (pct >= 87) return "B+"; if (pct >= 83) return "B"; if (pct >= 80) return "B−";
  if (pct >= 77) return "C+"; if (pct >= 73) return "C"; if (pct >= 70) return "C−";
  if (pct >= 67) return "D+"; if (pct >= 63) return "D"; if (pct >= 60) return "D−";
  return "F";
}

export const scoreSlug = (s: Score) => `${s.part}-out-of-${s.whole}`;
export const fractionLabel = (f: Fraction) => (f.whole ? `${f.whole} ${f.num}/${f.den}` : `${f.num}/${f.den}`);
export const fractionSlug = (f: Fraction) => (f.whole ? `${f.whole}-and-${f.num}-${f.den}` : `${f.num}-${f.den}`) + "-as-a-percent";
export const fractionValue = (f: Fraction) => f.whole + f.num / f.den;

/** True when the decimal form of num/den never ends (denominator has a prime factor other than 2 or 5). */
export function isRepeating(num: number, den: number): boolean {
  let d = den / gcd(num, den);
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  return d !== 1;
}

/** Hand-written, fraction-specific context so every answer page says something its neighbours do not. */
export const fractionNotes: Record<string, string[]> = {
  "6/7": [
    "Six days out of a seven-day week is 6/7, so if you work out six days a week you hit your goal 85.71% of the time.",
    "In baseball, a pitcher who throws 6 strikes in 7 pitches has a strike rate of about 85.7%, which would be exceptional over a full game.",
  ],
  "1/8": [
    "One slice of a pizza cut into eight pieces is 1/8, or 12.5% of the pie.",
    "In music, an eighth note lasts 1/8 of a whole note. In cooking, 1/8 teaspoon is the smallest spoon in most sets, and in US stocks prices were once quoted in eighths of a dollar, 12.5 cents each.",
  ],
  "1/6": [
    "Rolling a specific number on a fair six-sided die has a 1/6 chance, about 16.67%.",
    "Ten minutes is 1/6 of an hour, so a 10-minute break takes 16.67% of each hour.",
  ],
  "4/5": [
    "Four out of five dentists is the classic advertising line, and it means 80% of those asked.",
    "On a five-star rating, 4 stars is 4/5 of the maximum, or 80%. A 4.5 rating is 90%.",
  ],
  "3/5": [
    "Three correct answers on a five-question quiz is 3/5, which is 60%, a D− on the standard US scale.",
    "A 60% chance of rain in a forecast means similar conditions brought rain 3 times out of 5.",
  ],
  "3/2": [
    "3/2 is one and a half, so it equals 150%. Something that is 3/2 the size of another is 50% bigger.",
    "Time-and-a-half overtime pay is 3/2 of the normal hourly rate: $20 an hour becomes $30.",
  ],
  "5/8": [
    "5/8 inch is a common drill bit and bolt size, about 15.9 mm, and 62.5% of an inch.",
    "Five slices eaten from a pizza cut into eight leaves 3/8, or 37.5%, for everyone else.",
  ],
  "5/4": [
    "5/4 is one and a quarter, which is 125%. A price that goes to 5/4 of the original has risen 25%.",
    "In music, 5/4 time has five quarter-note beats per bar, as in the jazz standard Take Five.",
  ],
  "5 1/5": [
    "5 1/5 equals 5.2, which is 520%. A value that is 5 1/5 times another is 420% larger than it.",
    "If a recipe that serves 5 is scaled to feed 26 people, you need 26 ÷ 5 = 5 1/5 batches.",
  ],
  "2/5": [
    "Two out of five is 40%. A basketball player who makes 2 of every 5 three-point attempts shoots 40% from deep, which is very good in the NBA.",
    "On a five-star scale, 2 stars is 40% of the maximum rating.",
  ],
  "1/5": [
    "One fifth is 20%, the same as one item in a five-pack or one weekday in a five-day work week.",
    "Conventional mortgage lenders usually ask for a 20% down payment, 1/5 of the home price, before they waive private mortgage insurance.",
  ],
  "1/3": [
    "One third of a cup is a standard US measuring cup, about 79 mL, and it is 33.33% of a full cup.",
    "One third of a day is 8 hours, the amount of sleep often recommended for adults.",
  ],
  "4 3/4": [
    "4 3/4 equals 4.75, or 475%. A stock that grows to 4 3/4 times its price has gained 375%.",
    "A 4 3/4-hour shift is 4 hours and 45 minutes, and 4 3/4 inches is about 12.1 cm.",
  ],
  "4 1/4": [
    "4 1/4 equals 4.25, or 425%. Something 4 1/4 times as large as another is 325% bigger.",
    "Four and a quarter hours is 4 hours 15 minutes, and 4 1/4 cups of flour is 4 cups plus a quarter cup.",
  ],
  "3/8": [
    "3/8 inch is a common socket, bolt, and drill size, about 9.5 mm, and it is 37.5% of an inch.",
    "Three slices from a pizza cut into eight is 37.5% of the pie.",
  ],
  "1/4": [
    "One quarter is 25%. A US quarter coin is worth 1/4 of a dollar, and a quarter of an hour is 15 minutes.",
    "In football and basketball, each quarter is 1/4 of regulation time.",
  ],
  "5/7": [
    "Five weekdays out of a seven-day week is 5/7, or about 71.43%.",
    "If you take a daily vitamin on 5 of 7 days, you hit 71.43% of your doses for the week.",
  ],
};

/** Hand-written, score-specific context so sibling score pages are not near-duplicates. */
export const scoreNotes: Record<string, string[]> = {
  "16/20": [
    "80% sits right on the line between a B− and a C+ on most US scales, so 16 out of 20 is a B− with no room to spare. One more correct answer, 17/20, lifts it to 85%, a solid B.",
    "On a 20-question vocabulary or spelling quiz, 16 correct means you missed four words, which is a common target for a weekly practice test.",
  ],
  "15/20": [
    "75% is a C on the standard scale. Put simply, 15 out of 20 means you answered three quarters of the questions correctly.",
    "Every question on a 20-point test is worth 5%, so each extra correct answer moves you up a full five points.",
  ],
  "17/20": [
    "85% is a B, right in the middle of the B band. It is a strong result on most quizzes and only one answer away from 90%, an A−, at 18/20.",
    "If a recipe or form asks for 17 of 20 items to pass inspection, that is an 85% compliance rate.",
  ],
  "18/20": [
    "90% is the start of the A range on most US scales, so 18 out of 20 earns an A−. Missing only two questions is a strong result on almost any test.",
    "To reach an A (93%) on a 20-point test you would need 19/20, which is 95%.",
  ],
  "14/20": [
    "70% is a C−, which is the lowest passing grade in many US high schools and colleges. 14 out of 20 passes, but with very little margin.",
    "Getting 15/20 instead would move the result to 75%, a solid C.",
  ],
  "24/30": [
    "Each question on a 30-point test is worth about 3.33%, so 24 correct gives 80%, a B−.",
    "24 out of 30 is the same proportion as 4 out of 5 and 16 out of 20, which is why all three come out to exactly 80%.",
  ],
  "25/30": [
    "25 out of 30 simplifies to 5/6, which is 83.33% and a B on the standard scale.",
    "Compared with 24/30, one extra correct answer adds 3.33 points, moving the grade from B− to B.",
  ],
  "11/15": [
    "With 15 questions, each one is worth 6.67%, so a single answer can change your letter grade. 11 correct gives 73.33%, a C.",
    "Because 11 and 15 share no common factor, 11/15 cannot be simplified, and its decimal, 0.7333…, repeats forever.",
  ],
  "14/25": [
    "On a 25-point test each question is worth exactly 4%, so 14 out of 25 is 56%, which falls below the usual 60% passing line.",
    "You would need 15 out of 25 (60%) to reach a D−, and 18 out of 25 (72%) for a C−.",
  ],
  "20/25": [
    "20 out of 25 is 80%, a B−. Since each question is worth 4%, you can multiply the score by 4 to get the percentage in your head: 20 × 4 = 80.",
    "20/25 simplifies to 4/5, the same proportion as 16/20 and 24/30.",
  ],
};
