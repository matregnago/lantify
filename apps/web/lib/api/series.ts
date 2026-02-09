import type { MatchDTO, PlayerDTO } from "@repo/contracts";

function pushUniquePlayers(target: PlayerDTO[], incoming: PlayerDTO[]) {
	incoming.forEach((p) => {
		if (!target.some((tp) => tp.steamId === p.steamId)) target.push(p);
	});
}

export function overlapCount(team: PlayerDTO[], roster: PlayerDTO[]) {
	const rosterIds = new Set(roster.map((p) => p.steamId));
	let count = 0;
	for (const p of team) if (rosterIds.has(p.steamId)) count++;
	return count;
}

export function isStrongMatch(overlap: number, teamSize: number) {
	return overlap >= 3 || (teamSize > 0 && overlap / teamSize >= 0.6);
}

type SeriesPlayers = {
	teamA: { players: PlayerDTO[]; score: number };
	teamB: { players: PlayerDTO[]; score: number };
};

export async function findTeams(series: MatchDTO[]): Promise<SeriesPlayers> {
	const firstMatch = series[0];
	if (!firstMatch) throw new Error("findTeams: empty series");

	const teamA0 = firstMatch.teams[0];
	const teamB0 = firstMatch.teams[1];
	if (!teamA0 || !teamB0) throw new Error("findTeams: empty teams");

	const playersA: PlayerDTO[] = teamA0.players?.slice() ?? [];
	const playersB: PlayerDTO[] = teamB0.players?.slice() ?? [];

	let scoreA = 0;
	let scoreB = 0;

	if (teamA0.isWinner) scoreA++;
	else scoreB++;

	series.slice(1).forEach((match) => {
		const t1 = match.teams[0];
		const t2 = match.teams[1];
		if (!t1 || !t2) return;

		const p1 = t1.players ?? [];
		const p2 = t2.players ?? [];

		const t1A = overlapCount(p1, playersA);
		const t1B = overlapCount(p1, playersB);
		const t2A = overlapCount(p2, playersA);
		const t2B = overlapCount(p2, playersB);

		const t1StrongA = isStrongMatch(t1A, p1.length);
		const t1StrongB = isStrongMatch(t1B, p1.length);
		const t2StrongA = isStrongMatch(t2A, p2.length);
		const t2StrongB = isStrongMatch(t2B, p2.length);

		if (t1StrongA && !t2StrongA) {
			pushUniquePlayers(playersA, p1);
			pushUniquePlayers(playersB, p2);
			if (t1.isWinner) scoreA++;
			else scoreB++;
			return;
		}
		if (t2StrongA && !t1StrongA) {
			pushUniquePlayers(playersA, p2);
			pushUniquePlayers(playersB, p1);
			if (t2.isWinner) scoreA++;
			else scoreB++;
			return;
		}

		if (t1StrongB && !t2StrongB) {
			pushUniquePlayers(playersB, p1);
			pushUniquePlayers(playersA, p2);
			if (t2.isWinner) scoreA++;
			else scoreB++;
			return;
		}
		if (t2StrongB && !t1StrongB) {
			pushUniquePlayers(playersB, p2);
			pushUniquePlayers(playersA, p1);
			if (t1.isWinner) scoreA++;
			else scoreB++;
			return;
		}
	});

	return {
		teamA: { players: playersA, score: scoreA },
		teamB: { players: playersB, score: scoreB },
	};
}
