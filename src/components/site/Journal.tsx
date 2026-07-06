import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { articles, type JournalArticle } from "@/lib/journal";
import { JournalDialog } from "./JournalDialog";

export function Journal() {
  const [active, setActive] = useState<JournalArticle | null>(null);
  const [open, setOpen] = useState(false);

  const openFor = (a: JournalArticle) => {
    setActive(a);
    setOpen(true);
  };

  return (
    <section id="journal" className="scroll-mt-24 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-14 max-w-2xl">
          <p className="font-hand text-2xl text-terracotta">from the journal</p>
          <h2 className="mt-2 text-4xl leading-tight sm:text-5xl">
            Field notes from the road.
          </h2>
        </Reveal>

        {articles.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
            <p className="font-display text-xl text-ink">No articles available.</p>
            <p className="mt-2 text-sm text-foreground/70">
              New field notes are on the way — come back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {articles.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.1}>
                <article className="group">
                  <button
                    type="button"
                    onClick={() => openFor(a)}
                    className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-3xl"
                    aria-label={`Read: ${a.title}`}
                  >
                    <div className="overflow-hidden rounded-3xl warm-shadow">
                      <img
                        src={a.image}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        width={900}
                        height={1200}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-5 text-xs uppercase tracking-widest text-foreground/60">
                      {a.country} · {a.readingTime}
                    </p>
                    <h3 className="mt-2 font-display text-2xl leading-tight transition-colors group-hover:text-terracotta">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-sm text-foreground/70">{a.excerpt}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-terracotta">
                      Read the story <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <JournalDialog article={active} open={open} onOpenChange={setOpen} />
    </section>
  );
}
