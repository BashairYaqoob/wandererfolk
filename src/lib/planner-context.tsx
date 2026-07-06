import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type PlannerPrefill = {
  destination?: string;
  durationDays?: number;
  budgetUsd?: number;
  style?: "relaxed" | "adventure" | "cultural" | "foodie" | "luxury" | "budget";
  travelers?: number;
};

type PlannerContextValue = {
  prefill: PlannerPrefill | null;
  version: number;
  openPlanner: (prefill?: PlannerPrefill) => void;
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<PlannerPrefill | null>(null);
  const [version, setVersion] = useState(0);

  const openPlanner = useCallback((next?: PlannerPrefill) => {
    if (next) setPrefill(next);
    setVersion((v) => v + 1);
    // Scroll to the planner section
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        const el = document.getElementById("planner");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  return (
    <PlannerContext.Provider value={{ prefill, version, openPlanner }}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used inside PlannerProvider");
  return ctx;
}
