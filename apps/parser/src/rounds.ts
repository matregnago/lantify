import type { DemoFile, NewRound } from "./types.js";

export const createRounds = (data: DemoFile, matchId: string) => {
	const rounds: NewRound[] = [];

	for (const round of data.rounds) {
		rounds.push({
			matchId,
			number: round.number,
			startTick: round.startTick,
			freezeTimeEndTick: round.freezeTimeEndTick,
			endTick: round.endTick,
			endOfficiallyTick: round.endOfficiallyTick,
			overtimeNumber: round.overtimeNumber,
			teamAName: round.teamAName,
			teamBName: round.teamBName,
			teamAScore: round.teamAScore,
			teamBScore: round.teamBScore,
			teamASide: round.teamASide,
			teamBSide: round.teamBSide,
			teamAEquipmentValue: round.teamAEquipmentValue,
			teamBEquipmentValue: round.teamBEquipmentValue,
			teamAMoneySpent: round.teamAMoneySpent,
			teamBMoneySpent: round.teamBmoneySpent,
			teamAEconomyType: round.teamAEconomyType,
			teamBEconomyType: round.teamBEconomyType,
			duration: round.duration,
			endReason: round.endReason,
			winnerName: round.winnerName,
			winnerSide: round.winnerSide,
			teamAStartMoney: round.teamAStartMoney,
			teamBStartMoney: round.teamBStartMoney,
		});
	}

	return rounds;
};
