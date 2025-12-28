import { db, desc, eq } from "@repo/database";
import * as s from "@repo/database/schema";
import { PlayerDTO } from "@repo/contracts";
import { fetchSteamProfiles, SteamPlayer } from "./steam";

function mapSteamDataWithPlayer(
  players: PlayerDTO[],
  steamApiResponse: SteamPlayer[],
): PlayerDTO[] {
  return players.map((player) => {
    const playerData = steamApiResponse.find(
      (data) => data.steamid === player.steamId,
    );
    return {
      ...player,
      avatarUrl: playerData?.avatarfull,
      steamNickname: playerData?.personaname,
    };
  });
}

export async function getMatchData(matchId: string) {
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

  const steamData = (await fetchSteamProfiles(steamIds)) || {
    response: { players: [] },
  };

  const completeMatchData = {
    ...match,
    teams: match.teams.map((team) => {
      const players: PlayerDTO[] = team.players.map((p) => {
        return { ...p, avatarUrl: "", steamNickname: "" };
      });
      return {
        ...team,
        players: mapSteamDataWithPlayer(players, steamData),
      };
    }),
  };
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
      match.teams.flatMap((team) => team.players.map((player) => player.steamId)),
    ).filter(Boolean).join(",");

  const steamData = (await fetchSteamProfiles(steamIds)) || {
    response: { players: [] },
  };

  const matchesData = matches.map((match) => {
    return {
      ...match,
      teams: match.teams.map((team) => {
        const players: PlayerDTO[] = team.players.map((p) => {
          return { ...p, avatarUrl: "", steamNickname: "" };
        });
        return {
          ...team,
          players: mapSteamDataWithPlayer(players, steamData),
        };
      }),
    };
  });
  return matchesData;
}
