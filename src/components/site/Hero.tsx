import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Search, MapPin, Calendar, ArrowRight, Sparkles } from "lucide-react";
import desertHero from "@/assets/desert-hero.jpg";
import { usePlanner } from "@/lib/planner-context";


const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { openPlanner } = usePlanner();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);

  // Sand particles
  const particles = Array.from({ length: 22 });

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate overflow-hidden min-h-[100dvh] grain"
      aria-label="Hero"
    >
      {/* Background */}
      <motion.div
        style={{ y: reduce ? 0 : bgY }}
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease }}
        className="absolute inset-0 -z-20"
      >
        <img
          src={desertHero}
          alt=""
          aria-hidden
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.55_0.13_45/0.35)] via-transparent to-transparent" />
      </motion.div>

      {/* Sun glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 2.4, ease }}
        className="absolute left-1/2 top-[38%] -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.9 0.14 80 / 0.55), transparent 60%)",
        }}
        aria-hidden
      />

      {/* Sand particles */}
      {!reduce && (
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          {particles.map((_, i) => {
            const left = (i * 53) % 100;
            const delay = (i % 7) * 0.6;
            const duration = 8 + (i % 5);
            const size = 2 + (i % 3);
            return (
              <motion.span
                key={i}
                className="absolute rounded-full bg-[oklch(0.9_0.09_75)]"
                style={{ left: `${left}%`, top: "85%", width: size, height: size, opacity: 0.5 }}
                animate={{
                  x: [0, 40, 80, 120],
                  y: [0, -60, -140, -240],
                  opacity: [0, 0.6, 0.4, 0],
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Content */}
      <div className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center px-6 pt-32 pb-40 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8, ease }}
          className="font-hand text-2xl text-terracotta"
        >
          — a travel journal for the curious
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.1, ease }}
          className="mt-4 font-display text-5xl leading-[1.02] tracking-tight text-ink sm:text-6xl md:text-7xl lg:text-[5.5rem]"
        >
          Chase the <em className="not-italic text-terracotta">golden hour</em>,
          <br className="hidden sm:block" /> wherever it leads.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.5, ease }}
          className="mt-6 max-w-xl text-base text-foreground/70 sm:text-lg"
        >
          Craft slow, thoughtful journeys through deserts, coastlines and quiet
          towns. We handle the map — you keep the memories.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.75, ease }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            type="button"
            onClick={() => openPlanner()}
            className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-4 text-base font-medium text-primary-foreground shadow-lg shadow-terracotta/20 transition-all hover:bg-terracotta-deep hover:scale-[1.03]"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Start planning
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button>
          <a
            href="#destinations"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("destinations")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-6 py-4 text-sm text-ink backdrop-blur transition-colors hover:bg-background"
          >
            Browse destinations
          </a>
        </motion.div>

        {/* Quick search — jumps into planner with the entered destination */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 3.05, ease }}
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const destination = (form.elements.namedItem("dest") as HTMLInputElement)
              ?.value.trim();
            openPlanner(destination ? { destination } : undefined);
          }}
          className="mt-8 w-full max-w-3xl warm-shadow rounded-2xl border border-border/70 bg-background/85 p-2 backdrop-blur-md sm:rounded-full"
          role="search"
          aria-label="Quick trip search"
        >
          <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1.2fr_1fr_auto]">
            <label className="flex min-w-0 items-center gap-3 rounded-xl px-4 py-3 sm:rounded-full">
              <MapPin className="h-4 w-4 shrink-0 text-terracotta" aria-hidden />
              <span className="sr-only">Where to</span>
              <input
                name="dest"
                type="text"
                placeholder="Where to?  Marrakech, Kyoto…"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-foreground/50 focus:outline-none"
              />
            </label>
            <label className="flex min-w-0 items-center gap-3 border-t border-border px-4 py-3 sm:border-l sm:border-t-0">
              <Calendar className="h-4 w-4 shrink-0 text-terracotta" aria-hidden />
              <span className="sr-only">When</span>
              <input
                type="text"
                placeholder="Anytime in spring"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-foreground/50 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-ink/90 sm:rounded-full"
            >
              <Search className="h-4 w-4" aria-hidden />
              Explore
            </button>
          </div>
        </motion.form>
      </div>


    </section>
  );
}
