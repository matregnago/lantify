"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { MatchDTO, PlayerDTO } from "@repo/contracts";
import { useEffect, useMemo, useState } from "react";

interface SelectLanProps {
    matchMapByMonth: Map<string, MatchDTO[]>;
    selectedMatchMonth: string;
    setSelectedMatchMonth: (month: string) => void;
    setPlayersInMonth: (players: PlayerDTO[]) => void;
}

export const SelectLan = ({ matchMapByMonth, selectedMatchMonth, setSelectedMatchMonth, setPlayersInMonth }: SelectLanProps) => {

    useEffect(() => {
        const allMatches: MatchDTO[] =
            selectedMatchMonth === "all"
                ? Array.from(matchMapByMonth.values()).flat()
                : matchMapByMonth.get(selectedMatchMonth) ?? [];

        const playersMap = new Map<string, PlayerDTO>();

        allMatches.forEach((m) =>
            m.teams.forEach((t) =>
                t.players?.forEach((p) => {
                    if (p?.steamId && !playersMap.has(p.steamId))
                        playersMap.set(p.steamId, p as PlayerDTO);
                }),
            ),
        );

        setPlayersInMonth(Array.from(playersMap.values()));
    }, [matchMapByMonth, selectedMatchMonth]);

    const months = useMemo(() => {
        return Array.from(matchMapByMonth.keys()).sort((a, b) => {
            const da = new Date(a).getTime();
            const db = new Date(b).getTime();
            return db - da;
        });
    }, [matchMapByMonth]);

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                LAN
            </label>
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
};
