"use client";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useRouter } from "next/navigation";

interface PlayerRanking {
  steamId: string | null;
  rating: string;
  avatarUrl: string | undefined;
  steamNickname: string | undefined;
  partidas: number;
  kd: number;
  adr: string | null;
}

export const PlayersRankingTable = ({
  players,
}: {
  players: PlayerRanking[];
}) => {
  const router = useRouter();

  return (
    <div>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-center">#</TableHead>
            <TableHead className="w-65">Player</TableHead>

            <TableHead className="w-22.5 text-center">Rating</TableHead>

            <TableHead className="w-17.5 text-center">KD</TableHead>

            <TableHead className="w-20 text-center">ADR</TableHead>

            <TableHead className="w-22.5 text-center">Partidas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player, idx) => (
            <TableRow
              key={player.steamId}
              className="cursor-pointer"
              onClick={() => router.push(`/profile/${player.steamId}`)}
            >
              <TableCell className="text-center tabular-nums">
                {idx + 1}
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-5 items-center w-fit py-2">
                  <Image
                    src={player.avatarUrl || "/default-avatar.png"}
                    width={40}
                    height={40}
                    alt={`${player.steamNickname} avatar`}
                    className="rounded-full border border-gray-800 shrink-0"
                  />
                  <p className="font-semibold">{player.steamNickname}</p>
                </div>
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {player.rating}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {player.kd}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {player.adr}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {player.partidas}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
