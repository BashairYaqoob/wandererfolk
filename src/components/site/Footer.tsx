import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer id="about" className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-terracotta" aria-hidden />
            <span className="font-display text-lg">Wanderfolk</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-foreground/70">
            A small studio for slow, thoughtful travel — one warm itinerary at a time.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            <li><a href="#destinations" className="hover:text-terracotta">Destinations</a></li>
            <li><a href="#journeys" className="hover:text-terracotta">How it works</a></li>
            <li><a href="#journal" className="hover:text-terracotta">Journal</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base">Studio</h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            <li><a href="#" className="hover:text-terracotta">Our story</a></li>
            <li><a href="#" className="hover:text-terracotta">Contact</a></li>
            <li><a href="#" className="hover:text-terracotta">Press</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base">Letters</h4>
          <p className="mt-3 text-sm text-foreground/70">
            A short, quiet email once a month.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex gap-2">
            <label className="sr-only" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@wander.co"
              className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
            <button className="rounded-full bg-ink px-4 py-2 text-sm text-primary-foreground">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/70 py-6 text-center text-xs text-foreground/60">
        © {new Date().getFullYear()} Wanderfolk Studio. Made with warm light.
      </div>
    </footer>
  );
}
