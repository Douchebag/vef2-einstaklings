-- AlterTable: add turn and turnBet to Scenario (with defaults for existing rows)
ALTER TABLE "Scenario" ADD COLUMN "turn" TEXT NOT NULL DEFAULT 'As',
                       ADD COLUMN "turnBet" INTEGER NOT NULL DEFAULT 5;
ALTER TABLE "Scenario" ALTER COLUMN "turn" DROP DEFAULT;
ALTER TABLE "Scenario" ALTER COLUMN "turnBet" DROP DEFAULT;

-- AlterTable: add street to Attempt (existing rows are flop decisions)
ALTER TABLE "Attempt" ADD COLUMN "street" TEXT NOT NULL DEFAULT 'flop';
ALTER TABLE "Attempt" ALTER COLUMN "street" DROP DEFAULT;
