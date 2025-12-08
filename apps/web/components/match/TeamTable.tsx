import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TeamDTO } from "@repo/contracts";

export const TeamTable = ({ team }: { team: TeamDTO }) => {
  if (!team.players) return <></>;
  const players = team.players;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>K</TableHead>
          <TableHead>D</TableHead>
          <TableHead>A</TableHead>
          <TableHead>ADR</TableHead>
          <TableHead>K/D</TableHead>
          <TableHead>K/R</TableHead>
          <TableHead>HS %</TableHead>
          <TableHead>5k</TableHead>
          <TableHead>4k</TableHead>
          <TableHead>3k</TableHead>
          <TableHead>2k</TableHead>
          <TableHead>MVPs</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.killCount}</TableCell>
            <TableCell>{player.deathCount}</TableCell>
            <TableCell>{player.assistCount}</TableCell>
            <TableCell>{player.averageDamagePerRound.toFixed(1)}</TableCell>
            <TableCell>{player.killDeathRatio.toFixed(2)}</TableCell>
            <TableCell>{player.averageKillPerRound.toFixed(2)}</TableCell>
            <TableCell>{player.headshotPercent} %</TableCell>
            <TableCell>{player.fiveKillCount}</TableCell>
            <TableCell>{player.fourKillCount}</TableCell>
            <TableCell>{player.threeKillCount}</TableCell>
            <TableCell>{player.twoKillCount}</TableCell>
            <TableCell>{player.mvpCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
