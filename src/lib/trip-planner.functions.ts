import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  destination: z.string().trim().min(2).max(80),
  durationDays: z.number().int().min(1).max(30),
  budgetUsd: z.number().int().min(50).max(100_000),
  style: z.enum(["relaxed", "adventure", "cultural", "foodie", "luxury", "budget"]),
  travelers: z.number().int().min(1).max(20),
});

export type TripPlannerInput = z.infer<typeof InputSchema>;

export type ItineraryDay = {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  tip?: string;
};

export type Itinerary = {
  summary: string;
  days: ItineraryDay[];
  packingList: string[];
};

const JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    days: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          day: { type: "number" },
          title: { type: "string" },
          morning: { type: "string" },
          afternoon: { type: "string" },
          evening: { type: "string" },
          tip: { type: "string" },
        },
        required: ["day", "title", "morning", "afternoon", "evening"],
      },
    },
    packingList: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "days", "packingList"],
} as const;

export const generateItinerary = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<Itinerary> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const system =
      "You are an expert travel planner. Return concise, practical day-by-day itineraries. Respond ONLY with JSON matching the provided schema. No prose.";
    const user = `Plan a ${data.durationDays}-day trip to ${data.destination} for ${data.travelers} traveler(s).
Style: ${data.style}. Total budget: $${data.budgetUsd} USD.
Include a short summary, a day-by-day plan (morning/afternoon/evening + one local tip per day), and a compact packing list (max 10 items).`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "Itinerary", strict: true, schema: JsonSchema },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Rate limited. Please try again in a moment.");
      if (res.status === 402)
        throw new Error("AI credits exhausted. Add credits in Lovable workspace settings.");
      throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = json.choices?.[0]?.message?.content ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("AI returned malformed response. Please retry.");
    }
    return parsed as Itinerary;
  });
