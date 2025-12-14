ALTER TABLE "match" ALTER COLUMN "date" SET DATA TYPE varchar(255);--> statement-breakpoint
CREATE INDEX "steamId_idx" ON "player" USING btree ("steamId");