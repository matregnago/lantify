import { colorByMaxValue } from "@/lib/color-by-max-value";
import { Progress } from "../ui/progress";

interface ProgressStatusProps {
  value: number;
  formattedValue: string;
  max: number;
  statusName: string;
}

export const ProgressStatus = ({
  value,
  max,
  statusName,
  formattedValue,
}: ProgressStatusProps) => {
  const color = colorByMaxValue(value, max);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center justify-between">
        <p className="text">{statusName}</p>
        <p className="text">{formattedValue}</p>
      </div>
      <Progress
        indicatorColor={color}
        value={Math.min((value / max) * 100, 100)}
      />
    </div>
  );
};
