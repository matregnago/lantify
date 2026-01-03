import { ClutchDTO } from "@repo/contracts";
import { CircularChart } from "../../player-profile/CircularChart";
import { colorByMaxValue } from "@/lib/color-by-max-value";
import { labelByMaxValue } from "@/lib/label-by-max-value";
import { ClutchKillToolTip } from "./ClutchKillToolTip";

interface ClutchKillsChartProps {
    clutches: ClutchDTO[]
}

export const ClutchKillsChart = ({ clutches }: ClutchKillsChartProps) => {
    if (!clutches) {
        return;
    }
    const totalKills = clutches.reduce((total, clutch) => total + clutch.clutcherKillCount, 0);
    const totalOpponents = clutches.reduce((total, clutch) => total + clutch.opponentCount, 0);

    const killRate = Math.round(totalKills * 100.0 / totalOpponents);

    const max = 45 //arbitrário

    const label = labelByMaxValue(killRate, max);
    const color = colorByMaxValue(killRate, max);

    return (
        <div className="flex items-start gap-0">
            <div className="scale-70 origin-top-left shrink-0 -mt-8 pl-8">
                <CircularChart
                    color={color}
                    value={totalKills}
                    label=""
                    max={totalOpponents}
                    formattedValue={totalKills.toString()}
                />
            </div>

            <div className="-ml-20 -mt-2 flex flex-col items-start">
                <span className="text-xl">💀</span>
                <span className="text-lg font-bold whitespace-nowrap">
                    Kills Totais
                </span>
                <span className="text-sm"
                    style={{ color }}
                >
                    {label}
                </span>
                <span>
                    <ClutchKillToolTip
                        kills={totalKills}
                        total={totalOpponents}
                    />
                </span>
            </div>
        </div>
    );
}