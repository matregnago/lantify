import { PlayerProfileDTO } from "@repo/contracts";
import { ChartPie } from "./PieChart";
import { Field } from "./Field";

export const ClutchesStats = ({ profile }: { profile: PlayerProfileDTO }) => {
  return (
    <Field title="Estatísticas de Clutches">
      <div className="flex flex-row justify-between px-24">
        <ChartPie
          chartData={[
            {
              label: "won",
              value: profile.stats.oneVsOneWonCount,
              fill: "#4dc49e",
            },
            {
              label: "lost",
              value: profile.stats.oneVsOneLostCount,
              fill: "#2e2f2f",
            },
          ]}
          formattedValue={`${((profile.stats.oneVsOneWonCount / profile.stats.oneVsOneCount) * 100 || 0).toFixed(2)}%`}
          title="1v1"
          subtitle={`W:${profile.stats.oneVsOneWonCount} / L:${profile.stats.oneVsOneLostCount}`}
        />
        <ChartPie
          chartData={[
            {
              label: "won",
              value: profile.stats.oneVsTwoWonCount,
              fill: "#4dc49e",
            },
            {
              label: "lost",
              value: profile.stats.oneVsTwoLostCount,
              fill: "#2e2f2f",
            },
          ]}
          formattedValue={`${((profile.stats.oneVsTwoWonCount / profile.stats.oneVsTwoCount) * 100 || 0).toFixed(2)}%`}
          title="1v2"
          subtitle={`W:${profile.stats.oneVsTwoWonCount} / L:${profile.stats.oneVsTwoLostCount}`}
        />
        <ChartPie
          chartData={[
            {
              label: "won",
              value: profile.stats.oneVsThreeWonCount,
              fill: "#4dc49e",
            },
            {
              label: "lost",
              value: profile.stats.oneVsThreeLostCount,
              fill: "#2e2f2f",
            },
          ]}
          formattedValue={`${((profile.stats.oneVsThreeWonCount / profile.stats.oneVsThreeCount) * 100 || 0).toFixed(2)}%`}
          title="1v3"
          subtitle={`W:${profile.stats.oneVsThreeWonCount} / L:${profile.stats.oneVsThreeLostCount}`}
        />
        <ChartPie
          chartData={[
            {
              label: "won",
              value: profile.stats.oneVsFourWonCount,
              fill: "#4dc49e",
            },
            {
              label: "lost",
              value: profile.stats.oneVsFourLostCount,
              fill: "#2e2f2f",
            },
          ]}
          formattedValue={`${((profile.stats.oneVsFourWonCount / profile.stats.oneVsFourCount) * 100 || 0).toFixed(2)}%`}
          title="1v4"
          subtitle={`W:${profile.stats.oneVsFourWonCount} / L:${profile.stats.oneVsFourLostCount}`}
        />
        <ChartPie
          chartData={[
            {
              label: "won",
              value: profile.stats.oneVsFiveWonCount,
              fill: "#4dc49e",
            },
            {
              label: "lost",
              value: profile.stats.oneVsFiveLostCount,
              fill: "#2e2f2f",
            },
          ]}
          formattedValue={`${((profile.stats.oneVsFiveWonCount / profile.stats.oneVsFiveCount) * 100 || 0).toFixed(2)}%`}
          title="1v5"
          subtitle={`W:${profile.stats.oneVsFiveWonCount} / L:${profile.stats.oneVsFiveLostCount}`}
        />
      </div>
    </Field>
  );
};
