"use server";
import { alias, and, count, db, eq, gte, lte, ne, or } from "@repo/database";
import * as s from "@repo/database/schema";
import { buildStatsWhere, withMatchJoinIfDate } from "../query-helpers";

export const getPistolRating2 = async (
	steamId: string,
	date: string = "all",
) => {
	const pistolRoundStats = getPistolRoundStats(steamId, date);
};

const getPistolRoundStats = async (steamId: string, date: string = "all") => {
	const extra = [or(eq(s.rounds.number, 1), eq(s.rounds.number, 13))];
	const pistolRoundWhere = buildStatsWhere({
		date,
		steamIdColumn: s.players.steamId,
		dateColumn: date === "all" ? undefined : s.matches.date,
		extra,
	});
	const pistolRoundBase = db
		.select({
			matchId: s.rounds.matchId,
			roundNumber: s.rounds.number,
		})
		.from(s.rounds);

	const pistolRoundQ = withMatchJoinIfDate(
		pistolRoundBase,
		date,
		s.rounds.matchId,
	)
		.where(pistolRoundWhere)
		.groupby(s.rounds.matchId, s.rounds.number)
		.as("pistol_rounds");
};
