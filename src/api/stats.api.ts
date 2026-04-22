import { Hono } from "hono";
import prisma from "../prisma.ts";

export const app = new Hono();

// GET /api/stats
app.get("/", async (c) => {
  const [total, correct, recent] = await Promise.all([
    prisma.attempt.count(),
    prisma.attempt.count({ where: { correct: true } }),
    prisma.attempt.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { scenario: { select: { holeCards: true, flop: true, pot: true, bet: true } } },
    }),
  ]);

  const breakdown = await prisma.$queryRaw<
    { category: string; total: bigint; correct: bigint }[]
  >`
    SELECT
      CASE WHEN "estimatedEq" > "requiredEq" THEN 'shouldCall' ELSE 'shouldFold' END AS category,
      COUNT(*)::bigint AS total,
      SUM(CASE WHEN correct THEN 1 ELSE 0 END)::bigint AS correct
    FROM "Attempt"
    WHERE "estimatedEq" != "requiredEq"
    GROUP BY category
  `;

  const byCategory = Object.fromEntries(
    breakdown.map((r) => [r.category, { total: Number(r.total), correct: Number(r.correct) }])
  );

  return c.json({
    total,
    correct,
    accuracy: total > 0 ? +(correct / total).toFixed(4) : 0,
    breakdown: {
      shouldCall: byCategory["shouldCall"] ?? { total: 0, correct: 0 },
      shouldFold: byCategory["shouldFold"] ?? { total: 0, correct: 0 },
    },
    recent: recent.map((a) => ({
      id: a.id,
      decision: a.decision,
      estimatedEq: +a.estimatedEq.toFixed(4),
      requiredEq: +a.requiredEq.toFixed(4),
      correct: a.correct,
      scenario: a.scenario,
      createdAt: a.createdAt,
    })),
  });
});
