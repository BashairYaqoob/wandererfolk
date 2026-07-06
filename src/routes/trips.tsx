import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Pencil, Check, X, Copy } from "lucide-react";
import { toast, Toaster } from "sonner";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { tripStore, type SavedTrip } from "@/lib/trip-storage";
import { estimateBudget, formatUsd } from "@/lib/budget";

export const Route = createFileRoute("/trips")({
  component: TripsPage,
  head: () => ({
    meta: [
      { title: "Saved trips — Wanderfolk" },
      { name: "description", content: "Your saved travel plans, kept locally on this device." },
    ],
  }),
});

function TripsPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  useEffect(() => {
    setTrips(tripStore.list());
  }, []);

  const refresh = () => setTrips(tripStore.list());

  const remove = (id: string) => {
    tripStore.remove(id);
    refresh();
    toast.success("Trip deleted");
  };

  const duplicate = (id: string) => {
    const copy = tripStore.duplicate(id);
    refresh();
    if (copy) toast.success(`Duplicated "${copy.input.destination}"`);
  };

  const startEdit = (t: SavedTrip) => {
    setEditingId(t.id);
    setNotesDraft(t.notes ?? "");
  };

  const saveEdit = (t: SavedTrip) => {
    tripStore.save({ id: t.id, input: t.input, itinerary: t.itinerary, notes: notesDraft });
    setEditingId(null);
    refresh();
    toast.success("Notes updated");
  };

  return (
    <main className="min-h-dvh bg-background">
      <Toaster richColors position="top-center" />
      <Nav />
      <section className="mx-auto max-w-5xl px-6 pt-32 pb-16">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-hand text-2xl text-terracotta">— your travel journal</p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">
              Saved trips
            </h1>
          </div>
          <Link
            to="/plan"
            className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-terracotta-deep"
          >
            Plan a new trip
          </Link>
        </header>

        {trips.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <span className="block font-hand text-2xl text-terracotta">a blank page, for now</span>
            <span className="mt-2 block font-display text-xl text-ink">No saved journeys yet.</span>
            <span className="mt-1 block text-sm text-foreground/70">
              Let's plan your first adventure — head to the planner to begin.
            </span>
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {trips.map((t) => {
              const b = estimateBudget(t.input);
              const editing = editingId === t.id;
              return (
                <li
                  key={t.id}
                  className="warm-shadow flex flex-col rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-lg text-ink">
                        {t.input.destination}
                      </h2>
                      <p className="text-xs text-foreground/60">
                        {new Date(t.updatedAt).toLocaleDateString()} · {t.input.durationDays} days ·{" "}
                        {t.input.travelers} traveler(s) · {t.input.style}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {!editing && (
                        <button
                          aria-label={`Edit notes for ${t.input.destination}`}
                          onClick={() => startEdit(t)}
                          className="rounded-full border border-border p-2 hover:bg-accent"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      )}
                      <button
                        aria-label={`Duplicate ${t.input.destination}`}
                        onClick={() => duplicate(t.id)}
                        className="rounded-full border border-border p-2 hover:bg-accent"
                      >
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      <button
                        aria-label={`Delete ${t.input.destination}`}
                        onClick={() => remove(t.id)}
                        className="rounded-full border border-border p-2 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-foreground/80">
                    Estimated cost:{" "}
                    <strong className="text-ink">{formatUsd(b.total)}</strong>{" "}
                    <span className="text-xs text-foreground/60">
                      ({formatUsd(b.perPersonPerDay)} pp/day)
                    </span>
                  </p>
                  {editing ? (
                    <div className="mt-3">
                      <label htmlFor={`notes-${t.id}`} className="sr-only">
                        Notes
                      </label>
                      <textarea
                        id={`notes-${t.id}`}
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                        maxLength={1000}
                        rows={3}
                        className="w-full rounded-xl border border-border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Notes, links, reminders…"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => saveEdit(t)}
                          className="inline-flex items-center gap-1 rounded-full bg-terracotta px-3 py-1.5 text-xs font-medium text-primary-foreground"
                        >
                          <Check className="h-3.5 w-3.5" aria-hidden /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    t.notes && (
                      <p className="mt-3 whitespace-pre-wrap rounded-xl bg-background/60 p-3 text-sm text-foreground/80">
                        {t.notes}
                      </p>
                    )
                  )}
                  {t.itinerary && (
                    <p className="mt-3 line-clamp-3 text-xs text-foreground/60">
                      {t.itinerary.summary}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <Footer />
    </main>
  );
}
