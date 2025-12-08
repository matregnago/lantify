import { db, desc, eq } from "@repo/database";
import * as s from "@repo/database/schema";
import { MatchDTO, TeamDTO } from "@repo/contracts";

export async function getMatchData(request: Bun.BunRequest<"/matches/:id">) {
  const matchId = request.params.id;

  const rows = await db
    .select()
    .from(s.matches)
    .leftJoin(s.teams, eq(s.teams.matchId, s.matches.id))
    .leftJoin(s.players, eq(s.players.teamId, s.teams.id))
    .where(eq(s.matches.id, matchId))
    .orderBy(desc(s.players.killCount));

  if (!rows.length || !rows[0]?.match) {
    return Response.json({ error: "Partida não encontrada!" }, { status: 404 });
  }

  const match: MatchDTO = {
    ...rows[0].match,
    teams: [],
  };

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
        team.players.push(row.player);
      }
    }
  }

  return Response.json(match, { status: 200 });
}

export async function listMatches(request: Bun.BunRequest<"/matches">) {
  const rows = await db
    .select()
    .from(s.matches)
    .leftJoin(s.teams, eq(s.matches.id, s.teams.matchId));

  const matchesMap = new Map<string, MatchDTO>();

  for (const row of rows) {
    if (!matchesMap.get(row.match.id)) {
      matchesMap.set(row.match.id, {
        id: row.match.id,
        map: row.match.map,
        date: row.match.date,
        teams: [],
      });
    }
    if (row.team) {
      matchesMap.get(row.match.id)!.teams.push({
        id: row.team.id,
        name: row.team.name,
        matchId: row.team.matchId,
        isWinner: row.team.isWinner,
        score: row.team.score,
        scoreFirstHalf: row.team.scoreFirstHalf,
        scoreSecondHalf: row.team.scoreSecondHalf,
        currentSide: row.team.currentSide,
      });
    }
  }
  const matches = Array.from(matchesMap.values());

  return Response.json(matches, { status: 200 });
}
