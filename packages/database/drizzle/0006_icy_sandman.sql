CREATE TABLE "clutch" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clutch_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"matchId" varchar(255),
	"roundNumber" integer NOT NULL,
	"opponentCount" integer NOT NULL,
	"hasWon" boolean NOT NULL,
	"clutcherSteamId" varchar(255) NOT NULL,
	"clutcherName" varchar(255) NOT NULL,
	"clutcherSurvived" varchar(255),
	"clutcherKillCount" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "player" ALTER COLUMN "steamId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clutch" ADD CONSTRAINT "clutch_matchId_match_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsOneCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsOneWonCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsOneLostCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsTwoCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsTwoWonCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsTwoLostCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsThreeCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsThreeWonCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsThreeLostCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsFourCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsFourWonCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsFourLostCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsFiveCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsFiveWonCount";--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "oneVsFiveLostCount";