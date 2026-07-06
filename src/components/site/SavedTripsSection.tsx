import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Copy, Pencil, Trash2, ExternalLink, Calendar, Wallet, Clock, Cloud } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { tripStore, type SavedTrip } from "@/lib/trip-storage";
import { estimateBudget, formatUsd } from "@/lib/budget";
import { describeWeather, fetchWeather, type WeatherSnapshot } from "@/lib/weather";
import { usePlanner } from "@/lib/planner-context";
import { findDestinationImage, IMAGE_PLACEHOLDER } from "@/lib/image-search";

export function SavedTripsSection() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const { openPlanner } = usePlanner();

  useEffect(() => {
    const refresh = () => setTrips(tripStore.list());
    refresh();
    const handler = () => refresh();
    window.addEventListener("wanderfolk:trips-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("wanderfolk:trips-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const remove = (id: string) => {
    tripStore.remove(id);
    toast.success("Trip deleted");
  };

  const duplicate = (id: string) => {
    const copy = tripStore.duplicate(id);
    if (copy) toast.success(`Duplicated "${copy.input.destination}"`);
  };

  const openIn = (t: SavedTrip) => {
    openPlanner({
      destination: t.input.destination,
      durationDays: t.input.durationDays,
      budgetUsd: t.input.budgetUsd,
      style: t.input.style,
      travelers: t.input.travelers,
    });
  };

  return (
    <section id="saved-trips" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-hand text-2xl text-terracotta">— your travel journal</p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">
              Saved trips
            </h2>
          </div>
          <Link
            to="/trips"
            className="text-sm text-foreground/70 hover:text-terracotta"
          >
            Open full library →
          </Link>
        </Reveal>

        {trips.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.slice(0, 6).map((t) => (
              <TripCard
                key={t.id}
                trip={t}
                onOpen={() => openIn(t)}
                onDuplicate={() => duplicate(t.id)}
                onRemove={() => remove(t.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function EmptyState() {
  const { openPlanner } = usePlanner();
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
      <p className="font-hand text-2xl text-terracotta">a blank page, for now</p>
      <p className="mt-2 font-display text-xl text-ink">
        No saved journeys yet.
      </p>
      <p className="mt-1 text-sm text-foreground/70">
        Let's plan your first adventure — it takes about a minute.
      </p>
      <button
        onClick={() => openPlanner()}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-terracotta-deep hover:scale-[1.02]"
      >
        Start planning
      </button>
    </div>
  );
}

function TripCard({
  trip,
  onOpen,
  onDuplicate,
  onRemove,
}: {
  trip: SavedTrip;
  onOpen: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  const b = estimateBudget(trip.input);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [image, setImage] = useState<string | undefined>(trip.image);

  useEffect(() => {
    if (!trip.place) return;
    const ctrl = new AbortController();
    fetchWeather(trip.place, ctrl.signal)
      .then(setWeather)
      .catch(() => {
        /* silent — weather is a nicety here */
      });
    return () => ctrl.abort();
  }, [trip.place]);

  // Backfill image for older saved trips that don't have one yet, then
  // persist the resolved URL so the card doesn't refetch on every render.
  useEffect(() => {
    if (trip.image) {
      setImage(trip.image);
      return;
    }
    let cancelled = false;
    const query = [trip.place?.name || trip.input.destination, trip.place?.country]
      .filter(Boolean)
      .join(" ");
    findDestinationImage(query)
      .then((url) => {
        if (cancelled) return;
        const finalUrl = url || IMAGE_PLACEHOLDER;
        setImage(finalUrl);
        tripStore.save({ id: trip.id, input: trip.input, image: finalUrl });
      })
      .catch(() => {
        if (!cancelled) setImage(IMAGE_PLACEHOLDER);
      });
    return () => {
      cancelled = true;
    };
  }, [trip.id, trip.image, trip.input, trip.place?.name, trip.place?.country]);

  const title = trip.title || trip.input.destination;

  return (
    <li className="warm-shadow group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-transform hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt=""
            aria-hidden
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.dataset.fallback) {
                img.dataset.fallback = "1";
                img.src = IMAGE_PLACEHOLDER;
              }
            }}
          />
        ) : (
          <div className="h-full w-full animate-pulse bg-muted" aria-hidden />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs text-ink backdrop-blur">
          {trip.input.style}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="truncate font-display text-xl text-ink">{title}</h3>
        <p className="text-xs text-foreground/60">
          Saved {new Date(trip.createdAt).toLocaleDateString()}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <FactRow icon={<Clock className="h-3.5 w-3.5" />} label="Duration">
            {trip.input.durationDays} days
          </FactRow>
          <FactRow icon={<Wallet className="h-3.5 w-3.5" />} label="Budget">
            {formatUsd(b.total)}
          </FactRow>
          <FactRow icon={<Calendar className="h-3.5 w-3.5" />} label="Travelers">
            {trip.input.travelers}
          </FactRow>
          <FactRow icon={<Cloud className="h-3.5 w-3.5" />} label="Weather">
            {weather?.current
              ? `${Math.round(weather.current.temperature)}° · ${describeWeather(weather.current.code)}`
              : trip.place
                ? "—"
                : "Not saved"}
          </FactRow>
        </dl>

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-terracotta-deep"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Open
          </button>
          <Link
            to="/trips"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs text-ink hover:bg-accent"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
          </Link>
          <button
            onClick={onDuplicate}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs text-ink hover:bg-accent"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden /> Duplicate
          </button>
          <button
            onClick={onRemove}
            aria-label={`Delete ${title}`}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border p-2 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </li>
  );
}

function FactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-foreground/60">
        <span className="text-terracotta">{icon}</span>
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-ink">{children}</dd>
    </div>
  );
}
