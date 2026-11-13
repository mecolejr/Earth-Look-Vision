/**
 * City data completeness checker.
 * Run with: npx tsx scripts/check-cities.ts
 * Verifies every city has all required sections and sane values,
 * so a new city can't silently break scoring. Exits 1 on any problem.
 */
import { CITIES } from "../client/data/cities";

type Problem = { city: string; issue: string };
const problems: Problem[] = [];
const warnings: Problem[] = [];
const note = (city: string, issue: string) => problems.push({ city, issue });
const warn = (city: string, issue: string) => warnings.push({ city, issue });

const inRange = (v: unknown, lo: number, hi: number) =>
  typeof v === "number" && !Number.isNaN(v) && v >= lo && v <= hi;

const ids = new Set<string>();

for (const c of CITIES) {
  const name = c.name || c.id || "(unnamed)";

  if (!c.id || !/^[a-z0-9-]+$/.test(c.id)) note(name, "id must be lowercase-with-dashes");
  if (ids.has(c.id)) note(name, `duplicate id "${c.id}"`);
  ids.add(c.id);

  if (!c.name) note(name, "missing name");
  if (!c.country) note(name, "missing country");
  if (!inRange(c.population, 1000, 50_000_000)) note(name, "population looks wrong");
  if (!inRange(c.costOfLivingIndex, 20, 300)) note(name, "costOfLivingIndex should be ~20-300 (100 = US average)");
  if (!c.coordinates || !inRange(c.coordinates.lat, -90, 90) || !inRange(c.coordinates.lon, -180, 180))
    note(name, "coordinates missing or out of range");

  const sections = ["demographics", "safety", "political", "climate", "jobMarket", "healthcare", "transit", "culture"] as const;
  for (const s of sections) {
    if (!c[s]) note(name, `missing section: ${s}`);
  }

  if (c.demographics) {
    const eb = c.demographics.ethnicBreakdown || {};
    const sum = Object.values(eb).reduce((a, b) => a + b, 0);
    if (sum < 90 || sum > 110) note(name, `ethnicBreakdown sums to ${sum}% (should be ~100%)`);
    if (!inRange(c.demographics.lgbtqPopulation, 0, 50)) note(name, "lgbtqPopulation % looks wrong");
    if (!inRange(c.demographics.medianAge, 15, 60)) note(name, "medianAge looks wrong");
  }

  if (c.safety) {
    if (!inRange(c.safety.overallCrimeRate, 0, 100)) note(name, "overallCrimeRate should be 0-100");
    if (!inRange(c.safety.lgbtqSafetyIndex, 0, 100)) note(name, "lgbtqSafetyIndex should be 0-100");
    if (c.safety.hateCrimesByBiasCategory) {
      for (const [k, v] of Object.entries(c.safety.hateCrimesByBiasCategory)) {
        if (!inRange(v, 0, 100)) note(name, `hateCrimesByBiasCategory.${k} per-100k value looks wrong (${v})`);
      }
      if (!c.safety.hateCrimeDataYear) note(name, "has bias-category data but no hateCrimeDataYear");
    } else {
      warn(name, "no hateCrimesByBiasCategory data — safety score will use aggregate data only");
    }
  }

  if (c.political && !inRange(c.political.progressiveScore, 0, 100)) note(name, "progressiveScore should be 0-100");

  if (c.climate) {
    if (!inRange(c.climate.averageTemp, -30, 110)) note(name, "averageTemp (F) looks wrong");
    if (!inRange(c.climate.sunnyDays, 0, 366)) note(name, "sunnyDays looks wrong");
  }

  if (c.jobMarket && !inRange(c.jobMarket.unemploymentRate, 0, 40)) note(name, "unemploymentRate looks wrong");
  if (c.healthcare && !inRange(c.healthcare.qualityIndex, 0, 100)) note(name, "healthcare qualityIndex should be 0-100");
  if (c.transit && !inRange(c.transit.publicTransitScore, 0, 100)) note(name, "publicTransitScore should be 0-100");
}

if (warnings.length) {
  console.warn(`\n⚠ ${warnings.length} warning(s) (allowed, shown for awareness):`);
  for (const w of warnings) console.warn(`  - [${w.city}] ${w.issue}`);
}

if (problems.length) {
  console.error(`\n✗ Found ${problems.length} problem(s) in city data:\n`);
  for (const p of problems) console.error(`  - [${p.city}] ${p.issue}`);
  process.exit(1);
} else {
  console.log(`✓ All ${CITIES.length} cities passed the completeness check.`);
}
