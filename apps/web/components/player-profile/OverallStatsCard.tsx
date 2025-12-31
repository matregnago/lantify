import { PlayerProfileDTO } from "@repo/contracts";
import { ProgressStatus } from "./ProgressStatus";
import { Card } from "../ui/card";
import { CircularChart } from "./CircularChart";
import { Field } from "./Field";
import { colorByMaxValue } from "@/lib/color-by-max-value";

export const OverallStatsCard = ({
  profile,
}: {
  profile: PlayerProfileDTO;
}) => {
  return (
    <Field title="Estatísticas Gerais">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-6 w-full lg:w-[50%]">
          <ProgressStatus
            statusName="K/D"
            value={profile.stats.killDeathRatio}
            formattedValue={profile.stats.killDeathRatio.toFixed(2)}
            max={1.5}
          />
          <ProgressStatus
            statusName="Headshot %"
            value={profile.stats.headshotPercent}
            formattedValue={profile.stats.headshotPercent.toFixed(1) + "%"}
            max={70}
          />
          <ProgressStatus
            statusName="ADR"
            value={profile.stats.averageDamagePerRound}
            formattedValue={profile.stats.averageDamagePerRound.toFixed(1)}
            max={120}
          />
          <ProgressStatus
            statusName="Kills por partida"
            value={profile.stats.killsPerMatch}
            formattedValue={profile.stats.killsPerMatch.toFixed(0)}
            max={28}
          />
          <ProgressStatus
            statusName="Kills por round"
            value={profile.stats.killsPerRound}
            formattedValue={profile.stats.killsPerRound.toFixed(2)}
            max={1.1}
          />
          <ProgressStatus
            statusName="KAST"
            value={profile.stats.kast}
            formattedValue={profile.stats.kast.toFixed(1) + "%"}
            max={90}
          />
        </div>
        <div className="flex flex-row items-center gap-4 justify-evenly w-full lg:w-[50%]">
          <Card>
            <CircularChart
              color={colorByMaxValue(profile.winRate, 100)}
              value={profile.winRate}
              label="Taxa de vitória"
              max={100}
              formattedValue={profile.winRate.toFixed(0) + "%"}
            />
          </Card>
          <Card>
            <CircularChart
              color={colorByMaxValue(profile.stats.rating2, 1.5)}
              value={profile.stats.rating2}
              formattedValue={profile.stats.rating2.toFixed(2)}
              label="Rating 2.0"
              max={1.5}
            />
          </Card>
        </div>
      </div>
    </Field>
  );
};
