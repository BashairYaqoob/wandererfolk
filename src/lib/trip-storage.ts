import type { Itinerary, TripPlannerInput } from "./trip-planner.functions";

const KEY = "wanderfolk.savedTrips.v1";

export type SavedTripPlace = {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
};

export type SavedTrip = {
  id: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
  input: TripPlannerInput;
  itinerary?: Itinerary;
  notes?: string;
  image?: string;
  destinationSlug?: string;
  place?: SavedTripPlace;
};

function read(): SavedTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedTrip[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(trips: SavedTrip[]) {
  window.localStorage.setItem(KEY, JSON.stringify(trips));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("wanderfolk:trips-changed"));
  }
}

function makeId() {
  const now = Date.now();
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `t_${now}_${Math.random().toString(36).slice(2, 9)}`;
}

export const tripStore = {
  list(): SavedTrip[] {
    return read().sort((a, b) => b.updatedAt - a.updatedAt);
  },
  get(id: string): SavedTrip | undefined {
    return read().find((t) => t.id === id);
  },
  save(
    trip: Omit<SavedTrip, "id" | "createdAt" | "updatedAt"> & { id?: string },
  ): SavedTrip {
    const trips = read();
    const now = Date.now();
    if (trip.id) {
      const idx = trips.findIndex((t) => t.id === trip.id);
      if (idx >= 0) {
        const updated: SavedTrip = { ...trips[idx], ...trip, id: trip.id, updatedAt: now };
        trips[idx] = updated;
        write(trips);
        return updated;
      }
    }
    const created: SavedTrip = {
      id: makeId(),
      createdAt: now,
      updatedAt: now,
      title: trip.title,
      input: trip.input,
      itinerary: trip.itinerary,
      notes: trip.notes,
      image: trip.image,
      destinationSlug: trip.destinationSlug,
      place: trip.place,
    };
    trips.push(created);
    write(trips);
    return created;
  },
  duplicate(id: string): SavedTrip | undefined {
    const t = read().find((x) => x.id === id);
    if (!t) return;
    const copy = tripStore.save({
      title: t.title ? `${t.title} (copy)` : undefined,
      input: t.input,
      itinerary: t.itinerary,
      notes: t.notes,
      image: t.image,
      destinationSlug: t.destinationSlug,
      place: t.place,
    });
    return copy;
  },
  remove(id: string) {
    write(read().filter((t) => t.id !== id));
  },
};
