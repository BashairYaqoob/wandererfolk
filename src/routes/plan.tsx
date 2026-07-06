import { createFileRoute, redirect } from "@tanstack/react-router";

// The planner now lives on the home page as a section. This route stays as a
// stable URL and redirects to /#planner so old bookmarks keep working.
export const Route = createFileRoute("/plan")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "planner" });
  },
  component: () => null,
});
