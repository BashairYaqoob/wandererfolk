import { motion } from "motion/react";
import { Compass, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { usePlanner } from "@/lib/planner-context";

type NavLink = { label: string; sectionId: string };

const links: NavLink[] = [
  { label: "Destinations", sectionId: "destinations" },
  { label: "Journeys", sectionId: "journeys" },
  { label: "Journal", sectionId: "journal" },
  { label: "Saved trips", sectionId: "saved-trips" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const { openPlanner } = usePlanner();

  useEffect(() => {
    if (!onHome) return;
    const ids = links.map((l) => l.sectionId);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onHome]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    if (onHome) {
      e.preventDefault();
      scrollToSection(sectionId);
      setOpen(false);
    }
  };

  const handlePlanClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (onHome) {
      openPlanner();
    } else {
      window.location.href = "/#planner";
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full border border-border/60 bg-background/70 px-5 py-3 backdrop-blur-md sm:px-8">
        <Link
          to="/"
          onClick={(e) => {
            if (onHome) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-2 text-ink"
          aria-label="Wanderfolk home"
        >
          <Compass className="h-5 w-5 text-terracotta" aria-hidden />
          <span className="font-display text-lg tracking-tight">Wanderfolk</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => {
            const isActive = onHome && active === l.sectionId;
            return (
              <a
                key={l.sectionId}
                href={onHome ? `#${l.sectionId}` : `/#${l.sectionId}`}
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => handleNavClick(e, l.sectionId)}
                className={`relative text-sm transition-colors hover:text-terracotta ${
                  isActive ? "text-terracotta" : "text-foreground/70"
                }`}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-terracotta"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={onHome ? "#planner" : "/#planner"}
            onClick={handlePlanClick}
            className="hidden rounded-full bg-ink px-5 py-2 text-sm text-primary-foreground transition-transform hover:scale-[1.03] md:inline-flex"
          >
            Plan a trip
          </a>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border border-border p-2 md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-auto mt-2 max-w-7xl rounded-2xl border border-border bg-background/95 p-4 backdrop-blur-md md:hidden"
        >
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {links.map((l) => {
              const isActive = onHome && active === l.sectionId;
              return (
                <a
                  key={l.sectionId}
                  href={onHome ? `#${l.sectionId}` : `/#${l.sectionId}`}
                  onClick={(e) => handleNavClick(e, l.sectionId)}
                  className={`text-sm ${isActive ? "text-terracotta font-medium" : ""}`}
                >
                  {l.label}
                </a>
              );
            })}
            <a
              href={onHome ? "#planner" : "/#planner"}
              onClick={handlePlanClick}
              className="mt-2 rounded-full bg-ink px-4 py-2 text-center text-sm text-primary-foreground"
            >
              Plan a trip
            </a>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
