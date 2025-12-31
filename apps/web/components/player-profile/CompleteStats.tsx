import { PlayerProfileDTO } from "@repo/contracts";
import { Field } from "./Field";
import { StatsList } from "./StatsList";

export const CompleteStats = ({ profile }: { profile: PlayerProfileDTO }) => {
  const statisticsList1Data = [
    { name: "Kills totais", value: profile.stats.totalKills.toString() },
    { name: "Mortes totais", value: profile.stats.totalDeaths.toString() },
    { name: "Assists totais", value: profile.stats.totalAssists.toString() },
    {
      name: "Headshots totais",
      value: profile.stats.totalHeadshots.toString(),
    },
    { name: "Partidas jogadas", value: profile.stats.totalMatches.toString() },
    { name: "Rounds jogados", value: profile.totalRounds.toString() },
    { name: "MVPs", value: profile.stats.totalMvps.toString() },
  ];

  const statisticsList2Data = [
    {
      name: "Bombas plantadas",
      value: profile.stats.totalBombPlants.toString(),
    },
    {
      name: "Bombas desarmadas",
      value: profile.stats.totalBombDefuses.toString(),
    },
    { name: "Multi-kills", value: profile.stats.totalMultiKills.toString() },
    { name: "First kills", value: profile.stats.totalFirstKills.toString() },
    { name: "First deaths", value: profile.stats.totalFirstDeaths.toString() },
    {
      name: "Mortes por round",
      value: profile.stats.averageDeathPerRound.toFixed(2),
    },
    {
      name: "Dano com utilitários por partida",
      value: profile.stats.utilityDamage.toFixed(1),
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
