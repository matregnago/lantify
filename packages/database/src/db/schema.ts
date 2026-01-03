import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

export const matches = t.pgTable("match", {
	id: t.varchar({ length: 255 }).primaryKey(),
	map: t.varchar({ length: 255 }).notNull(),
	date: t.varchar({ length: 255 }).notNull(),
});

export const teams = t.pgTable("team", {
	id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
	matchId: t
		.varchar({ length: 255 })
		.references(() => matches.id, { onDelete: "cascade" }),
	name: t.varchar({ length: 255 }).notNull(),
	isWinner: t.boolean().notNull(),
	score: t.integer().notNull(),
	scoreFirstHalf: t.integer().notNull(),
	scoreSecondHalf: t.integer().notNull(),
	currentSide: t.integer().notNull(),
});

export const players = t.pgTable(
	"player",
	{
		id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
		steamId: t.varchar({ length: 255 }).notNull(),
		matchId: t
			.varchar({ length: 255 })
			.references(() => matches.id, { onDelete: "cascade" }),
		teamId: t.integer().references(() => teams.id, { onDelete: "cascade" }),
		name: t.varchar({ length: 255 }).notNull(),
		score: t.integer().notNull(),
		mvpCount: t.integer().notNull(),
		winCount: t.integer().notNull(),
		crosshairShareCode: t.varchar({ length: 255 }),
		color: t.integer().notNull(),
		killCount: t.integer().notNull(),
		deathCount: t.integer().notNull(),
		assistCount: t.integer().notNull(),
		killDeathRatio: t.doublePrecision().notNull(),
		kast: t.doublePrecision().notNull(),
		bombDefusedCount: t.integer().notNull(),
		bombPlantedCount: t.integer().notNull(),
		healthDamage: t.integer().notNull(),
		armorDamage: t.integer().notNull(),
		utilityDamage: t.integer().notNull(),
		headshotCount: t.integer().notNull(),
		headshotPercent: t.doublePrecision().notNull(),
		hostageRescuedCount: t.integer().notNull(),
		averageKillPerRound: t.doublePrecision().notNull(),
		averageDeathPerRound: t.doublePrecision().notNull(),
		averageDamagePerRound: t.doublePrecision().notNull(),
		utilityDamagePerRound: t.doublePrecision().notNull(),
		firstKillCount: t.integer().notNull(),
		firstDeathCount: t.integer().notNull(),
		firstTradeDeathCount: t.integer().notNull(),
		tradeDeathCount: t.integer().notNull(),
		tradeKillCount: t.integer().notNull(),
		firstTradeKillCount: t.integer().notNull(),
		oneKillCount: t.integer().notNull(),
		twoKillCount: t.integer().notNull(),
		threeKillCount: t.integer().notNull(),
		fourKillCount: t.integer().notNull(),
		fiveKillCount: t.integer().notNull(),
		hltvRating: t.doublePrecision().notNull(),
		hltvRating2: t.doublePrecision().notNull(),
		totalFlashes: t.integer().notNull(),
		totalSmokes: t.integer().notNull(),
		totalMolotovs: t.integer().notNull(),
		totalHes: t.integer().notNull(),
		flashAssists: t.integer().notNull(),
		enemiesFlashed: t.integer().notNull(),
		enemiesBlindTime: t.doublePrecision().notNull(),
		selfFlashed: t.integer().notNull(),
		selfBlindTime: t.doublePrecision().notNull(),
		friendsFlashed: t.integer().notNull(),
		friendsBlindTime: t.doublePrecision().notNull(),
		heDamage: t.doublePrecision().notNull(),
		heTeamDamage: t.doublePrecision().notNull(),
	},
	(table) => [t.index("steamId_idx").on(table.steamId)],
);

export const playerDuels = t.pgTable("player_duels", {
	id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
	matchId: t
		.varchar({ length: 255 })
		.references(() => matches.id, { onDelete: "cascade" }),
	playerA_steamId: t.varchar({ length: 255 }).notNull(),
	playerB_steamId: t.varchar({ length: 255 }).notNull(),
	kills: t.integer().notNull(),
	deaths: t.integer().notNull(),
});

export const clutches = t.pgTable("clutch", {
	id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
	matchId: t
		.varchar({ length: 255 })
		.references(() => matches.id, { onDelete: "cascade" }),
	roundNumber: t.integer().notNull(),
	opponentCount: t.integer().notNull(),
	hasWon: t.boolean().notNull(),
	clutcherSteamId: t.varchar({ length: 255 }).notNull(),
	clutcherSurvived: t.boolean().notNull(),
	clutcherKillCount: t.integer().notNull(),
});

export const matchRelations = relations(matches, ({ many }) => ({
	teams: many(teams),
	duels: many(playerDuels),
	clutches: many(clutches),
}));

export const teamRelations = relations(teams, ({ many, one }) => ({
	match: one(matches, {
		fields: [teams.matchId],
		references: [matches.id],
	}),
	players: many(players),
}));

export const playerRelations = relations(players, ({ one }) => ({
	match: one(matches, {
		fields: [players.matchId],
		references: [matches.id],
	}),
	team: one(teams, {
		fields: [players.teamId],
		references: [teams.id],
	}),
}));

export const playerDuelsRelations = relations(playerDuels, ({ one }) => ({
	match: one(matches, {
		fields: [playerDuels.matchId],
		references: [matches.id],
	}),
}));

export const clutchesRelations = relations(clutches, ({ one }) => ({
	match: one(matches, {
		fields: [clutches.matchId],
		references: [matches.id],
	}),
}));
