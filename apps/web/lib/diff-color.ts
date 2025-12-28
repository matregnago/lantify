export const diffColor = (diff: number) => {
  if (diff > 0) return "text-green-500";
  else if (diff == 0) return "text-primary";
  else return "text-red-500";
};
