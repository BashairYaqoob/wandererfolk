import { Reveal } from "./Reveal";
import { Map, Compass, Sparkles, NotebookPen } from "lucide-react";

const steps = [
  {
    icon: Compass,
    title: "Tell us your rhythm",
    body: "A short story: how you travel, what you love, how slow you want to go.",
  },
  {
    icon: Map,
    title: "We draft the route",
    body: "A day-by-day plan with stays, detours, meals and the golden-hour moments.",
  },
  {
    icon: Sparkles,
    title: "Refine together",
    body: "Swap, stretch or shorten anything. It's your journal — we just sketch first.",
  },
  {
    icon: NotebookPen,
    title: "Take it with you",
    body: "Offline itinerary, curated maps and quiet local notes in one warm little app.",
  },
];

export function Journeys() {
  return (
    <section id="journeys" className="relative scroll-mt-24 bg-secondary/50 py-28 sm:py-36 grain">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-hand text-2xl text-terracotta">how it works</p>
          <h2 className="mt-2 text-4xl leading-tight sm:text-5xl">
            Slow travel, thoughtfully planned.
          </h2>
          <p className="mt-4 text-foreground/70">
            No endless tabs, no cookie-cutter tours. Just a small, human process
            that turns a spark of an idea into a beautiful, printable itinerary.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-border/60 bg-background/70 p-6 backdrop-blur transition-transform hover:-translate-y-1">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta">
                  <s.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="font-display text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{s.body}</p>
                <p className="mt-6 font-hand text-lg text-terracotta">0{i + 1}.</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
