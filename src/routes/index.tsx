import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Destinations } from "@/components/site/Destinations";
import { Journeys } from "@/components/site/Journeys";
import { Journal } from "@/components/site/Journal";
import { PlannerSection } from "@/components/site/PlannerSection";
import { SavedTripsSection } from "@/components/site/SavedTripsSection";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main>
      <Toaster richColors position="top-center" />
      <Nav />
      <Hero />
      <Destinations />
      <Journeys />
      <Journal />
      <PlannerSection />
      <SavedTripsSection />
      <CTA />
      <Footer />
    </main>
  );
}
