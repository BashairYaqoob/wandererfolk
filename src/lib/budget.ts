import type { TripPlannerInput } from "./trip-planner.functions";

// Per-person, per-day defaults by style (USD). Rough baselines for estimation.
const STYLE_DAILY: Record<TripPlannerInput["style"], { lodging: number; food: number; activities: number; transit: number }> = {
  budget:   { lodging: 35, food: 20, activities: 10, transit: 8 },
  relaxed:  { lodging: 90, food: 45, activities: 25, transit: 15 },
  cultural: { lodging: 110, food: 50, activities: 40, transit: 18 },
  foodie:   { lodging: 120, food: 90, activities: 25, transit: 18 },
  adventure:{ lodging: 100, food: 45, activities: 60, transit: 25 },
  luxury:   { lodging: 350, food: 150, activities: 100, transit: 60 },
};

export type BudgetBreakdown = {
  lodging: number;
  food: number;
  activities: number;
  transit: number;
  total: number;
  perPersonPerDay: number;
  vsBudget: number; // positive = under budget
};

export function estimateBudget(input: TripPlannerInput): BudgetBreakdown {
  const d = STYLE_DAILY[input.style];
  const days = input.durationDays;
  const people = input.travelers;
  const lodging = Math.round(d.lodging * days * Math.max(1, Math.ceil(people / 2))); // share rooms
  const food = Math.round(d.food * days * people);
  const activities = Math.round(d.activities * days * people);
  const transit = Math.round(d.transit * days * people);
  const total = lodging + food + activities + transit;
  return {
    lodging,
    food,
    activities,
    transit,
    total,
    perPersonPerDay: Math.round(total / (days * people)),
    vsBudget: input.budgetUsd - total,
  };
}

export const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
