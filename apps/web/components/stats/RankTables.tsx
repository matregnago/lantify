"use client";

import { MatchDTO, PlayerDTO } from "@repo/contracts";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface RankTablesProps {
    matchMapByMonth: Map<string, MatchDTO[]>;
}

export const RankTables = ({ matchMapByMonth }: RankTablesProps) => {
    const router = useRouter();
    const [selectedMatchMonth, setSelectedMatchMonth] = useState<string>("all");
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
    }, [matchMapByMonth, selectedMatchMonth]);

    const months = useMemo(() => {
        return Array.from(matchMapByMonth.keys()).sort((a, b) => {
            const da = new Date(a);
            const db = new Date(b);
            return db.getTime() - da.getTime();
        });
    }, [matchMapByMonth]);




    return (
        <div>
            <Select
                value={selectedMatchMonth}
                onValueChange={(v) => {
                    setSelectedMatchMonth(v);
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
    );
}