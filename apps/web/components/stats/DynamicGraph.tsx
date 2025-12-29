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