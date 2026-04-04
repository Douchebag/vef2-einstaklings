import { Hono } from "hono";

export const app = new Hono();

// GET /api/stats
app.get("/", async (c) => {
  return c.json({ message: "TODO: return stats" }, 501);
});
