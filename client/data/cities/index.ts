import { City } from "@/types";

import { sanFrancisco } from "./san-francisco";
import { newYork } from "./new-york";
import { austin } from "./austin";
import { toronto } from "./toronto";
import { berlin } from "./berlin";
import { barcelona } from "./barcelona";
import { amsterdam } from "./amsterdam";
import { seattle } from "./seattle";
import { chicago } from "./chicago";
import { atlanta } from "./atlanta";
import { denver } from "./denver";
import { houston } from "./houston";
import { washingtonDc } from "./washington-dc";
import { tulsa } from "./tulsa";
import { kansasCity } from "./kansas-city";
import { pittsburgh } from "./pittsburgh";
import { columbus } from "./columbus";
import { albuquerque } from "./albuquerque";
import { montreal } from "./montreal";
import { vancouver } from "./vancouver";
import { mexicoCity } from "./mexico-city";
import { lisbon } from "./lisbon";
import { london } from "./london";

// To add a city: create <city-id>.ts in this folder (copy an existing one),
// import it above, add it to this list, then run: npx tsx scripts/check-cities.ts
export const CITIES: City[] = [
  sanFrancisco,
  newYork,
  austin,
  toronto,
  berlin,
  barcelona,
  amsterdam,
  seattle,
  chicago,
  atlanta,
  denver,
  houston,
  washingtonDc,
  tulsa,
  kansasCity,
  pittsburgh,
  columbus,
  albuquerque,
  montreal,
  vancouver,
  mexicoCity,
  lisbon,
  london,
];

export function getAllCities(): City[] {
  return CITIES;
}

export function getSponsoredCities(): City[] {
  return CITIES.filter((city) => city.sponsored?.isSponsored);
}

export function getCityById(id: string): City | undefined {
  return CITIES.find((city) => city.id === id);
}

export function searchCities(query: string): City[] {
  const lowerQuery = query.toLowerCase();
  return CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery) ||
      (city.state && city.state.toLowerCase().includes(lowerQuery))
  );
}
