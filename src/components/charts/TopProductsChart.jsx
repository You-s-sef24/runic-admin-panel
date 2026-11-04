import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/langStore";
import { useTopProducts } from "@/hooks/useStats";

export default function TopProductsChart() {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const { data, isLoading, isError } = useTopProducts();

  const chartConfig = {
    quantity: { label: t("dashboard.unitsSold"), color: "#4f46e5" },
  };

  function getDisplayName(productName) {
    if (!productName) return "";
    if (typeof productName === "string") return productName;
    return (
      (language === "en" ? productName.en : productName.ar) ||
      productName.en ||
      ""
    );
  }

  const chartData = (data ?? []).map((d) => ({
    productName: getDisplayName(d.name),
    quantity: d.quantity,
  }));

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
          {t("dashboard.topProductsBySales")}
        </h3>
        <p className="text-sm text-gray-500">{t("orders.noResults")}</p>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6" dir="ltr">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
        {t("dashboard.topProductsBySales")}
      </h3>
      <ChartContainer
        config={chartConfig}
        className="w-full h-[280px] aspect-auto"
      >
        <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="productName"
            tickLine={false}
            axisLine={false}
            width={140}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="quantity"
            fill="#4f46e5"
            radius={[0, 4, 4, 0]}
            barSize={24}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
