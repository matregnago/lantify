import type { DemoFile, NewMatch } from "./types.js";

export const createMatch = (data: DemoFile) => {
	const newMatch: NewMatch = {
		date: data.date,
		id: data.checksum,
		map: data.mapName,
	};
	return newMatch;
};
