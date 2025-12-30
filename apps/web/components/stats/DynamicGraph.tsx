"use client";

import { MatchDTO, PlayerDTO } from "@repo/contracts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SelectLan } from "../duels/SelectLan";

interface DynamicGraphProps {
    matchMapByMonth: Map<string, MatchDTO[]>;
}

export const DynamicGraph = ({ matchMapByMonth }: DynamicGraphProps) => {
    const router = useRouter();
    const [selectedMatchMonth, setSelectedMatchMonth] = useState<string>("all");
    const [playersInMonth, setPlayersInMonth] = useState<PlayerDTO[]>([]);


    return (
        <SelectLan
            matchMapByMonth={matchMapByMonth}
            selectedMatchMonth={selectedMatchMonth}
            setSelectedMatchMonth={setSelectedMatchMonth}
            setPlayersInMonth={setPlayersInMonth}
        />
    );
}