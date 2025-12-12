import { db, desc, eq } from "@repo/database";
import * as s from "@repo/database/schema";
import { MatchDTO, PlayerDTO, TeamDTO } from "@repo/contracts";
import { fetchSteamProfiles } from "./steam";

export async function getMatchData(matchId: string) {
  const rows = await db
    .select()
    .from(s.matches)
    .leftJoin(s.teams, eq(s.teams.matchId, s.matches.id))
    .leftJoin(s.players, eq(s.players.teamId, s.teams.id))
    .where(eq(s.matches.id, matchId))
    .orderBy(desc(s.players.killCount));

  if (!rows.length || !rows[0]?.match) {
    return null;
  }

  const match: MatchDTO = {
    ...rows[0].match,
    teams: [],
  };

  let steamIds = "";

  for (let i = 0; i < rows.length; i++) {
    steamIds += rows[i]?.player?.steamId;
    if (i < rows.length - 1) steamIds += ",";
  }

  const steamData = await fetchSteamProfiles(steamIds);

  const teamsMap = new Map<number, TeamDTO>();

  for (const row of rows) {
    if (!row.team) continue;

    let team = teamsMap.get(row.team.id);

    if (!team) {
      team = {
        ...row.team,
        players: [],
      };
      teamsMap.set(row.team.id, team);
      match.teams.push(team);
    }

    if (row.player && team.players) {
      const alreadyAdded = team.players.some((p) => p.id === row.player!.id);

      if (!alreadyAdded) {
        const playerDataFromSteam = steamData
          ? steamData.response.players.find(
              (p) => p.steamid === row.player?.steamId
            )
          : null;
        if (playerDataFromSteam) {
          const player: PlayerDTO = {
            ...row.player,
            avatarUrl: playerDataFromSteam.avatarfull,
            steamNickname: playerDataFromSteam.personaname,
          };
          team.players.push(player);
        }
      }
    }
  }
  return match;
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
