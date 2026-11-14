// Global fallback weather provider: MET Norway Locationforecast (free, no API
// key, requires an identifying User-Agent). Used when the US-only National
// Weather Service lookup fails (e.g. non-US cities). Returns the same period
// shape as the NWS path. Days are grouped by UTC date (approximation).

const USER_AGENT = "EarthLook/1.0 support@earthlook.app";

const SYMBOL_TEXT: Record<string, string> = {
  clearsky: "Clear", fair: "Mostly Clear", partlycloudy: "Partly Cloudy",
  cloudy: "Cloudy", fog: "Fog", lightrain: "Light Rain", rain: "Rain",
  heavyrain: "Heavy Rain", lightrainshowers: "Light Rain Showers",
  rainshowers: "Rain Showers", heavyrainshowers: "Heavy Rain Showers",
  lightsnow: "Light Snow", snow: "Snow", heavysnow: "Heavy Snow",
  lightsnowshowers: "Light Snow Showers", snowshowers: "Snow Showers",
  heavysnowshowers: "Heavy Snow Showers", sleet: "Sleet",
  lightsleet: "Light Sleet", heavysleet: "Heavy Sleet",
};

function describe(symbol: string | undefined): string {
  if (!symbol) return "Mixed Conditions";
  const base = symbol.replace(/_(day|night|polartwilight)$/, "");
  if (base.includes("thunder")) return "Thunderstorms";
  return SYMBOL_TEXT[base] ?? "Mixed Conditions";
}

const toF = (c: number) => Math.round((c * 9) / 5 + 32);
const toMph = (ms: number) => Math.round(ms * 2.23694);

export async function getMetNorwayForecast(lat: number, lon: number) {
  const url =
    `https://api.met.no/weatherapi/locationforecast/2.0/compact` +
    `?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
  const resp = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!resp.ok) throw new Error(`MET Norway failed: ${resp.status}`);
  const data = await resp.json();
  const series: any[] = data?.properties?.timeseries ?? [];
  if (!series.length) throw new Error("MET Norway returned no data");

  const days = new Map<string, { maxC: number; maxWind: number; precip: number; symbol?: string; symbolHour: number }>();
  for (const e of series) {
    const day = String(e.time).slice(0, 10);
    const hour = new Date(e.time).getUTCHours();
    const d = e.data?.instant?.details ?? {};
    const rec = days.get(day) ?? { maxC: -Infinity, maxWind: 0, precip: 0, symbol: undefined, symbolHour: -99 };
    if (typeof d.air_temperature === "number") rec.maxC = Math.max(rec.maxC, d.air_temperature);
    if (typeof d.wind_speed === "number") rec.maxWind = Math.max(rec.maxWind, d.wind_speed);
    const six = e.data?.next_6_hours;
    if (six && hour % 6 === 0) rec.precip += six.details?.precipitation_amount ?? 0;
    const sym = six?.summary?.symbol_code ?? e.data?.next_1_hours?.summary?.symbol_code;
    if (sym && Math.abs(hour - 12) < Math.abs(rec.symbolHour - 12)) {
      rec.symbol = sym;
      rec.symbolHour = hour;
    }
    days.set(day, rec);
  }

  const periods = [...days.entries()]
    .filter(([, r]) => Number.isFinite(r.maxC))
    .slice(0, 7)
    .map(([day, r], i) => {
      const text = describe(r.symbol);
      const temp = toF(r.maxC);
      const wind = toMph(r.maxWind);
      return {
        number: i + 1,
        name: i === 0 ? "Today" : new Date(day + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
        startTime: day,
        endTime: day,
        isDaytime: true,
        temperature: temp,
        temperatureUnit: "F",
        temperatureTrend: null,
        probabilityOfPrecipitation: { value: null },
        windSpeed: `${wind} mph`,
        windDirection: "",
        icon: "",
        shortForecast: text,
        detailedForecast: `${text}. High near ${temp}F, winds up to ${wind} mph.`,
      };
    });
  if (!periods.length) throw new Error("MET Norway produced no periods");
  return { updated: new Date().toISOString(), periods };
}
