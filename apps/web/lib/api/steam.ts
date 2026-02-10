import { redis } from "@repo/redis";

export type SteamPlayer = {
	personaname: string;
	avatarfull: string;
	steamid: string;
};

type SteamApiResponse = {
	response: {
		players: SteamPlayer[];
	};
};

export function getSteamIdentity(
	steamId: string,
	steamData: SteamPlayer[],
): { nickName: string | null; avatarUrl: string | null } {
	const steam = steamData.find((s) => s.steamid === steamId);

	return {
		nickName: steam?.personaname ?? null,
		avatarUrl: steam?.avatarfull ?? null,
	};
}

export async function fetchSteamProfiles(steamIds: string[]) {
	const ids = steamIds.filter((id) => typeof id === "string" && id.length > 0);

	if (ids.length === 0) return [];

	const keys = ids.map((id) => `steam:profile:${id}`);
	const cachedData = await redis.mget(...keys);

	const cachedProfiles: SteamPlayer[] = cachedData
		.filter((profile): profile is string => profile != null && profile !== "")
		.map((profile) => JSON.parse(profile));

	const notCachedProfiles = ids.filter(
		(id) => !cachedProfiles.some((a) => a.steamid === id),
	);

	if (notCachedProfiles.length === 0) return cachedProfiles;

	const steamIdsToFetch = notCachedProfiles.join(",");

	const apiKey = process.env.STEAM_API_KEY;
	const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamIdsToFetch}`;
	const response = await fetch(url);
	if (!response.ok || response.status !== 200) {
		return cachedProfiles;
	}

	const data: SteamApiResponse = await response.json();

	const profilesKeyValuePairs = data.response.players.flatMap((profile) => [
		`steam:profile:${profile.steamid}`,
		JSON.stringify(profile),
	]);

	await redis.mset(...profilesKeyValuePairs);
	const expirePromises = notCachedProfiles.map((steamId) =>
		redis.expire(`steam:profile:${steamId}`, 43200),
	); // 12h
	await Promise.all(expirePromises);
	return [...cachedProfiles, ...data.response.players];
}
