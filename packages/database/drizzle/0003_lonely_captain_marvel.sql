CREATE TABLE "player_duels" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "player_duels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"matchId" varchar(255),
	"playerA_steamId" varchar(255) NOT NULL,
	"playerB_steamId" varchar(255) NOT NULL,
	"kills" integer NOT NULL,
	"deaths" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "player_duels" ADD CONSTRAINT "player_duels_matchId_match_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;