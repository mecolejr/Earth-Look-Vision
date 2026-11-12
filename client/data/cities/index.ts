import { City } from "@/types";

import { sanFrancisco } from "./san-francisco";
import { newYork } from "./new-york";
import { austin } from "./austin";
import { toronto } from "./toronto";
import { berlin } from "./berlin";
import { barcelona } from "./barcelona";
import { amsterdam } from "./amsterdam";
import { seattle } from "./seattle";

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
