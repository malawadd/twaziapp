/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Workflow` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workflow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "definition" TEXT NOT NULL,
    "executionPlan" TEXT,
    "creditsCost" INTEGER NOT NULL DEFAULT 0,
    "cron" TEXT,
    "status" TEXT NOT NULL,
    "lastRunAt" DATETIME,
    "lastRunId" TEXT,
    "lastRunStatus" TEXT,
    "nextRunAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Workflow" ("createdAt", "creditsCost", "cron", "definition", "description", "executionPlan", "id", "lastRunAt", "lastRunId", "lastRunStatus", "name", "nextRunAt", "status", "userId") SELECT "createdAt", "creditsCost", "cron", "definition", "description", "executionPlan", "id", "lastRunAt", "lastRunId", "lastRunStatus", "name", "nextRunAt", "status", "userId" FROM "Workflow";
DROP TABLE "Workflow";
ALTER TABLE "new_Workflow" RENAME TO "Workflow";
CREATE UNIQUE INDEX "Workflow_name_userId_key" ON "Workflow"("name", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
