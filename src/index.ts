import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import app from "./app.ts";

app.use("/*", serveStatic({ root: "./frontend/dist" }));

const port = Number(process.env["PORT"] || 3001);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Poker trainer running on http://localhost:${info.port}`);
});
