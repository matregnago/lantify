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

export async function fetchSteamProfiles(steamIds: string[]) {
  const cachedData = await redis.mget(...steamIds);

  const cachedProfiles: SteamPlayer[] = await Promise.all(
    cachedData
      .filter((profile) => profile != null)
      .map((profile) => JSON.parse(profile)),
  );

  const notCachedProfiles = steamIds.filter(
    (id) => !cachedProfiles.some((a) => a.steamid === id),
  );

  if (notCachedProfiles.length == 0) {
    console.log("all cached data");
    return cachedProfiles;
  }
  const steamIdsToFetch = notCachedProfiles.filter(Boolean).join(",");

  const apiKey = process.env.STEAM_API_KEY;
  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamIdsToFetch}`;
  const response = await fetch(url);
  console.log("fetching steam api");
  if (!response.ok || response.status !== 200) {
    return cachedProfiles;
  }

  const data: SteamApiResponse = await response.json();

  const profilesKeyValuePairs = data.response.players
    .map((profile) => [profile.steamid, JSON.stringify(profile)])
    .flatMap((p) => p);

  await redis.mset(...profilesKeyValuePairs);
  const expirePromises = notCachedProfiles.map((key) =>
    redis.expire(key, 43200),
  ); // 12h
  await Promise.all(expirePromises);
  return [...cachedProfiles, ...data.response.players];
}
