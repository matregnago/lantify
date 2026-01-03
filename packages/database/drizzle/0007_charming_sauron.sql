
ALTER TABLE "clutch"
ALTER COLUMN "clutcherSurvived"
TYPE boolean
USING "clutcherSurvived"::boolean;
--> statement-breakpoint

ALTER TABLE "clutch"
ALTER COLUMN "clutcherSurvived"
SET NOT NULL;
--> statement-breakpoint

ALTER TABLE "clutch"
DROP COLUMN "clutcherName";
