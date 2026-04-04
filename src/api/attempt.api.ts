import { Hono } from "hono";
import { z } from "zod";

export const app = new Hono();

const attemptSchema = z.object({
  scenarioId: z.number().int().positive(),
  decision: z.enum(["fold", "call"]),
});

// POST /api/attempt
app.post("/", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const result = attemptSchema.safeParse(body);
  if (!result.success) return c.json({ error: result.error.flatten().fieldErrors }, 400);

  return c.json({ message: "TODO: evaluate attempt" }, 501);
});
