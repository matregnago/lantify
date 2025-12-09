"use client";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface CircularChartProps {
  value: number;
  label: string;
  color: string;
  max: number;
  formattedValue: string;
}

export const CircularChart = ({
  value,
  label,
  color,
  max,
  formattedValue,
}: CircularChartProps) => {
  const chartConfig = {
    data: {
      label,
      color,
    },
  } satisfies ChartConfig;

  const chartData = [{ label, data: value, fill: color, formattedValue }];

  return (
    <div className="mx-auto w-[250px] h-[230px] flex flex-col items-center justify-center">
      <h1 className="text-lg font-semibold">{label}</h1>
      <ChartContainer config={chartConfig} className="w-full h-full">
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={360 * (value / max)}
          innerRadius={80}
          outerRadius={110}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className={`first:fill-border last:fill-card`}
            polarRadius={[86, 74]}
          />
          <RadialBar dataKey="data" background cornerRadius={10} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-4xl font-bold"
                      >
                        {chartData[0]?.formattedValue}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
};
