import type { Itinerary } from "@/lib/trip-planner.functions";
import { Sparkles } from "lucide-react";

export function ItineraryView({ itinerary }: { itinerary: Itinerary }) {
  return (
    <section
      aria-label="Generated itinerary"
      className="warm-shadow rounded-2xl border border-border bg-card p-5"
    >
      <header className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-terracotta" aria-hidden />
        <h3 className="font-display text-lg text-ink">Your itinerary</h3>
      </header>
      <p className="text-sm text-foreground/80">{itinerary.summary}</p>
      <ol className="mt-5 space-y-4">
        {itinerary.days.map((d) => (
          <li key={d.day} className="rounded-xl border border-border/70 bg-background/60 p-4">
            <h4 className="font-display text-base text-ink">
              Day {d.day} — {d.title}
            </h4>
            <dl className="mt-2 space-y-1 text-sm">
              <div>
                <dt className="inline font-medium text-ink">Morning: </dt>
                <dd className="inline text-foreground/80">{d.morning}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-ink">Afternoon: </dt>
                <dd className="inline text-foreground/80">{d.afternoon}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-ink">Evening: </dt>
                <dd className="inline text-foreground/80">{d.evening}</dd>
              </div>
              {d.tip && (
                <p className="mt-2 rounded-md bg-sand/50 px-2 py-1 text-xs text-ink">
                  Local tip: {d.tip}
                </p>
              )}
            </dl>
          </li>
        ))}
      </ol>
      {itinerary.packingList.length > 0 && (
        <div className="mt-5">
          <h4 className="font-display text-base text-ink">Packing list</h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {itinerary.packingList.map((item) => (
              <li
                key={item}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-ink"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
