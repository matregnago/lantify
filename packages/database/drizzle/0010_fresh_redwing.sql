CREATE TABLE "round" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "round_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"matchId" varchar(255) NOT NULL,
	"number" integer NOT NULL,
	"startTick" integer NOT NULL,
	"freezeTimeEndTick" integer NOT NULL,
	"endTick" integer NOT NULL,
	"endOfficiallyTick" integer NOT NULL,
	"overtimeNumber" integer NOT NULL,
	"teamAName" varchar(255) NOT NULL,
	"teamBName" varchar(255) NOT NULL,
	"teamAScore" integer NOT NULL,
	"teamBScore" integer NOT NULL,
	"teamASide" integer NOT NULL,
	"teamBSide" integer NOT NULL,
	"teamAEquipmentValue" integer NOT NULL,
	"teamBEquipmentValue" integer NOT NULL,
	"teamAMoneySpent" integer NOT NULL,
	"teamBMoneySpent" integer NOT NULL,
	"teamAEconomyType" varchar(255) NOT NULL,
	"teamBEconomyType" varchar(255) NOT NULL,
	"duration" integer NOT NULL,
	"endReason" integer NOT NULL,
	"winnerName" varchar(255) NOT NULL,
	"winnerSide" integer NOT NULL,
	"teamAStartMoney" integer NOT NULL,
	"teamBStartMoney" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "round" ADD CONSTRAINT "round_matchId_match_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "round_match_number_unique" ON "round" USING btree ("matchId","number");