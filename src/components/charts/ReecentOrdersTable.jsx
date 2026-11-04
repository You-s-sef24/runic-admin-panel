import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { EyeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { calculateOrderTotal } from "@/lib/orderTotals";
import { useGetOrders } from "@/hooks/useOrders";

const statusStyles = {
  delivered:
    "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  pending: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
};

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("en-CA");
}

export default function RecentOrdersTable() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetOrders();
  const orders = data?.orders ?? [];
  const navigate = useNavigate();

  if (isLoading)
    return (
      <p className="text-sm text-gray-500">{t("dashboard.loadingOrders")}</p>
    );
  if (isError)
    return <p className="text-sm text-red-500">{t("dashboard.ordersError")}</p>;

  const recentOrders = [...(orders ?? [])]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 4);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
        {t("dashboard.recentOrders")}
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-start">
              {t("dashboard.orderId")}
            </TableHead>
            <TableHead className="text-start">
              {t("dashboard.customer")}
            </TableHead>
            <TableHead className="text-start">{t("dashboard.date")}</TableHead>
            <TableHead className="text-start">
              {t("dashboard.status")}
            </TableHead>
            <TableHead className="text-end">{t("dashboard.total")}</TableHead>
            <TableHead className="text-end">{t("dashboard.view")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length !== 0 ? (
            recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-indigo-600 dark:text-indigo-400 text-start">
                  ORD-{order.id}
                </TableCell>
                <TableCell className="text-start">
                  {order.customerName}
                </TableCell>
                <TableCell className="text-gray-500 dark:text-gray-400 text-start">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="text-start">
                  <Badge
                    className={
                      statusStyles[order.status] ||
                      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }
                  >
                    {t(`orders.${order.status}`)}
                  </Badge>
                </TableCell>
                <TableCell className="text-end font-medium">
                  {calculateOrderTotal(order)} L.E.
                </TableCell>
                <TableCell className="text-end">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <EyeIcon className="size-4" />
                    <span className="sr-only">{t("dashboard.view")}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <p className="text-center text-foreground py-2">
              {t("orders.noResults")}
            </p>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
