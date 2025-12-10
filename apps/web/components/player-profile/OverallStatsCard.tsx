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
      <div className="flex flex-row gap-6">
        <div className="flex flex-col gap-6 w-[50%]">
          <ProgressStatus
            statusName="K/D"
            value={profile.killDeathRatio}
            formattedValue={profile.killDeathRatio.toFixed(2)}
            max={1.5}
          />
          <ProgressStatus
            statusName="Headshot %"
            value={profile.headshotPercent}
            formattedValue={profile.headshotPercent.toFixed(1) + "%"}
            max={70}
          />
          <ProgressStatus
            statusName="ADR"
            value={profile.averageDamagePerRound}
            formattedValue={profile.averageDamagePerRound.toFixed(1)}
            max={120}
          />
          <ProgressStatus
            statusName="Kills por partida"
            value={profile.killsPerMatch}
            formattedValue={profile.killsPerMatch.toFixed(0)}
            max={28}
          />
          <ProgressStatus
            statusName="Kills por round"
            value={profile.killsPerRound}
            formattedValue={profile.killsPerRound.toFixed(2)}
            max={1.1}
          />
          <ProgressStatus
            statusName="KAST"
            value={profile.kast}
            formattedValue={profile.kast.toFixed(1) + "%"}
            max={90}
          />
        </div>
        <div className="flex flex-row items-center justify-evenly w-[50%]">
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
              color={colorByMaxValue(profile.rating2, 1.5)}
              value={profile.rating2}
              formattedValue={profile.rating2.toFixed(2)}
              label="Rating 2.0"
              max={1.5}
            />
          </Card>
        </div>
      </div>
    </Field>
  );
};
