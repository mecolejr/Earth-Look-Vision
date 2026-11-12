/**
 * One-time migration: splits the big CITIES array into one file per city
 * under client/data/cities/, plus an index.ts that reassembles the array
 * and keeps the helper functions. Safe to re-run (idempotent).
 * Run with: npx tsx scripts/split-cities.ts
 */
import * as fs from "fs";
import * as path from "path";
import { CITIES } from "../client/data/cities";

const dir = path.join(process.cwd(), "client/data/cities");
fs.mkdirSync(dir, { recursive: true });

const toVar = (id: string) => id.replace(/-([a-z0-9])/g, (_m, c) => c.toUpperCase());

const names: string[] = [];
for (const c of CITIES) {
  const v = toVar(c.id);
  names.push(v);
  const body = JSON.stringify(c, null, 2);
  fs.writeFileSync(
    path.join(dir, `${c.id}.ts`),
    `import { City } from "@/types";\n\nexport const ${v}: City = ${body};\n`
  );
}

const index =
  `import { City } from "@/types";\n\n` +
  CITIES.map((c) => `import { ${toVar(c.id)} } from "./${c.id}";`).join("\n") +
  `\n\n// To add a city: create <city-id>.ts in this folder (copy an existing one),\n` +
  `// import it above, add it to this list, then run: npx tsx scripts/check-cities.ts\n` +
  `export const CITIES: City[] = [\n  ${names.join(",\n  ")},\n];\n\n` +
  `export function getAllCities(): City[] {\n  return CITIES;\n}\n\n` +
  `export function getSponsoredCities(): City[] {\n  return CITIES.filter((city) => city.sponsored?.isSponsored);\n}\n\n` +
  `export function getCityById(id: string): City | undefined {\n  return CITIES.find((city) => city.id === id);\n}\n\n` +
  `export function searchCities(query: string): City[] {\n  const lowerQuery = query.toLowerCase();\n  return CITIES.filter(\n    (city) =>\n      city.name.toLowerCase().includes(lowerQuery) ||\n      city.country.toLowerCase().includes(lowerQuery) ||\n      (city.state && city.state.toLowerCase().includes(lowerQuery))\n  );\n}\n`;

fs.writeFileSync(path.join(dir, "index.ts"), index);
console.log("Wrote", CITIES.length, "city files + index.ts");
