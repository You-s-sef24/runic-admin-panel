import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslation } from "react-i18next";
import { usePriceDistribution } from "@/hooks/useStats";

const chartConfig = {
  count: { label: "Products", color: "#2563eb" },
};

export default function PriceDistributionChart() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = usePriceDistribution();

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading chart...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load product data</p>;

  const chartData = (data ?? []).map((d) => ({
    range: `${d.range} L.E.`,
    count: d.count,
  }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
      <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {t("dashboard.priceDistribution")}
      </h3>
      <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="range" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
