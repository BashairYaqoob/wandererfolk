import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { destinations, type Destination } from "@/lib/destinations";
import { DestinationDialog } from "./DestinationDialog";

export function Destinations() {
  const [active, setActive] = useState<Destination | null>(null);
  const [open, setOpen] = useState(false);

  const openFor = (d: Destination) => {
    setActive(d);
    setOpen(true);
  };

  return (
    <section id="destinations" className="relative scroll-mt-24 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-14 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="font-hand text-2xl text-terracotta">this season's obsessions</p>
            <h2 className="mt-2 text-4xl leading-tight sm:text-5xl">
              Places we can't stop thinking about.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-foreground/70">
            A hand-picked shortlist of quiet, cinematic corners of the world —
            paired with itineraries built by people who actually went.
          </p>
        </Reveal>

        {destinations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((it, i) => (
              <Reveal key={it.slug} delay={i * 0.08}>
                <motion.button
                  type="button"
                  onClick={() => openFor(it)}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  aria-label={`Explore ${it.name}, ${it.country}`}
                  className="group relative block w-full overflow-hidden rounded-3xl bg-card warm-shadow text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={it.image}
                      alt={`${it.name}, ${it.country}`}
                      loading="lazy"
                      width={900}
                      height={1200}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-xs text-ink backdrop-blur">
                      {it.days}
                    </span>
                    <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-ink opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      Explore <ArrowRight className="h-3 w-3" aria-hidden />
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 p-5">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-2xl">{it.name}</h3>
                      <p className="text-xs uppercase tracking-widest text-foreground/60">
                        {it.country}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-terracotta">{it.tag}</span>
                  </div>
                </motion.button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <DestinationDialog destination={active} open={open} onOpenChange={setOpen} />
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
      <p className="font-display text-xl text-ink">No destinations found.</p>
      <p className="mt-2 text-sm text-foreground/70">
        Check back soon — we're always uncovering new corners of the world.
      </p>
    </div>
  );
}
