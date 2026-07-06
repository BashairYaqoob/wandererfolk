import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Wallet, MapPin, Utensils, Info, Cloud, Bus, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Destination } from "@/lib/destinations";
import { usePlanner } from "@/lib/planner-context";
import { searchGallery, IMAGE_PLACEHOLDER } from "@/lib/image-search";

type Props = {
  destination: Destination | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DestinationDialog({ destination, open, onOpenChange }: Props) {
  const { openPlanner } = usePlanner();

  const galleryQuery = useQuery({
    queryKey: ["destination-gallery", destination?.slug],
    queryFn: () =>
      searchGallery(
        `${destination!.name} ${destination!.country}`,
        destination!.galleryThemes,
      ),
    enabled: Boolean(open && destination),
    staleTime: 1000 * 60 * 60,
  });



  if (!destination) return null;

  const handlePlan = () => {
    onOpenChange(false);
    openPlanner({
      destination: `${destination.name}, ${destination.country}`,
      durationDays: destination.recommendedDurationDays,
      budgetUsd: destination.estimatedBudgetUsd,
      style: destination.suggestedStyle,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(100vw-1.5rem,64rem)] max-w-none max-h-[92vh] overflow-y-auto rounded-3xl border-border bg-background p-0">
        <div className="relative h-64 w-full overflow-hidden sm:h-80">
          <img
            src={destination.image}
            alt={`${destination.name}, ${destination.country}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground sm:p-8">
            <p className="font-hand text-xl text-[oklch(0.9_0.09_75)]">{destination.tag}</p>
            <DialogHeader className="mt-1 space-y-1 text-left">
              <DialogTitle className="font-display text-3xl leading-tight text-primary-foreground sm:text-4xl">
                {destination.name}
              </DialogTitle>
              <DialogDescription className="text-sm uppercase tracking-widest text-primary-foreground/80">
                {destination.country}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-base leading-relaxed text-foreground/80">
              {destination.overview}
            </p>

            <Section title="Top attractions" icon={<MapPin className="h-4 w-4" />}>
              <ul className="grid grid-cols-1 gap-1.5 text-sm text-foreground/80 sm:grid-cols-2">
                {destination.attractions.map((a) => (
                  <li key={a} className="flex gap-2">
                    <span className="text-terracotta">·</span>
                    {a}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Things to do" icon={<Sparkles className="h-4 w-4" />}>
              <ul className="space-y-1.5 text-sm text-foreground/80">
                {destination.thingsToDo.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-terracotta">·</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Local cuisine" icon={<Utensils className="h-4 w-4" />}>
              <ul className="flex flex-wrap gap-2">
                {destination.cuisine.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs text-ink"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Travel tips" icon={<Info className="h-4 w-4" />}>
              <ul className="space-y-1.5 text-sm text-foreground/80">
                {destination.tips.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-terracotta">·</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Getting around" icon={<Bus className="h-4 w-4" />}>
              <p className="text-sm text-foreground/80">{destination.transport}</p>
            </Section>

            <Section title="Photo gallery">
              <div className="grid grid-cols-3 gap-2">
                {destination.galleryThemes.map((theme, i) => {
                  const src = galleryQuery.data?.[i];
                  const isLoading = galleryQuery.isLoading || !src;
                  return (
                    <div
                      key={`${theme}-${i}`}
                      className="relative overflow-hidden rounded-xl warm-shadow bg-muted"
                    >
                      {isLoading ? (
                        <div
                          className="aspect-square h-full w-full animate-pulse bg-muted"
                          aria-hidden
                        />
                      ) : (
                        <img
                          src={src}
                          alt={`${destination.name} — ${theme}`}
                          loading="lazy"
                          className="aspect-square h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                          onError={(e) => {
                            const img = e.currentTarget;
                            if (!img.dataset.fallback) {
                              img.dataset.fallback = "1";
                              img.src = destination.image || IMAGE_PLACEHOLDER;
                            }
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>

          <aside className="space-y-4">
            <Fact icon={<Calendar className="h-4 w-4" />} label="Best season">
              {destination.bestSeason}
            </Fact>
            <Fact icon={<Calendar className="h-4 w-4" />} label="Recommended duration">
              {destination.recommendedDurationDays} days
            </Fact>
            <Fact icon={<Wallet className="h-4 w-4" />} label="Estimated budget">
              ~${destination.estimatedBudgetUsd.toLocaleString()} USD
            </Fact>
            <Fact icon={<Cloud className="h-4 w-4" />} label="Weather">
              {destination.weatherSummary}
            </Fact>

            <button
              onClick={handlePlan}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:bg-terracotta-deep hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" aria-hidden /> Plan this trip
            </button>
            <p className="text-center text-xs text-foreground/60">
              Opens the AI planner with {destination.name} pre-filled.
            </p>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h3 className="mb-3 flex items-center gap-2 font-display text-lg text-ink">
        {icon && <span className="text-terracotta">{icon}</span>}
        {title}
      </h3>
      {children}
    </section>
  );
}

function Fact({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/60">
        <span className="text-terracotta">{icon}</span>
        {label}
      </p>
      <p className="mt-1.5 text-sm text-ink">{children}</p>
    </div>
  );
}
