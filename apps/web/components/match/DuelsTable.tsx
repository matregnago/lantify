"use client";
import { DuelDTO, TeamDTO } from "@repo/contracts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface DuelsTableProps {
  duels: DuelDTO[];
  teamA: TeamDTO;
  teamB: TeamDTO;
}
export const DuelsTable = ({ duels, teamA, teamB }: DuelsTableProps) => {
  const router = useRouter();

  return (
    <div>
      <Table className="bg-card rounded border">
        <TableHeader>
          <TableRow className="hover:bg-card">
            <TableHead className="w-64 border-r">
              <div className="flex flex-col items-center justify-center gap-2.5">
                <p className="font-semibold text-lg">Duelos</p>
                <div className="flex flex-row justify-around w-full">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <div className="size-1.5 rounded-full bg-indigo-800"></div>
                    <p className="text-xs">{teamB.name}</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <div className="size-1.5 rounded-full bg-emerald-800"></div>
                    <p className="text-xs">{teamA.name}</p>
                  </div>
                </div>
              </div>
            </TableHead>

            {teamA.players?.map((player) => (
              <TableHead
                key={player.steamId}
                className="text-center w-max hover:bg-muted/50 transition"
              >
                <div
                  className="flex flex-col gap-1 items-center cursor-pointer p-2"
                  onClick={() => router.push(`/profile/${player.steamId}`)}
                >
                  <div className="size-1.5 mb-1 rounded-full bg-emerald-800"></div>
                  <Image
                    src={player.avatarUrl || "/default-avatar.png"}
                    width={32}
                    height={32}
                    alt={`${player.name} avatar`}
                    className="rounded-full border border-gray-800 shrink-0"
                  />
                  <p className="font-semibold">{player.name}</p>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {teamB.players?.map((player) => (
            <TableRow key={player.steamId} className="hover:bg-card">
              <TableCell className="border-r hover:bg-muted/50">
                <div
                  className="flex flex-row gap-3 items-center cursor-pointer w-fit"
                  onClick={() => router.push(`/profile/${player.steamId}`)}
                >
                  <div className="size-1.5 rounded-full bg-indigo-800"></div>
                  <Image
                    src={player.avatarUrl || "/default-avatar.png"}
                    width={32}
                    height={32}
                    alt={`${player.name} avatar`}
                    className="rounded-full border border-gray-800 shrink-0"
                  />
                  <p className="font-semibold">{player.name}</p>
                </div>
              </TableCell>

              {teamA.players?.map((enemy) => {
                const duel = duels.find(
                  (d) =>
                    d.playerA_steamId === player.steamId &&
                    d.playerB_steamId === enemy.steamId,
                );
                return (
                  <TableCell key={enemy.steamId} className="bg-background">
                    <div className="flex flex-row gap-2 justify-center items-center">
                      <p
                        className={`text-sm font-semibold py-1 px-4 rounded ${(duel?.kills as number) > (duel?.deaths as number) ? "bg-indigo-800" : "bg-accent"}`}
                      >
                        {duel ? `${duel.kills}` : "-"}
                      </p>
                      <p>x</p>
                      <p
                        className={`text-sm font-semibold py-1 px-4 rounded ${(duel?.deaths as number) > (duel?.kills as number) ? "bg-emerald-800" : "bg-accent"}`}
                      >
                        {duel ? `${duel.deaths}` : "-"}
                      </p>
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
