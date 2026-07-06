import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Save, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Reveal } from "./Reveal";
import { DestinationSearch } from "@/components/planner/DestinationSearch";
import { WeatherCard } from "@/components/planner/WeatherCard";
import { BudgetCard } from "@/components/planner/BudgetCard";
import { ItineraryView } from "@/components/planner/ItineraryView";
import { generateItinerary, type Itinerary } from "@/lib/trip-planner.functions";
import type { GeoResult } from "@/lib/weather";
import { tripStore } from "@/lib/trip-storage";
import { getDestination } from "@/lib/destinations";
import { usePlanner } from "@/lib/planner-context";

const FormSchema = z.object({
  destination: z.string().trim().min(2, "Enter at least 2 characters").max(80),
  durationDays: z.coerce.number().int().min(1, "At least 1 day").max(30, "Max 30 days"),
  budgetUsd: z.coerce.number().int().min(50, "Minimum $50").max(100_000, "Too high"),
  travelers: z.coerce.number().int().min(1).max(20),
  style: z.enum(["relaxed", "adventure", "cultural", "foodie", "luxury", "budget"]),
});
type FormValues = z.infer<typeof FormSchema>;

function friendlyError(msg: string | undefined): string {
  if (!msg) return "Something went sideways. Please try again in a moment.";
  if (/rate/i.test(msg)) return "We're a bit busy — please try again in a moment.";
  if (/credit/i.test(msg)) return "AI credits ran out. Please try again later.";
  if (/malformed|parse/i.test(msg)) return "The itinerary came back garbled. Please retry.";
  return "Unable to generate itinerary. Please try again in a few moments.";
}

export function PlannerSection() {
  const { prefill, version } = usePlanner();
  const [place, setPlace] = useState<GeoResult | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      destination: "",
      durationDays: 5,
      budgetUsd: 1500,
      travelers: 2,
      style: "cultural",
    },
  });

  // Apply prefill when the planner is opened with a destination
  useEffect(() => {
    if (!prefill) return;
    reset({
      destination: prefill.destination ?? "",
      durationDays: prefill.durationDays ?? 5,
      budgetUsd: prefill.budgetUsd ?? 1500,
      travelers: prefill.travelers ?? 2,
      style: prefill.style ?? "cultural",
    });
    setItinerary(null);
    setPlace(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const values = watch();

  const liveInput = useMemo(
    () => ({
      destination: values.destination || "—",
      durationDays: Number(values.durationDays) || 1,
      budgetUsd: Number(values.budgetUsd) || 0,
      travelers: Number(values.travelers) || 1,
      style: values.style,
    }),
    [values],
  );

  const mutation = useMutation({
    mutationFn: (input: FormValues) => generateItinerary({ data: input }),
    onSuccess: (data) => {
      setItinerary(data);
      toast.success("Itinerary ready");
    },
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  const findSlug = (destination: string): string | undefined => {
    const first = destination.split(",")[0].trim().toLowerCase();
    return getDestination(first)?.slug;
  };

  const onSave = () => {
    const slug = findSlug(liveInput.destination);
    const dest = slug ? getDestination(slug) : undefined;
    const saved = tripStore.save({
      title: liveInput.destination,
      input: liveInput,
      itinerary: itinerary ?? undefined,
      image: dest?.image,
      destinationSlug: slug,
      place: place
        ? {
            name: place.name,
            country: place.country,
            latitude: place.latitude,
            longitude: place.longitude,
          }
        : undefined,
    });
    toast.success(`Saved "${saved.input.destination}"`);
  };

  return (
    <section
      id="planner"
      className="relative scroll-mt-24 bg-secondary/50 py-24 sm:py-32 grain"
      aria-label="AI Trip Planner"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-10 max-w-2xl">
          <p className="font-hand text-2xl text-terracotta">— plan your next journey</p>
          <h2 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">
            AI Trip Planner
          </h2>
          <p className="mt-3 text-foreground/70">
            Tell us where and how you like to travel. We'll sketch a day-by-day plan,
            check the weather and estimate your budget.
          </p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="warm-shadow flex flex-col gap-4 rounded-2xl border border-border bg-card p-5"
            aria-label="Trip planner form"
          >
            <DestinationSearch
              value={values.destination}
              onChange={(v) => setValue("destination", v, { shouldValidate: true })}
              onSelect={(p) => {
                setPlace(p);
                setValue(
                  "destination",
                  `${p.name}${p.country ? `, ${p.country}` : ""}`,
                  { shouldValidate: true },
                );
              }}
              error={errors.destination?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Field id="durationDays" label="Duration (days)" error={errors.durationDays?.message}>
                <input
                  id="durationDays"
                  type="number"
                  min={1}
                  max={30}
                  {...register("durationDays")}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </Field>
              <Field id="travelers" label="Travelers" error={errors.travelers?.message}>
                <input
                  id="travelers"
                  type="number"
                  min={1}
                  max={20}
                  {...register("travelers")}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </Field>
            </div>

            <Field id="budgetUsd" label="Total budget (USD)" error={errors.budgetUsd?.message}>
              <input
                id="budgetUsd"
                type="number"
                min={50}
                step={50}
                {...register("budgetUsd")}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>

            <Field id="style" label="Travel style" error={errors.style?.message}>
              <select
                id="style"
                {...register("style")}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="relaxed">Relaxed</option>
                <option value="cultural">Cultural</option>
                <option value="adventure">Adventure</option>
                <option value="foodie">Foodie</option>
                <option value="luxury">Luxury</option>
                <option value="budget">Budget</option>
              </select>
            </Field>

            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={!isValid || mutation.isPending}
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-terracotta-deep hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Sparkles className="h-4 w-4" aria-hidden />
                )}
                {mutation.isPending ? "Planning…" : "Generate itinerary"}
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={!isValid}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm text-ink transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" aria-hidden /> Save trip
              </button>
              <a
                href="#saved-trips"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("saved-trips")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="ml-auto self-center text-sm text-foreground/70 hover:text-terracotta"
              >
                View saved trips →
              </a>
            </div>
          </form>

          <div className="flex flex-col gap-6">
            <BudgetCard input={liveInput} />
            <WeatherCard place={place} />
            {mutation.isPending && <PlannerSkeleton />}
            {mutation.isError && !mutation.isPending && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{friendlyError((mutation.error as Error).message)}</span>
              </div>
            )}
            {itinerary && <ItineraryView itinerary={itinerary} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function PlannerSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="warm-shadow space-y-3 rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center gap-2 text-sm text-foreground/70">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Crafting your itinerary…
      </div>
      <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted" />
      <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
      <div className="h-3 w-5/6 animate-pulse rounded-full bg-muted" />
      <div className="mt-4 grid gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
