import { PlayerProfileDTO } from "@repo/contracts";
import { Field } from "./Field";
import { StatsList } from "./StatsList";

export const CompleteStats = ({ profile }: { profile: PlayerProfileDTO }) => {
  const statisticsList1Data = [
    { name: "Kills totais", value: profile.totalKills.toString() },
    { name: "Mortes totais", value: profile.totalDeaths.toString() },
    { name: "Assists totais", value: profile.totalAssists.toString() },
    { name: "Headshots totais", value: profile.totalHeadshots.toString() },
    { name: "Partidas jogadas", value: profile.totalMatches.toString() },
    { name: "Rounds jogados", value: profile.totalRounds.toString() },
    { name: "MVPs", value: profile.totalMvps.toString() },
  ];

  const statisticsList2Data = [
    { name: "Bombas plantadas", value: profile.totalBombPlants.toString() },
    { name: "Bombas desarmadas", value: profile.totalBombDefuses.toString() },
    { name: "Multi-kills", value: profile.totalMultiKills.toString() },
    { name: "First kills", value: profile.totalFirstKills.toString() },
    { name: "First deaths", value: profile.totalFirstDeaths.toString() },
    {
      name: "Mortes por round",
      value: profile.averageDeathPerRound.toFixed(2),
    },
    {
      name: "Dano com utilitários por partida",
      value: profile.utilityDamage.toFixed(1),
    },
  ];

  return (
    <Field title="Estatísticas Completas" useStatsCard={false}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-[50%]">
          <StatsList data={statisticsList1Data} />
        </div>
        <div className="w-full md:w-[50%]">
          <StatsList data={statisticsList2Data} />
        </div>
      </div>
    </Field>
  );
};
