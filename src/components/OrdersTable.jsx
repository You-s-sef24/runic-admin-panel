import { useNavigate } from "react-router-dom";
import { EyeIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetOrders } from "@/hooks/useOrders";
import { Badge } from "./ui/badge";
import { formatDate } from "@/lib/formatDate";
import Pagination from "./Pagination";

const statusStyles = {
  delivered:
    "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  pending: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
};

function getCustomerName(order) {
  return order.customerName || order.userId?.name || "";
}

function getItemsCount(order) {
  return Array.isArray(order.items) ? order.items.length : order.items;
}
const LIMIT = 10;

export function OrdersTable({
  search = "",
  status = "",
  page = 1,
  onPageChange,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError, isPlaceholderData } = useGetOrders({
    page,
    limit: LIMIT,
  });
  const orders = data?.orders ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading)
    return <p className="text-sm text-gray-500">{t("orders.loading")}</p>;
  if (isError)
    return <p className="text-sm text-red-500">{t("orders.loadError")}</p>;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = getCustomerName(order)
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = !status || order.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="border rounded-2xl p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">
                {t("orders.orderId")}
              </TableHead>
              <TableHead className="text-start">
                {t("orders.customer")}
              </TableHead>
              <TableHead className="text-start">{t("orders.date")}</TableHead>
              <TableHead className="text-start">{t("orders.items")}</TableHead>
              <TableHead className="text-start">{t("orders.total")}</TableHead>
              <TableHead className="text-start">{t("orders.status")}</TableHead>
              <TableHead className="text-end">{t("orders.view")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 py-6"
                >
                  {t("orders.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium text-indigo-600 dark:text-indigo-400 text-start">
                    ORD-{order._id}
                  </TableCell>
                  <TableCell className="font-medium text-start">
                    {getCustomerName(order)}
                  </TableCell>
                  <TableCell className="text-start">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-start">
                    {getItemsCount(order)}
                  </TableCell>
                  <TableCell className="text-start">
                    {order.total} L.E.
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
                  <TableCell className="text-end">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      <EyeIcon className="size-4" />
                      <span className="sr-only">{t("orders.view")}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        disabled={isPlaceholderData}
      />
    </>
  );
}
