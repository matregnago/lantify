"use client";
import { PlayerProfileDTO } from "@repo/contracts";
import { PlayerHeader } from "./PlayerHeader";
import { StatsCard } from "./StatsCard";
import { ProgressStatus } from "./ProgressStatus";
import { CircularChart } from "./CircularChart";
import { Card } from "../ui/card";

export const PlayerProfile = ({ profile }: { profile: PlayerProfileDTO }) => {
  return (
    <div className="max-w-[1480px] mx-auto">
      <PlayerHeader
        avatarUrl={profile.avatarUrl || ""}
        nickName={profile.nickName || ""}
      />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">Estatísticas Gerais</h1>
          <StatsCard>
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
                  formattedValue={profile.headshotPercent.toFixed(0) + "%"}
                  max={70}
                />
                <ProgressStatus
                  statusName="ADR"
                  value={profile.averageDamagePerRound}
                  formattedValue={profile.averageDamagePerRound.toFixed(2)}
                  max={120}
                />
                <ProgressStatus
                  statusName="Kills por partida"
                  value={profile.killsPerMatch}
                  formattedValue={profile.killsPerMatch.toFixed(0)}
                  max={25}
                />
                <ProgressStatus
                  statusName="Kills por round"
                  value={profile.killsPerRound}
                  formattedValue={profile.killsPerRound.toFixed(2)}
                  max={1}
                />
              </div>
              <div className="flex flex-row items-center justify-evenly w-[50%]">
                <Card>
                  <CircularChart
                    color="#4dc49e"
                    value={profile.winRate}
                    label="Taxa de vitória"
                    max={100}
                    formattedValue={profile.winRate.toFixed(0) + "%"}
                  />
                </Card>
                <Card>
                  <CircularChart
                    color="#4dc49e"
                    value={profile.rating2}
                    formattedValue={profile.rating2.toFixed(2)}
                    label="Rating 2.0"
                    max={1.5}
                  />
                </Card>
              </div>
            </div>
          </StatsCard>
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">Estatísticas Detalhadas</h1>
          <StatsCard>
            <div className="flex flex-row gap-6">
              <div className="flex flex-col gap-6 w-[50%]">
                {/* continuar estatisticas detalhadas aqui */}
              </div>
              <div className="flex flex-row items-center justify-evenly w-[50%]">
                {/* continuar estatisticas detalhadas aqui */}
              </div>
            </div>
          </StatsCard>
        </div>
      </div>
    </div>
  );
};
