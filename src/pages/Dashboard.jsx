import AnalyticsCard from "@/components/AnalyticsCard";
import OrdersByStatusChart from "@/components/charts/OrdersByStatus";
import PriceDistributionChart from "@/components/charts/PriceDistributionChart";
import ProductsByCategoryChart from "@/components/charts/Productsbycategorychart ";
import RecentOrdersTable from "@/components/charts/ReecentOrdersTable";
import TopProductsChart from "@/components/charts/TopProductsChart";
import Header from "@/components/layout/Header";
import { useSummary } from "@/hooks/useStats";
import { Clock, Package, TrendingUp, UsersIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: summary } = useSummary();

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen">
      <Header title={t("sidebar.dashboard")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <AnalyticsCard
          title={t("dashboard.totalRevenue")}
          value={`${(summary?.totalRevenue ?? 0).toLocaleString()} L.E.`}
          icon={<TrendingUp />}
        />
        <AnalyticsCard
          title={t("dashboard.totalUsers")}
          value={summary?.totalUsers ?? 0}
          icon={<UsersIcon />}
        />
        <AnalyticsCard
          title={t("dashboard.totalProducts")}
          value={summary?.totalProducts ?? 0}
          icon={<Package />}
        />
        <AnalyticsCard
          title={t("dashboard.totalPendingOrders")}
          value={summary?.pendingOrders ?? 0}
          icon={<Clock />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <OrdersByStatusChart />
        <ProductsByCategoryChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <TopProductsChart />
        <PriceDistributionChart />
      </div>
      <div className="p-4">
        <RecentOrdersTable />
      </div>
    </div>
  );
}
