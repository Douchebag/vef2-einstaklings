import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import app from "./app.ts";

app.use("/*", serveStatic({ root: "./frontend/dist" }));

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`Poker trainer running on http://localhost:${info.port}`);
});
