// Open-Meteo — no API key required.

export type GeoResult = {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

export type ForecastDay = {
  date: string;
  tMax: number;
  tMin: number;
  precipMm: number;
  code: number;
};

export type WeatherSnapshot = {
  place: GeoResult;
  current: { temperature: number; windSpeed: number; code: number } | null;
  daily: ForecastDay[];
};

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<GeoResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?count=6&language=en&format=json&name=${encodeURIComponent(
    q,
  )}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const data = (await res.json()) as { results?: GeoResult[] };
  return data.results ?? [];
}

export async function fetchWeather(place: GeoResult, signal?: AbortSignal): Promise<WeatherSnapshot> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&forecast_days=5`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Weather fetch failed (${res.status})`);
  const data = (await res.json()) as {
    current_weather?: { temperature: number; windspeed: number; weathercode: number };
    daily?: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_sum: number[];
      weathercode: number[];
    };
  };
  const daily: ForecastDay[] =
    data.daily?.time.map((date, i) => ({
      date,
      tMax: data.daily!.temperature_2m_max[i],
      tMin: data.daily!.temperature_2m_min[i],
      precipMm: data.daily!.precipitation_sum[i],
      code: data.daily!.weathercode[i],
    })) ?? [];
  return {
    place,
    current: data.current_weather
      ? {
          temperature: data.current_weather.temperature,
          windSpeed: data.current_weather.windspeed,
          code: data.current_weather.weathercode,
        }
      : null,
    daily,
  };
}

// WMO weather-code → short label
export function describeWeather(code: number): string {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "—";
}
