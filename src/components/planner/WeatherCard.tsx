import { useEffect, useState } from "react";
import { Cloud, Loader2 } from "lucide-react";
import { describeWeather, fetchWeather, type GeoResult, type WeatherSnapshot } from "@/lib/weather";

export function WeatherCard({ place }: { place: GeoResult | null }) {
  const [data, setData] = useState<WeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!place) {
      setData(null);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    fetchWeather(place, ctrl.signal)
      .then(setData)
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setError("Couldn't load weather.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [place]);

  if (!place) return null;

  return (
    <section
      aria-label="Weather forecast"
      className="warm-shadow rounded-2xl border border-border bg-card p-5"
    >
      <header className="mb-3 flex items-center gap-2">
        <Cloud className="h-4 w-4 text-terracotta" aria-hidden />
        <h3 className="font-display text-lg text-ink">Weather in {place.name}</h3>
      </header>
      {loading && (
        <p className="flex items-center gap-2 text-sm text-foreground/70">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading forecast…
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {data && (
        <>
          {data.current && (
            <p className="text-sm text-foreground/80">
              Now: <strong className="text-ink">{Math.round(data.current.temperature)}°C</strong>{" "}
              · {describeWeather(data.current.code)} · wind {Math.round(data.current.windSpeed)} km/h
            </p>
          )}
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {data.daily.map((d) => (
              <li
                key={d.date}
                className="rounded-xl border border-border/70 bg-background/60 p-3 text-center"
              >
                <div className="text-xs text-foreground/60">
                  {new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })}
                </div>
                <div className="mt-1 text-sm font-medium text-ink">
                  {Math.round(d.tMax)}° / {Math.round(d.tMin)}°
                </div>
                <div className="text-xs text-foreground/60">{describeWeather(d.code)}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
