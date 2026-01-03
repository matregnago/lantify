import type { DemoFile, NewDuel } from "./types.js";

type DuelsMap = Map<string, Map<string, NewDuel>>;

const getOrCreateDuelMap = (duelsMap: DuelsMap, playerId: string) => {
	let duels = duelsMap.get(playerId);
	if (!duels) {
		duels = new Map<string, NewDuel>();
		duelsMap.set(playerId, duels);
	}
	return duels;
};

const getOrCreateDuel = (
	duels: Map<string, NewDuel>,
	playerA: string,
	playerB: string,
	matchId: string,
): NewDuel => {
	let duel = duels.get(playerB);
	if (!duel) {
		duel = {
			playerA_steamId: playerA,
			playerB_steamId: playerB,
			kills: 0,
			deaths: 0,
			matchId,
		};
		duels.set(playerB, duel);
	}
	return duel;
};

export const createDuels = (data: DemoFile, matchId: string) => {
	const duelsMap: DuelsMap = new Map();
	const playerIds = Object.keys(data.players).map(String);

	for (const playerA of playerIds) {
		const map = new Map<string, NewDuel>();

		for (const playerB of playerIds) {
			if (playerA === playerB) continue;

			map.set(playerB, {
				playerA_steamId: playerA,
				playerB_steamId: playerB,
				kills: 0,
				deaths: 0,
				matchId,
			});
		}

		duelsMap.set(playerA, map);
	}

	for (const kill of data.kills) {
		const killerId = kill.killerSteamId;
		const victimId = kill.victimSteamId;

		if (
			kill.killerSide !== kill.victimSide &&
			kill.killerSteamId !== "0" &&
			kill.victimSteamId !== "0"
		) {
			const killerDuels = getOrCreateDuelMap(duelsMap, killerId);
			const victimDuels = getOrCreateDuelMap(duelsMap, victimId);

			const killerDuel = getOrCreateDuel(
				killerDuels,
				killerId,
				victimId,
				matchId,
			);

			const victimDuel = getOrCreateDuel(
				victimDuels,
				victimId,
				killerId,
				matchId,
			);

			killerDuel.kills += 1;
			victimDuel.deaths += 1;
		}
	}

	const duels = Array.from(duelsMap.values()).flatMap((duel) =>
		Array.from(duel.values()),
	);
	return duels;
};
