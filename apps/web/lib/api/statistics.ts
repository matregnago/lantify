"use server";
import * as s from "@repo/database/schema";
import { db, sql, desc, eq } from "@repo/database";

export async function getKdList(month: string) {
    const kdExpr = sql<number>`
    ROUND(
      COALESCE(SUM(${s.players.killCount}), 0)::numeric
      / NULLIF(COALESCE(SUM(${s.players.deathCount}), 0), 0),
      2
    )
  `;

    const base = db
        .select({
            steamId: s.players.steamId,
            kd: kdExpr,
        })
        .from(s.players)
        .innerJoin(s.matches, eq(s.players.matchId, s.matches.id))
        .groupBy(s.players.steamId)
        .orderBy(desc(kdExpr));

    if (month === "all") return base;

    return base.where(
        sql`to_char(${s.matches.date}::timestamp, 'Mon YYYY') = ${month}`
    );
}