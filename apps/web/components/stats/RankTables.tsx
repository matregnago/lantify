"use client";

import { MatchDTO, PlayerDTO } from "@repo/contracts";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";
import { SelectLan } from "../duels/SelectLan";
import { getKdList } from "@/lib/api/statistics";

interface RankTablesProps {
    matchMapByMonth: Map<string, MatchDTO[]>;
}

export const RankTables = ({ matchMapByMonth }: RankTablesProps) => {
    const router = useRouter();
    const [selectedMatchMonth, setSelectedMatchMonth] = useState<string>("all");
    const [playersInMonth, setPlayersInMonth] = useState<PlayerDTO[]>([]);
    const [kdList, setKdList] = useState<any[]>([]);


    useEffect(() => {
        (async () => {
            console.log(selectedMatchMonth)
            const res = await getKdList(selectedMatchMonth);
            console.log(res);
            setKdList(res);
        })();
    }, [selectedMatchMonth]);


    return (
        <SelectLan
            matchMapByMonth={matchMapByMonth}
            selectedMatchMonth={selectedMatchMonth}
            setSelectedMatchMonth={setSelectedMatchMonth}
            setPlayersInMonth={setPlayersInMonth}
        />
    );
}