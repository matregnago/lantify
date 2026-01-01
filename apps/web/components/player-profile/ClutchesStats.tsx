import { PlayerProfileDTO } from "@repo/contracts";
import { ChartPie } from "./PieChart";
import { Field } from "./Field";
import { mapPlayerClutches } from "@/lib/clutch";

export const ClutchesStats = ({ profile }: { profile: PlayerProfileDTO }) => {
  const clutches = mapPlayerClutches(profile.clutches);

  const clutchCharts = [
    {
      title: "1v1",
      won: clutches.oneVsOneWonCount,
      lost: clutches.oneVsOneLostCount,
      total: clutches.oneVsOneCount,
    },
    {
      title: "1v2",
      won: clutches.oneVsTwoWonCount,
      lost: clutches.oneVsTwoLostCount,
      total: clutches.oneVsTwoCount,
    },
    {
      title: "1v3",
      won: clutches.oneVsThreeWonCount,
      lost: clutches.oneVsThreeLostCount,
      total: clutches.oneVsThreeCount,
    },
    {
      title: "1v4",
      won: clutches.oneVsFourWonCount,
      lost: clutches.oneVsFourLostCount,
      total: clutches.oneVsFourCount,
    },
    {
      title: "1v5",
      won: clutches.oneVsFiveWonCount,
      lost: clutches.oneVsFiveLostCount,
      total: clutches.oneVsFiveCount,
    },
  ];

  return (
    <Field title="Estatísticas de Clutches">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-8 px-8 lg:px-24 justify-items-center">
        {clutchCharts.map(
          (item) =>
            item.total > 0 && (
              <ChartPie
                key={item.title}
                title={item.title}
                subtitle={`W:${item.won} / L:${item.lost}`}
                formattedValue={`${((item.won / item.total) * 100 || 0).toFixed(2)}%`}
                chartData={[
                  {
                    label: "won",
                    value: item.won,
                    fill: "#4dc49e",
                  },
                  {
                    label: "lost",
                    value: item.lost,
                    fill: "#2e2f2f",
                  },
                ]}
              />
            ),
        )}
      </div>
    </Field>
  );
};
