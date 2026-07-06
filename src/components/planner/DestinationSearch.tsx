import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { searchPlaces, type GeoResult } from "@/lib/weather";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (place: GeoResult) => void;
  error?: string;
  id?: string;
};

export function DestinationSearch({ value, onChange, onSelect, error, id = "destination" }: Props) {
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setFetchError(null);
    const t = setTimeout(async () => {
      try {
        const r = await searchPlaces(q, ctrl.signal);
        setResults(r);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setFetchError("Couldn't load suggestions.");
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value]);

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-foreground">
        Destination
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
        <MapPin className="h-4 w-4 shrink-0 text-terracotta" aria-hidden />
        <input
          id={id}
          type="text"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Marrakech, Kyoto, Lisbon…"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-foreground/50 focus:outline-none"
        />
        {loading && <Loader2 className="h-4 w-4 animate-spin text-foreground/50" aria-hidden />}
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
      {fetchError && !error && (
        <p className="mt-1 text-xs text-destructive">{fetchError}</p>
      )}
      {open && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-popover text-popover-foreground shadow-lg"
        >
          {results.map((r) => (
            <li key={`${r.name}-${r.latitude}-${r.longitude}`}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(`${r.name}${r.country ? `, ${r.country}` : ""}`);
                  onSelect(r);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-terracotta" aria-hidden />
                <span className="truncate">
                  {r.name}
                  {r.admin1 ? `, ${r.admin1}` : ""}
                  {r.country ? ` — ${r.country}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
