"use client";

import { Pie, PieChart } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

type ChartData = {
  label: string;
  value: number;
  fill: string;
};

interface ChartPieProps {
  formattedValue: string;
  chartData: ChartData[];
  title: string;
  subtitle?: string;
}
export function ChartPie({
  chartData,
  formattedValue,
  title,
  subtitle,
}: ChartPieProps) {
  const chartConfig = {
    data: {
      label: "",
      color: "",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="w-[200px] h-[200px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <PieChart>
            <Pie data={chartData} dataKey="value" />
          </PieChart>
        </ChartContainer>
      </div>
      <p className="text-sm">{formattedValue}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
}
