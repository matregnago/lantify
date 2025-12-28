"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { DuelDTO, MatchDTO, PlayerDTO } from "@repo/contracts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getPlayerDuelsByMonth } from "@/lib/api/player";
import { useRouter } from "next/navigation";

interface DuelsDropdownProps {
  matchMapByMonth: Map<string, MatchDTO[]>;
}

export const DuelsDropdown = ({ matchMapByMonth }: DuelsDropdownProps) => {
  const router = useRouter();
  const [selectedMatchMonth, setSelectedMatchMonth] = useState<string>("all");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [playerDuels, setPlayerDuels] = useState<DuelDTO[]>([]);
  const [playersInMonth, setPlayersInMonth] = useState<PlayerDTO[]>([]);

  useEffect(() => {
    let allMatches: MatchDTO[] = [];
    if (selectedMatchMonth === "all") {
      allMatches = Array.from(matchMapByMonth.values()).flatMap((d) => d);
    } else {
      allMatches = matchMapByMonth.get(selectedMatchMonth) || [];
    }

    const playersMap = new Map<string, PlayerDTO>();

    allMatches.forEach((m) =>
      m.teams.forEach((t) =>
        t.players?.forEach((p) => {
          if (p?.steamId && !playersMap.has(p.steamId))
            playersMap.set(p.steamId, p as PlayerDTO);
        }),
      ),
    );
    const players = Array.from(playersMap.values());

    setPlayersInMonth(players);
    setSelectedPlayer(players[0]?.steamId || null);
  }, [matchMapByMonth, selectedMatchMonth]);

  useEffect(() => {
    const fetchDuels = async () => {
      if (selectedPlayer) {
        const duels = (
          await getPlayerDuelsByMonth(selectedPlayer, selectedMatchMonth)
        ).map((d) => d.player_duels);
        setPlayerDuels(duels);
      }
    };
    fetchDuels();
  }, [selectedPlayer, selectedMatchMonth]);

  const playerDuelTotal = useMemo(() => {
    return playerDuels.reduce(
      (total, duel) => total + duel.kills - duel.deaths,
      0,
    );
  }, [playerDuels]);

  const killTotal = useMemo(() => {
    return playerDuels.reduce((total, duel) => total + duel.kills, 0);
  }, [playerDuels]);

  const deathTotal = useMemo(() => {
    return playerDuels.reduce((total, duel) => total + duel.deaths, 0);
  }, [playerDuels]);

  const kdTotal = useMemo(() => {
    const kills = killTotal;
    const deaths = deathTotal;
    return deaths === 0 ? kills : (kills / deaths).toFixed(2);
  }, [killTotal, deathTotal]);

  const months = useMemo(() => {
    return Array.from(matchMapByMonth.keys()).sort((a, b) => {
      const da = new Date(a);
      const db = new Date(b);
      return db.getTime() - da.getTime();
    });
  }, [matchMapByMonth]);

  const duels = new Map<string, { kills: number; deaths: number }>();
  playerDuels.forEach((d) => {
    const enemy = duels.get(d.playerB_steamId);
    if (enemy) {
      enemy.kills += d.kills;
      enemy.deaths += d.deaths;
    } else {
      duels.set(d.playerB_steamId, { kills: d.kills, deaths: d.deaths });
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Data da LAN
          </label>
          <Select
            value={selectedMatchMonth}
            onValueChange={(v) => {
              setSelectedMatchMonth(v);
              setSelectedPlayer(null);
            }}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Selecione a LAN" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Table className="bg-card rounded border">
          <TableHeader>
            <TableRow className="hover:bg-card">
              <TableHead className="w-64 border-r">
                <Select
                  value={selectedPlayer ?? ""}
                  onValueChange={(v) => setSelectedPlayer(v)}
                  disabled={!selectedMatchMonth}
                >
                  <SelectTrigger className="w-45">
                    <SelectValue placeholder="Select a player" />
                  </SelectTrigger>
                  <SelectContent>
                    {playersInMonth.map((p) => (
                      <SelectItem key={p.steamId} value={p.steamId as string}>
                        <div className="flex items-center gap-2.5">
                          <Image
                            src={p.avatarUrl || "/default-avatar.png"}
                            width={32}
                            height={32}
                            alt={`${p.name}'s avatar`}
                            className="rounded-full border border-gray-800 shrink-0"
                          />
                          <p>{p.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableHead>

              <TableHead className="text-center w-max hover:bg-muted/60 transition border-r">
                {playerDuelTotal}
              </TableHead>
              <TableHead className="text-center w-max hover:bg-muted/60 transition border-r">
                {kdTotal}
              </TableHead>
              <TableHead className="text-center w-max hover:bg-muted/60 transition border-r">
                {killTotal}
              </TableHead>
              <TableHead className="text-center w-max hover:bg-muted/60 transition border-r">
                {deathTotal}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border-r hover:bg-muted/50">
                VS Opponents
              </TableCell>
              <TableCell className="text-center border-r">Diff</TableCell>
              <TableCell className="text-center border-r">KD</TableCell>
              <TableCell className="text-center">Kills</TableCell>
              <TableCell className="text-center border-r">Mortes</TableCell>
            </TableRow>
            {playersInMonth.map((enemy, index) => {
              if (selectedPlayer && enemy.steamId === selectedPlayer) {
                return null;
              }
              if (!enemy.steamId) {
                console.log("Enemy without steamId:", enemy);
                return null;
              }
              const duel = duels.get(enemy.steamId);
              if (
                !duel ||
                (!duel.kills && !duel.deaths) ||
                (duel.kills === 0 && duel.deaths === 0)
              ) {
                console.log("No duels found for enemy:", enemy);
                return null;
              }

              return (
                <TableRow key={index} className="hover:bg-card">
                  <TableCell className="border-r hover:bg-muted/50">
                    <div
                      className="flex flex-row gap-3 items-center cursor-pointer w-fit"
                      onClick={() => router.push(`/profile/${enemy.steamId}`)}
                    >
                      <div className="flex items-center gap-2.5">
                        <Image
                          src={enemy.avatarUrl || "/default-avatar.png"}
                          width={32}
                          height={32}
                          alt={`${enemy.name}'s avatar`}
                          className="rounded-full border border-gray-800 shrink-0"
                        />
                        <p>{enemy.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center bg-background">
                    {duel.kills - duel.deaths}
                  </TableCell>
                  <TableCell className="text-center bg-background">
                    {((duel.kills * 1.0) / duel.deaths).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center bg-background">
                    {duel.kills}
                  </TableCell>
                  <TableCell className="text-center bg-background">
                    {duel.deaths}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
