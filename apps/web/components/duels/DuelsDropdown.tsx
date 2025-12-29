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
import { diffColor } from "@/lib/diff-color";
import { colorByMaxValue } from "@/lib/color-by-max-value";
import { SelectLan } from "./SelectLan";

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
    if (
      selectedPlayer == null ||
      !playersInMonth.some((p) => p.steamId === selectedPlayer)
    ) {
      setSelectedPlayer(playersInMonth[0]?.steamId || null);
    }
  }, [selectedPlayer, playersInMonth]);

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
    return deaths === 0 ? kills.toFixed(2) : (kills / deaths).toFixed(2);
  }, [killTotal, deathTotal]);

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
          <SelectLan
            matchMapByMonth={matchMapByMonth}
            selectedMatchMonth={selectedMatchMonth}
            setSelectedMatchMonth={setSelectedMatchMonth}
            setPlayersInMonth={setPlayersInMonth}
          />
        </div>
      </div>
      <div>
        <div className="relative w-full overflow-x-auto">
          <Table className="bg-card border">
            <TableHeader>
              <TableRow className="hover:bg-card">
                <TableHead className="w-64 border-r p-0 align-middle">
                  <Select
                    value={selectedPlayer ?? ""}
                    onValueChange={(v) => setSelectedPlayer(v)}
                    disabled={!selectedMatchMonth}
                  >
                    <SelectTrigger className="w-full h-full min-h-full border-0 rounded-none px-3 flex items-center">
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

                <TableHead
                  className={`text-center w-max bg-muted/60 transition border-r ${diffColor(playerDuelTotal)}`}
                >
                  {playerDuelTotal}
                </TableHead>

                <TableHead
                  className="text-center w-max bg-muted/60 transition border-r"
                  style={{ color: colorByMaxValue(Number(kdTotal), 1.5) }}
                >
                  {kdTotal}
                </TableHead>

                <TableHead className="text-center w-52 bg-muted/60 transition">
                  {killTotal}
                </TableHead>
                <TableHead className="text-center w-52 bg-muted/60 transition ">
                  {deathTotal}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-card hover:bg-card font-medium">
                <TableCell className="border-r text-center">
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
                  return null;
                }
                const duel = duels.get(enemy.steamId);
                if (
                  !duel ||
                  (!duel.kills && !duel.deaths) ||
                  (duel.kills === 0 && duel.deaths === 0)
                ) {
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
                    <TableCell
                      className={`text-center bg-background border-r ${diffColor(duel.kills - duel.deaths)}`}
                    >
                      {duel.kills - duel.deaths}
                    </TableCell>
                    <TableCell
                      style={{
                        color: colorByMaxValue(
                          Number(
                            duel.deaths === 0
                              ? duel.kills
                              : (duel.kills / duel.deaths).toFixed(2),
                          ),
                          1.7,
                        ),
                      }}
                      className="text-center bg-background border-r"
                    >
                      {duel.deaths === 0
                        ? duel.kills.toFixed(2)
                        : (duel.kills / duel.deaths).toFixed(2)}
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
    </div>
  );
};
