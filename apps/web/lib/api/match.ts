import type { MatchDataDTO, PlayerDTO } from "@repo/contracts";
import { db, desc, eq } from "@repo/database";
import * as s from "@repo/database/schema";
import { redis } from "@repo/redis";
import { fetchSteamProfiles, getSteamIdentity } from "./steam";

export async function getMatchData(matchId: string) {
	const key = `matchData:${matchId}`;
	const cachedMatchData = await redis.get(key);
	if (cachedMatchData && cachedMatchData !== "") {
		return JSON.parse(cachedMatchData) as MatchDataDTO;
	}
	const match = await db.query.matches.findFirst({
		where: eq(s.matches.id, matchId),
		with: {
			teams: {
				with: {
					players: {
						orderBy: [
							desc(s.players.killCount),
							desc(s.players.averageDamagePerRound),
						],
					},
				},
			},
			duels: true,
		},
	});

	if (!match) {
		return null;
	}
	const steamIds = match.teams
		.flatMap((team) => team.players.map((player) => player.steamId))
		.filter((id) => id != null);

	const clutches = await db
		.select()
		.from(s.clutches)
		.where(eq(s.clutches.matchId, matchId));

	const steamData = (await fetchSteamProfiles(steamIds)) || [];
	const completeMatchData: MatchDataDTO = {
		...match,
		clutches,
		teams: match.teams.map((team) => {
			const players: PlayerDTO[] = team.players.map((p) => {
				const steamIdentity = getSteamIdentity(p.steamId, steamData);
				return {
					...p,
					avatarUrl: steamIdentity.avatarUrl,
					steamNickname: steamIdentity.nickName,
				};
			});
			return {
				...team,
				players,
			};
		}),
	};

	await redis.set(key, JSON.stringify(completeMatchData), "EX", 43200); // 12 hours

	return completeMatchData;
}

export async function listMatches() {
	const matches = await db.query.matches.findMany({
		orderBy: desc(s.matches.date),
		with: {
			teams: true,
		},
	});
	return matches;
}

export async function listMatchesWithPlayers() {
	const matches = await db.query.matches.findMany({
		orderBy: desc(s.matches.date),
		with: {
			teams: {
				with: {
					players: true,
				},
			},
		},
	});

	const steamIds = matches
		.flatMap((match) =>
			match.teams.flatMap((team) =>
				team.players.map((player) => player.steamId),
			),
		)
		.filter((m) => m != null);

	const steamData = await fetchSteamProfiles(steamIds);
	const matchesData = matches.map((match) => {
		return {
			...match,
			teams: match.teams.map((team) => {
				const players: PlayerDTO[] = team.players.map((p) => {
					const steamIdentity = getSteamIdentity(p.steamId, steamData);
					return {
						...p,
						avatarUrl: steamIdentity.avatarUrl,
						steamNickname: steamIdentity.nickName,
					};
				});
				return {
					...team,
					players,
				};
			}),
		};
	});
	return matchesData;
}
