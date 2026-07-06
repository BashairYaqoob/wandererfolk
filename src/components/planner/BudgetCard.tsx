import { estimateBudget, formatUsd } from "@/lib/budget";
import type { TripPlannerInput } from "@/lib/trip-planner.functions";
import { Wallet } from "lucide-react";

export function BudgetCard({ input }: { input: TripPlannerInput }) {
  const b = estimateBudget(input);
  const rows = [
    { label: "Lodging", value: b.lodging },
    { label: "Food", value: b.food },
    { label: "Activities", value: b.activities },
    { label: "Local transit", value: b.transit },
  ];
  const under = b.vsBudget >= 0;
  return (
    <section
      aria-label="Budget estimate"
      className="warm-shadow rounded-2xl border border-border bg-card p-5"
    >
      <header className="mb-3 flex items-center gap-2">
        <Wallet className="h-4 w-4 text-terracotta" aria-hidden />
        <h3 className="font-display text-lg text-ink">Estimated cost</h3>
      </header>
      <dl className="grid grid-cols-2 gap-y-1 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="contents">
            <dt className="text-foreground/70">{r.label}</dt>
            <dd className="text-right text-ink">{formatUsd(r.value)}</dd>
          </div>
        ))}
        <dt className="mt-2 border-t border-border pt-2 font-medium text-ink">Total</dt>
        <dd className="mt-2 border-t border-border pt-2 text-right font-semibold text-ink">
          {formatUsd(b.total)}
        </dd>
      </dl>
      <p className="mt-3 text-xs text-foreground/60">
        {formatUsd(b.perPersonPerDay)} per person / day ·{" "}
        <span className={under ? "text-terracotta" : "text-destructive"}>
          {under ? `${formatUsd(b.vsBudget)} under budget` : `${formatUsd(-b.vsBudget)} over budget`}
        </span>
      </p>
    </section>
  );
}
