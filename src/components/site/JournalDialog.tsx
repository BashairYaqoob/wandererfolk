import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Clock, User, Calendar } from "lucide-react";
import type { JournalArticle } from "@/lib/journal";
import { getDestination } from "@/lib/destinations";
import { usePlanner } from "@/lib/planner-context";

type Props = {
  article: JournalArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function JournalDialog({ article, open, onOpenChange }: Props) {
  const { openPlanner } = usePlanner();

  if (!article) return null;

  const dest = getDestination(article.destinationSlug);

  const handlePlan = () => {
    onOpenChange(false);
    openPlanner({
      destination: dest
        ? `${dest.name}, ${dest.country}`
        : `${article.destinationName}, ${article.country}`,
      durationDays: dest?.recommendedDurationDays,
      budgetUsd: dest?.estimatedBudgetUsd,
      style: dest?.suggestedStyle,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(100vw-1.5rem,52rem)] max-w-none max-h-[92vh] overflow-y-auto rounded-3xl border-border bg-background p-0">
        <div className="relative h-64 w-full overflow-hidden sm:h-80">
          <img
            src={article.image}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground sm:p-8">
            <p className="font-hand text-xl text-[oklch(0.9_0.09_75)]">
              {article.country} · from the journal
            </p>
            <DialogHeader className="mt-1 space-y-1 text-left">
              <DialogTitle className="font-display text-3xl leading-tight text-primary-foreground sm:text-4xl">
                {article.title}
              </DialogTitle>
              <DialogDescription className="sr-only">{article.excerpt}</DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <article className="mx-auto max-w-2xl px-6 py-8 sm:px-8 sm:py-10">
          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs uppercase tracking-widest text-foreground/60">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-terracotta" /> {article.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-terracotta" /> {article.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-terracotta" /> {article.readingTime}
            </span>
          </div>

          <p className="font-display text-2xl italic leading-snug text-ink">
            {article.intro}
          </p>

          <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground/85">
            {article.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <section className="mt-10">
            <h3 className="font-display text-xl text-ink">Destination highlights</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-foreground/80">
              {article.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-terracotta">·</span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="font-display text-xl text-ink">Hidden gems</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-foreground/80">
              {article.hiddenGems.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-terracotta">·</span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="font-display text-xl text-ink">Practical tips</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-foreground/80">
              {article.tips.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-terracotta">·</span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 rounded-3xl border border-border bg-secondary/40 p-6 text-center sm:p-8">
            <p className="font-hand text-xl text-terracotta">
              Inspired by this destination?
            </p>
            <h4 className="mt-1 font-display text-2xl text-ink">
              Take {article.destinationName} with you.
            </h4>
            <button
              onClick={handlePlan}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:bg-terracotta-deep hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" aria-hidden /> Plan this trip
            </button>
          </div>
        </article>
      </DialogContent>
    </Dialog>
  );
}
