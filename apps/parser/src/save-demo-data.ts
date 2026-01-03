import { DrizzleQueryError, db } from "@repo/database";
import * as schema from "@repo/database/schema";
import JSONbig from "json-bigint";
import { createClutches } from "./clutches.js";
import { createDuels } from "./duels.js";
import { createMatch } from "./match.js";
import { calculateAggregatedStats } from "./players.js";
import { createTeams, mapTeamsIds } from "./teams.js";
import type { DemoFile, NewMatch, NewPlayer } from "./types.js";

export const saveDemoData = async (fileName: string) => {
	const raw = await Bun.file(fileName).text();

	const data = JSONbig({
		storeAsString: true,
	}).parse(raw) as DemoFile;

	if (!data) {
		throw new Error(`Erro ao abrir arquivo ${fileName}`);
	}
	const matchData: NewMatch = createMatch(data);
	const playersStats = calculateAggregatedStats(data);
	try {
		await db.transaction(async (tx) => {
			await tx.insert(schema.matches).values(matchData);

			const teams = createTeams(data, matchData.id);

			const insertedTeams = await tx
				.insert(schema.teams)
				.values(teams)
				.returning({ id: schema.teams.id, name: schema.teams.name });

			const teamsIdMap = mapTeamsIds(data, insertedTeams);

			const playersData = Object.values(data.players).map((p) => {
				const calculated = playersStats.get(p.steamId) as NewPlayer;
				const teamId = teamsIdMap.get(p.team.letter) as number;
				return {
					matchId: matchData.id,
					teamId,
					...calculated,
				};
			});
			await tx.insert(schema.players).values(playersData);

			const duels = createDuels(data, matchData.id);

			await tx.insert(schema.playerDuels).values(duels);

			const clutches = createClutches(data, matchData.id);

			await tx.insert(schema.clutches).values(clutches);
		});
		console.log(
			`Dados da demo ${data.demoFileName} salvos com sucesso no banco.`,
		);
	} catch (error) {
		if (error instanceof DrizzleQueryError) {
			console.log("Erro detalhado:", error);
			console.log(
				`Dados já existem no banco para a demo ${data.demoFileName}.`,
			);
			return;
		}
		throw error;
	}
};
