-- CreateTable
CREATE TABLE "Scenario" (
    "id" SERIAL NOT NULL,
    "holeCards" TEXT[],
    "flop" TEXT[],
    "pot" INTEGER NOT NULL,
    "bet" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" SERIAL NOT NULL,
    "scenarioId" INTEGER NOT NULL,
    "decision" TEXT NOT NULL,
    "estimatedEq" DOUBLE PRECISION NOT NULL,
    "requiredEq" DOUBLE PRECISION NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
