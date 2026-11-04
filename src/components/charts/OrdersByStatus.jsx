import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useTranslation } from "react-i18next";
import { useOrdersByStatus } from "@/hooks/useStats";

const STATUS_COLORS = {
  pending: "#f59e0b",
  delivered: "#22c55e",
};

export default function OrdersByStatusChart() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useOrdersByStatus();
  const chartData = (data ?? []).map((d) => ({
    ...d,
    fill: STATUS_COLORS[d.status] || "#94a3b8",
  }));

  const chartConfig = {
    pending: {
      label: t("dashboard.orderStatus.pending"),
      color: STATUS_COLORS.pending,
    },
    delivered: {
      label: t("dashboard.orderStatus.delivered"),
      color: STATUS_COLORS.delivered,
    },
  };

  if (isLoading)
    return (
      <p className="text-sm text-gray-500">{t("dashboard.loadingChart")}</p>
    );
  if (isError)
    return <p className="text-sm text-red-500">{t("dashboard.chartError")}</p>;

  if (chartData.length === 0)
    return (
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6"
        dir="ltr"
      >
        <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
          {t("dashboard.ordersByStatus")}
        </h3>
        <p className="text-sm text-gray-500">{t("orders.noResults")}</p>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6" dir="ltr">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
        {t("dashboard.ordersByStatus")}
      </h3>
      <ChartContainer
        config={chartConfig}
        className="w-full h-[280px] aspect-auto mx-auto"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.status} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="status" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
