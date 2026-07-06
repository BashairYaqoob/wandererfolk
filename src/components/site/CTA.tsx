import { Reveal } from "./Reveal";
import { ArrowRight } from "lucide-react";
import { usePlanner } from "@/lib/planner-context";

export function CTA() {
  const { openPlanner } = usePlanner();
  return (
    <section id="plan" className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-16 text-primary-foreground sm:px-16 sm:py-24 grain">
            <div
              aria-hidden
              className="absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.75 0.14 55 / 0.55), transparent 60%)",
              }}
            />
            <p className="font-hand text-2xl text-[oklch(0.85_0.09_70)]">ready when you are</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
              Let's sketch the trip you've been putting off.
            </h2>
            <p className="mt-5 max-w-lg text-primary-foreground/70">
              Tell us where your mind keeps wandering. Our planner will draft a
              day-by-day itinerary in seconds — refine it your way.
            </p>
            <button
              type="button"
              onClick={() => openPlanner()}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Start planning
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
