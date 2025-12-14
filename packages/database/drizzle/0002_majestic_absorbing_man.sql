ALTER TABLE "player" DROP CONSTRAINT "player_matchId_match_id_fk";
--> statement-breakpoint
ALTER TABLE "player" DROP CONSTRAINT "player_teamId_team_id_fk";
--> statement-breakpoint
ALTER TABLE "team" DROP CONSTRAINT "team_matchId_match_id_fk";
--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_matchId_match_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_matchId_match_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;