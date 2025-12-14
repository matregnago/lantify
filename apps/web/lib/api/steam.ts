type SteamPlayer = {
  personaname: string;
  avatarfull: string;
  steamid: string;
};

export type SteamApiResponse = {
  response: {
    players: SteamPlayer[];
  };
};

export async function fetchSteamProfiles(steamIds: string) {
  const apiKey = process.env.STEAM_API_KEY;
  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamIds}`;
  const response = await fetch(url);

  if (response.status !== 200) {
    return { response: { players: [] } };
  }

  const data: SteamApiResponse = await response.json();
  return data;
}
