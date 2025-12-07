CREATE TABLE "match" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"map" varchar(255) NOT NULL,
	"date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "player_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"steamId" varchar(255),
	"matchId" varchar(255),
	"teamId" integer,
	"name" varchar(255) NOT NULL,
	"score" integer NOT NULL,
	"mvpCount" integer NOT NULL,
	"winCount" integer NOT NULL,
	"crosshairShareCode" varchar(255),
	"color" integer NOT NULL,
	"killCount" integer NOT NULL,
	"deathCount" integer NOT NULL,
	"assistCount" integer NOT NULL,
	"killDeathRatio" double precision NOT NULL,
	"kast" double precision NOT NULL,
	"bombDefusedCount" integer NOT NULL,
	"bombPlantedCount" integer NOT NULL,
	"healthDamage" integer NOT NULL,
	"armorDamage" integer NOT NULL,
	"utilityDamage" integer NOT NULL,
	"headshotCount" integer NOT NULL,
	"headshotPercent" double precision NOT NULL,
	"oneVsOneCount" integer NOT NULL,
	"oneVsOneWonCount" integer NOT NULL,
	"oneVsOneLostCount" integer NOT NULL,
	"oneVsTwoCount" integer NOT NULL,
	"oneVsTwoWonCount" integer NOT NULL,
	"oneVsTwoLostCount" integer NOT NULL,
	"oneVsThreeCount" integer NOT NULL,
	"oneVsThreeWonCount" integer NOT NULL,
	"oneVsThreeLostCount" integer NOT NULL,
	"oneVsFourCount" integer NOT NULL,
	"oneVsFourWonCount" integer NOT NULL,
	"oneVsFourLostCount" integer NOT NULL,
	"oneVsFiveCount" integer NOT NULL,
	"oneVsFiveWonCount" integer NOT NULL,
	"oneVsFiveLostCount" integer NOT NULL,
	"hostageRescuedCount" integer NOT NULL,
	"averageKillPerRound" double precision NOT NULL,
	"averageDeathPerRound" double precision NOT NULL,
	"averageDamagePerRound" double precision NOT NULL,
	"utilityDamagePerRound" double precision NOT NULL,
	"firstKillCount" integer NOT NULL,
	"firstDeathCount" integer NOT NULL,
	"firstTradeDeathCount" integer NOT NULL,
	"tradeDeathCount" integer NOT NULL,
	"tradeKillCount" integer NOT NULL,
	"firstTradeKillCount" integer NOT NULL,
	"oneKillCount" integer NOT NULL,
	"twoKillCount" integer NOT NULL,
	"threeKillCount" integer NOT NULL,
	"fourKillCount" integer NOT NULL,
	"fiveKillCount" integer NOT NULL,
	"hltvRating" double precision NOT NULL,
	"hltvRating2" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "team_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"matchId" varchar(255),
	"name" varchar(255) NOT NULL,
	"isWinner" boolean NOT NULL,
	"score" integer NOT NULL,
	"scoreFirstHalf" integer NOT NULL,
	"scoreSecondHalf" integer NOT NULL,
	"currentSide" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_matchId_match_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."match"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_matchId_match_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."match"("id") ON DELETE no action ON UPDATE no action;