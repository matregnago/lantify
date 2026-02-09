CREATE TABLE "damage" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "damage_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"matchId" varchar(255) NOT NULL,
	"tick" integer NOT NULL,
	"roundNumber" integer NOT NULL,
	"healthDamage" integer NOT NULL,
	"armorDamage" integer NOT NULL,
	"attackerSteamId" varchar(255) NOT NULL,
	"attackerSide" integer NOT NULL,
	"attackerTeamName" varchar(255) NOT NULL,
	"isAttackerControllingBot" boolean NOT NULL,
	"victimSteamId" varchar(255) NOT NULL,
	"victimSide" integer NOT NULL,
	"victimTeamName" varchar(255) NOT NULL,
	"isVictimControllingBot" boolean NOT NULL,
	"victimHealth" integer NOT NULL,
	"victimNewHealth" integer NOT NULL,
	"victimArmor" integer NOT NULL,
	"victimNewArmor" integer NOT NULL,
	"hitgroup" integer NOT NULL,
	"weaponName" varchar(64) NOT NULL,
	"weaponType" varchar(64) NOT NULL,
	"weaponUniqueId" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "damage" ADD CONSTRAINT "damage_matchId_match_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "damage_match_tick_idx" ON "damage" USING btree ("matchId","tick");--> statement-breakpoint
CREATE INDEX "damage_attacker_idx" ON "damage" USING btree ("attackerSteamId");--> statement-breakpoint
CREATE INDEX "damage_victim_idx" ON "damage" USING btree ("victimSteamId");--> statement-breakpoint
CREATE INDEX "damage_round_idx" ON "damage" USING btree ("matchId","roundNumber");