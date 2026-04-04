import { Hono } from "hono";
import { app as scenarioApp } from "./api/scenario.api.ts";
import { app as attemptApp } from "./api/attempt.api.ts";
import { app as statsApp } from "./api/stats.api.ts";

const app = new Hono();

app.route("/api/scenario", scenarioApp);
app.route("/api/attempt", attemptApp);
app.route("/api/stats", statsApp);

export default app;
