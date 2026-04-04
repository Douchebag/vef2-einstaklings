import { Hono } from "hono";

export const app = new Hono();

// GET /api/scenario/new
app.get("/new", async (c) => {
  return c.json({ message: "TODO: generate scenario" }, 501);
});
