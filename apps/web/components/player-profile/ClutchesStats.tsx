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
              value: profile.oneVsOneWonCount,
              fill: "#4dc49e",
            },
            {
              label: "lost",
              value: profile.oneVsOneLostCount,
              fill: "#2e2f2f",
            },
          ]}
          formattedValue={`${((profile.oneVsOneWonCount / profile.oneVsOneCount) * 100 || 0).toFixed(2)}%`}
          title="1v1"
          subtitle={`W:${profile.oneVsOneWonCount} / L:${profile.oneVsOneLostCount}`}
        />
        <ChartPie
          chartData={[
            {
              label: "won",
              value: profile.oneVsTwoWonCount,
              fill: "#4dc49e",
            },
            {
              label: "lost",
              value: profile.oneVsTwoLostCount,
              fill: "#2e2f2f",
            },
          ]}
          formattedValue={`${((profile.oneVsTwoWonCount / profile.oneVsTwoCount) * 100 || 0).toFixed(2)}%`}
          title="1v2"
          subtitle={`W:${profile.oneVsTwoWonCount} / L:${profile.oneVsTwoLostCount}`}
        />
        <ChartPie
          chartData={[
            {
              label: "won",
              value: profile.oneVsThreeWonCount,
              fill: "#4dc49e",
            },
            {
              label: "lost",
              value: profile.oneVsThreeLostCount,
              fill: "#2e2f2f",
            },
          ]}
          formattedValue={`${((profile.oneVsThreeWonCount / profile.oneVsThreeCount) * 100 || 0).toFixed(2)}%`}
          title="1v3"
          subtitle={`W:${profile.oneVsThreeWonCount} / L:${profile.oneVsThreeLostCount}`}
        />
        <ChartPie
          chartData={[
            {
              label: "won",
              value: profile.oneVsFourWonCount,
              fill: "#4dc49e",
            },
            {
              label: "lost",
              value: profile.oneVsFourLostCount,
              fill: "#2e2f2f",
            },
          ]}
          formattedValue={`${((profile.oneVsFourWonCount / profile.oneVsFourCount) * 100 || 0).toFixed(2)}%`}
          title="1v4"
          subtitle={`W:${profile.oneVsFourWonCount} / L:${profile.oneVsFourLostCount}`}
        />
        <ChartPie
          chartData={[
            {
              label: "won",
              value: profile.oneVsFiveWonCount,
              fill: "#4dc49e",
            },
            {
              label: "lost",
              value: profile.oneVsFiveLostCount,
              fill: "#2e2f2f",
            },
          ]}
          formattedValue={`${((profile.oneVsFiveWonCount / profile.oneVsFiveCount) * 100 || 0).toFixed(2)}%`}
          title="1v5"
          subtitle={`W:${profile.oneVsFiveWonCount} / L:${profile.oneVsFiveLostCount}`}
        />
      </div>
    </Field>
  );
};
