import { PlayerRankingDTO, PlayerStatsDTO } from "@repo/contracts";
import { cn } from "@/lib/utils";

interface PlayerTagProps {
  tag: PlayerTagType;
  className?: string;
}

export const PlayerTag = ({ tag, className }: PlayerTagProps) => {
  const getTagColors = (tagType: PlayerTagType): string => {
    switch (tagType) {
      case "Kyosuke":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "Lança Granadas":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      case "Matador":
        return "bg-red-600/20 text-red-300 border border-red-600/30";
      case "MVP":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "Bombardeiro":
        return "bg-yellow-600/20 text-yellow-300 border border-yellow-600/30";
      case "Desarmador":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "Entry Fragger":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "Consistente":
        return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
      case "Alta Taxa de HS":
        return "bg-red-400/20 text-red-300 border border-red-400/30";
      case "Bom de Granadas":
        return "bg-orange-400/20 text-orange-300 border border-orange-400/30";
      case "Assassino":
        return "bg-red-500/20 text-red-300 border border-red-500/30";
      case "Estrela":
        return "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30";
      case "Plantador":
        return "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30";
      case "Defensor":
        return "bg-green-400/20 text-green-300 border border-green-400/30";
      case "Agressor":
        return "bg-blue-400/20 text-blue-300 border border-blue-400/30";
      case "Estável":
        return "bg-slate-400/20 text-slate-200 border border-slate-400/30";
      case "Baixa Taxa de HS":
        return "bg-red-900/30 text-red-200 border border-red-900/40";
      case "Sem Granadas":
        return "bg-orange-900/30 text-orange-200 border border-orange-900/40";
      case "Alvo Fácil":
        return "bg-red-800/30 text-red-200 border border-red-800/40";
      case "Inconsistente":
        return "bg-slate-800/30 text-slate-200 border border-slate-800/40";
      case "First Death":
        return "bg-purple-900/30 text-purple-200 border border-purple-900/40";
      case "Baixo KD":
        return "bg-red-700/30 text-red-200 border border-red-700/40";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
        getTagColors(tag),
        className
      )}
    >
      {tag}
    </span>
  );
};

export type PlayerTagType =
  | "Kyosuke"
  | "Lança Granadas"
  | "Matador"
  | "MVP"
  | "Bombardeiro"
  | "Desarmador"
  | "Entry Fragger"
  | "Consistente"
  | "Alta Taxa de HS"
  | "Bom de Granadas"
  | "Assassino"
  | "Estrela"
  | "Plantador"
  | "Defensor"
  | "Agressor"
  | "Estável"
  | "Baixa Taxa de HS"
  | "Sem Granadas"
  | "Alvo Fácil"
  | "Inconsistente"
  | "First Death"
  | "Baixo KD";

function getPercentileThreshold(
  allPlayers: PlayerRankingDTO[],
  getValue: (p: PlayerRankingDTO) => number,
  percentile: number = 0.3
): number {
  const values = allPlayers
    .map(getValue)
    .filter((v) => v > 0)
    .sort((a, b) => b - a);
  if (values.length === 0) return 0;
  const index = Math.floor(values.length * percentile);
  const thresholdIndex = Math.max(0, Math.min(index - 1, values.length - 1));
  return values[thresholdIndex] ?? 0;
}

function isAboveThreshold(
  stats: PlayerStatsDTO,
  allPlayers: PlayerRankingDTO[],
  getValue: (p: PlayerRankingDTO) => number,
  percentile: number = 0.3
): boolean {
  const threshold = getPercentileThreshold(allPlayers, getValue, percentile);
  const playerValue = getValue({
    steamId: stats.steamId,
    stats,
    nickName: null,
    avatarUrl: null,
  });
  return playerValue >= threshold && playerValue > 0;
}

function isBelowThreshold(
  stats: PlayerStatsDTO,
  allPlayers: PlayerRankingDTO[],
  getValue: (p: PlayerRankingDTO) => number,
  percentile: number = 0.3,
  higherIsWorse: boolean = false
): boolean {
  const values = allPlayers
    .map(getValue)
    .filter((v) => v > 0)
    .sort((a, b) => (higherIsWorse ? b - a : a - b));
  if (values.length === 0) return false;
  const index = Math.floor(values.length * percentile);
  const thresholdIndex = Math.max(0, Math.min(index - 1, values.length - 1));
  const threshold = values[thresholdIndex] ?? 0;
  const playerValue = getValue({
    steamId: stats.steamId,
    stats,
    nickName: null,
    avatarUrl: null,
  });
  if (higherIsWorse) {
    return playerValue >= threshold && playerValue > 0;
  }
  return playerValue <= threshold && playerValue > 0;
}

export function getPlayerTags(
  stats: PlayerStatsDTO,
  allPlayers: PlayerRankingDTO[],
  maxTags: number = 3
): PlayerTagType[] {
  const tags: PlayerTagType[] = [];
  const headshotPercent = stats.headshotPercent;
  const utilityDamage = stats.utilityDamage;
  const totalKills = stats.totalKills;
  const totalMvps = stats.totalMvps;
  const totalBombPlants = stats.totalBombPlants;
  const totalBombDefuses = stats.totalBombDefuses;
  const totalFirstKills = stats.totalFirstKills;
  const totalFirstDeaths = stats.totalFirstDeaths;
  const totalDeaths = stats.totalDeaths;
  const killDeathRatio = stats.killDeathRatio;
  const kast = stats.kast;

  const maxHeadshotPercent = Math.max(
    ...allPlayers.map((p) => p.stats.headshotPercent)
  );
  const maxUtilityDamage = Math.max(
    ...allPlayers.map((p) => p.stats.utilityDamage)
  );
  const maxTotalKills = Math.max(...allPlayers.map((p) => p.stats.totalKills));
  const maxTotalMvps = Math.max(...allPlayers.map((p) => p.stats.totalMvps));
  const maxTotalBombPlants = Math.max(
    ...allPlayers.map((p) => p.stats.totalBombPlants)
  );
  const maxTotalBombDefuses = Math.max(
    ...allPlayers.map((p) => p.stats.totalBombDefuses)
  );
  const maxTotalFirstKills = Math.max(
    ...allPlayers.map((p) => p.stats.totalFirstKills)
  );
  const maxKast = Math.max(...allPlayers.map((p) => p.stats.kast));

  if (headshotPercent === maxHeadshotPercent && headshotPercent > 0) {
    tags.push("Kyosuke");
  } else if (
    isAboveThreshold(stats, allPlayers, (p) => p.stats.headshotPercent, 0.3)
  ) {
    tags.push("Alta Taxa de HS");
  } else if (
    isBelowThreshold(stats, allPlayers, (p) => p.stats.headshotPercent, 0.3) &&
    headshotPercent < 30
  ) {
    tags.push("Baixa Taxa de HS");
  }

  if (utilityDamage === maxUtilityDamage && utilityDamage > 0) {
    tags.push("Lança Granadas");
  } else if (
    isAboveThreshold(stats, allPlayers, (p) => p.stats.utilityDamage, 0.3)
  ) {
    tags.push("Bom de Granadas");
  } else if (
    isBelowThreshold(stats, allPlayers, (p) => p.stats.utilityDamage, 0.3) &&
    utilityDamage < 50
  ) {
    tags.push("Sem Granadas");
  }

  if (totalKills === maxTotalKills && totalKills > 0) {
    tags.push("Matador");
  } else if (
    isAboveThreshold(stats, allPlayers, (p) => p.stats.totalKills, 0.3)
  ) {
    tags.push("Assassino");
  }

  if (
    isBelowThreshold(stats, allPlayers, (p) => p.stats.totalDeaths, 0.3, true)
  ) {
    tags.push("Alvo Fácil");
  }

  if (totalMvps === maxTotalMvps && totalMvps > 0) {
    tags.push("MVP");
  } else if (
    isAboveThreshold(stats, allPlayers, (p) => p.stats.totalMvps, 0.3)
  ) {
    tags.push("Estrela");
  }

  if (totalBombPlants === maxTotalBombPlants && totalBombPlants > 0) {
    tags.push("Bombardeiro");
  } else if (
    isAboveThreshold(stats, allPlayers, (p) => p.stats.totalBombPlants, 0.3)
  ) {
    tags.push("Plantador");
  }

  if (totalBombDefuses === maxTotalBombDefuses && totalBombDefuses > 0) {
    tags.push("Desarmador");
  } else if (
    isAboveThreshold(stats, allPlayers, (p) => p.stats.totalBombDefuses, 0.3)
  ) {
    tags.push("Defensor");
  }

  if (totalFirstKills === maxTotalFirstKills && totalFirstKills > 0) {
    tags.push("Entry Fragger");
  } else if (
    isAboveThreshold(stats, allPlayers, (p) => p.stats.totalFirstKills, 0.3)
  ) {
    tags.push("Agressor");
  }

  if (
    isBelowThreshold(
      stats,
      allPlayers,
      (p) => p.stats.totalFirstDeaths,
      0.3,
      true
    )
  ) {
    tags.push("First Death");
  }

  if (kast === maxKast && kast > 0) {
    tags.push("Consistente");
  } else if (isAboveThreshold(stats, allPlayers, (p) => p.stats.kast, 0.3)) {
    tags.push("Estável");
  } else if (
    isBelowThreshold(stats, allPlayers, (p) => p.stats.kast, 0.3) &&
    kast < 50
  ) {
    tags.push("Inconsistente");
  }

  if (
    isBelowThreshold(
      stats,
      allPlayers,
      (p) => p.stats.killDeathRatio,
      0.3
    ) &&
    killDeathRatio < 0.8
  ) {
    tags.push("Baixo KD");
  }

  if (tags.length === 0) {
    const allStats = [
      {
        value: headshotPercent,
        positiveTag: "Alta Taxa de HS" as PlayerTagType,
        negativeTag: "Baixa Taxa de HS" as PlayerTagType,
        getValue: (p: PlayerRankingDTO) => p.stats.headshotPercent,
      },
      {
        value: utilityDamage,
        positiveTag: "Bom de Granadas" as PlayerTagType,
        negativeTag: "Sem Granadas" as PlayerTagType,
        getValue: (p: PlayerRankingDTO) => p.stats.utilityDamage,
      },
      {
        value: totalKills,
        positiveTag: "Assassino" as PlayerTagType,
        negativeTag: null,
        getValue: (p: PlayerRankingDTO) => p.stats.totalKills,
      },
      {
        value: totalMvps,
        positiveTag: "Estrela" as PlayerTagType,
        negativeTag: null,
        getValue: (p: PlayerRankingDTO) => p.stats.totalMvps,
      },
      {
        value: kast,
        positiveTag: "Estável" as PlayerTagType,
        negativeTag: "Inconsistente" as PlayerTagType,
        getValue: (p: PlayerRankingDTO) => p.stats.kast,
      },
      {
        value: killDeathRatio,
        positiveTag: null,
        negativeTag: "Baixo KD" as PlayerTagType,
        getValue: (p: PlayerRankingDTO) => p.stats.killDeathRatio,
      },
    ];

    const sortedStats = allStats
      .filter((s) => s.value > 0)
      .map((stat) => {
        const allValues = allPlayers.map(stat.getValue).filter((v) => v > 0);
        const sorted = [...allValues].sort((a, b) => b - a);
        const medianIndex = Math.floor(sorted.length / 2);
        const median = sorted[medianIndex] ?? 0;
        const isAboveMedian = stat.value >= median;
        return {
          ...stat,
          isAboveMedian,
          difference: Math.abs(stat.value - median),
        };
      })
      .sort((a, b) => b.difference - a.difference);

    for (const stat of sortedStats) {
      if (tags.length >= maxTags) break;

      if (stat.isAboveMedian && stat.positiveTag) {
        tags.push(stat.positiveTag);
      } else if (!stat.isAboveMedian && stat.negativeTag) {
        tags.push(stat.negativeTag);
      }
    }
  }

  if (tags.length === 0) {
    if (headshotPercent > 0) {
      tags.push(headshotPercent >= 40 ? "Alta Taxa de HS" : "Baixa Taxa de HS");
    } else if (killDeathRatio > 0) {
      tags.push(killDeathRatio >= 1.0 ? "Estável" : "Baixo KD");
    } else {
      tags.push("Estável");
    }
  }

  return tags.slice(0, maxTags);
}

