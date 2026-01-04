CREATE INDEX "kill_match_round_tick_idx" ON "kill" USING btree ("matchId","roundNumber","tick");--> statement-breakpoint
CREATE INDEX "kill_match_killer_idx" ON "kill" USING btree ("matchId","killerSteamId");--> statement-breakpoint
CREATE INDEX "kill_match_victim_idx" ON "kill" USING btree ("matchId","victimSteamId");--> statement-breakpoint
CREATE INDEX "kill_match_weapon_idx" ON "kill" USING btree ("matchId","weaponName");--> statement-breakpoint
ALTER TABLE "kill" DROP COLUMN "frame";