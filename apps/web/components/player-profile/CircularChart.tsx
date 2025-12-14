"use client";
import { useEffect, useState } from "react";
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

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export const CircularChart = ({
  value,
  label,
  color,
  max,
  formattedValue,
}: CircularChartProps) => {
  const isMobile = useIsMobile();

  const chartConfig = {
    data: {
      label,
      color,
    },
  } satisfies ChartConfig;

  const chartData = [{ label, data: value, fill: color, formattedValue }];

  const innerRadius = isMobile ? 50 : 80;
  const outerRadius = isMobile ? 70 : 110;
  const polarRadius: [number, number] = isMobile ? [56, 44] : [86, 74];

  return (
    <div className="mx-auto w-36 sm:w-[250px] h-32 sm:h-[230px] flex flex-col items-center justify-center">
      <h1 className="text-sm sm:text-lg font-semibold">{label}</h1>
      <ChartContainer config={chartConfig} className="w-full h-full">
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={360 * (value / max)}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className={`first:fill-border last:fill-card`}
            polarRadius={polarRadius}
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
                        className="fill-foreground text-2xl sm:text-4xl font-bold"
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
