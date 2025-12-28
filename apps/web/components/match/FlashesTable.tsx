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
import { TeamDTO } from "@repo/contracts";
import { useRouter } from "next/navigation";

export const FlashesTable = ({ team }: { team: TeamDTO }) => {
  const router = useRouter();

  if (!team.players) return <></>;
  const players = team.players;
  return (
    <Table className="bg-card rounded-sm">
      <TableHeader>
        <TableRow>
          <TableHead className="w-64">Jogador</TableHead>
          <TableHead>Flashes</TableHead>
          <TableHead>Assist. de Flash</TableHead>
          <TableHead>Inimigos Cegados</TableHead>
          <TableHead>Tempo Ceg. Inimigos</TableHead>
          <TableHead>Auto-Flash</TableHead>
          <TableHead>Tempo Auto-Flash</TableHead>
          <TableHead>Aliados Cegados</TableHead>
          <TableHead>Tempo Ceg. Aliados</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell>
              <div
                className="flex flex-row gap-3 items-center cursor-pointer w-fit"
                onClick={() => router.push(`/profile/${player.steamId}`)}
              >
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
            <TableCell>{player.totalFlashes}</TableCell>
            <TableCell>{player.flashAssists}</TableCell>
            <TableCell>{player.enemiesFlashed}</TableCell>
            <TableCell>{player.enemiesBlindTime.toFixed(2)}s</TableCell>
            <TableCell>{player.selfFlashed}</TableCell>
            <TableCell>{player.selfBlindTime.toFixed(2)}s</TableCell>
            <TableCell>{player.friendsFlashed}</TableCell>
            <TableCell>{player.friendsBlindTime.toFixed(2)}s</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
