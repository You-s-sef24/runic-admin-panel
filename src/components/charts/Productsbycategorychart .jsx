"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/langStore";
import { useProductsByCategory } from "@/hooks/useStats";

const PALETTE = [
  "#4f46e5",
  "#f59e0b",
  "#22c55e",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
];

export default function ProductsByCategoryChart() {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const { data, isLoading, isError } = useProductsByCategory();

  const chartData = (data ?? []).map((d, i) => ({
    category: String(d.categoryId),
    label:
      (language === "en" ? d.name?.en : d.name?.ar) ||
      d.name?.en ||
      t("dashboard.unknownCategory", "Unknown"),
    count: d.count,
    fill: PALETTE[i % PALETTE.length],
  }));

  const chartConfig = Object.fromEntries(
    chartData.map((item) => [
      item.category,
      {
        label: item.label,
        color: item.fill,
      },
    ]),
  );

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
          {t("dashboard.productsByCategory")}
        </h3>
        <p className="text-sm text-gray-500">{t("products.noResults")}</p>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6" dir="ltr">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
        {t("dashboard.productsByCategory")}
      </h3>
      <ChartContainer
        config={chartConfig}
        className="w-full h-[280px] aspect-auto mx-auto"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="category"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.category} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="category" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
