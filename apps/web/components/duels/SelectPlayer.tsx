"use client";
import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { PlayerDTO } from "@repo/contracts";

interface SelectPlayerProps {
    selectedMatchMonth: string;
    selectedPlayer: string | null;
    setSelectedPlayer: (player: string) => void;
    playersInMonth: PlayerDTO[];
}

export const SelectPlayer = ({ selectedPlayer, setSelectedPlayer, selectedMatchMonth, playersInMonth }: SelectPlayerProps) => {
    return (
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
    );
}