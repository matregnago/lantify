import type { DemoFile, NewTeam } from "./types.js";

export const createTeams = (data: DemoFile, matchId: string) => {
	const teamAData: NewTeam = {
		matchId,
		name: data.teamA.name,
		isWinner: data.winner.letter === data.teamA.letter,
		score: data.teamA.score,
		scoreFirstHalf: data.teamA.scoreFirstHalf,
		scoreSecondHalf: data.teamA.scoreSecondHalf,
		currentSide: data.teamA.currentSide,
	};

	const teamBData: NewTeam = {
		matchId,
		name: data.teamB.name,
		isWinner: data.winner.letter === data.teamB.letter,
		score: data.teamB.score,
		scoreFirstHalf: data.teamB.scoreFirstHalf,
		scoreSecondHalf: data.teamB.scoreSecondHalf,
		currentSide: data.teamB.currentSide,
	};

	return [teamAData, teamBData];
};

type InsertedTeam = {
	id: number;
	name: string;
};
export const mapTeamsIds = (data: DemoFile, teams: InsertedTeam[]) => {
	const teamsMap = new Map<string, number>();

	for (const team of teams) {
		if (team.name === data.teamA.name) {
			teamsMap.set(data.teamA.letter, team.id);
		} else {
			teamsMap.set(data.teamB.letter, team.id);
		}
	}
	return teamsMap;
};
