import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetOrder, useUpdateOrder } from "@/hooks/useOrders";
import Header from "@/components/layout/Header";
import { formatDate } from "@/lib/formatDate";
import { imageUrl } from "@/lib/imageUrl";
import { useLanguageStore } from "@/store/langStore";

export default function OrderDetails() {
  const language = useLanguageStore((s) => s.language);
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate: updateOrder, isPending } = useUpdateOrder();
  const { data, isLoading, isError } = useGetOrder(id);
  const order = data?.order;

  function handleStatusChange(newStatus) {
    updateOrder({ id: order._id, status: newStatus });
  }

  function getItemName(item) {
    if (!item?.name) return "";
    if (typeof item.name === "string") return item.name;
    return (
      (language === "en" ? item.name.en : item.name.ar) || item.name.en || ""
    );
  }

  const title = `${t("orderDetails.title")} ${order ? `ORD-${order._id}` : ""}`;

  if (isLoading || isError || !order) {
    return (
      <div>
        <Header title={title} />
        <p
          className={`p-4 text-sm ${isLoading ? "text-gray-500" : "text-red-500"}`}
        >
          {isLoading ? t("orderDetails.loading") : t("orderDetails.notFound")}
        </p>
      </div>
    );
  }

  const customerName = order.customerName || order.userId?.name;
  const customerEmail = order.customerEmail || order.userId?.email;

  return (
    <div>
      <Header title={title} />
      <div className="p-4 flex flex-col gap-4">
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeftIcon className="size-4 me-1" />
          {t("orderDetails.back")}
        </Button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("orderDetails.customer")}
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {customerName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("orderDetails.email")}
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {customerEmail}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("orderDetails.date")}
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {t("orderDetails.status")}
            </p>
            <Select
              value={order.status}
              onValueChange={handleStatusChange}
              disabled={isPending}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivered">
                  {t("orderDetails.delivered")}
                </SelectItem>
                <SelectItem value="pending">
                  {t("orderDetails.pending")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {order.nails > 0 && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("orderDetails.nails")}
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {order.nails} ({order.nailsCost} L.E.)
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("orderDetails.shipping")}
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {order.shippingCost} L.E.
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("orderDetails.shippingAddress")}
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {order.shippingAddress}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("orderDetails.items")}
          </h3>
          <div className="flex flex-col gap-3">
            {(order.items || []).map((item, idx) => {
              const thumbnail = item.image || item.images?.[0];

              return (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    {thumbnail ? (
                      <img
                        src={imageUrl(thumbnail)}
                        alt={getItemName(item)}
                        className="object-cover rounded-md size-12"
                      />
                    ) : (
                      <div className="size-12 rounded-md bg-gray-100 dark:bg-zinc-800" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {getItemName(item)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("orderDetails.qty")}: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {item.price * item.quantity} L.E.
                  </p>
                </div>
              );
            })}
            {order.nails > 0 && (
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {t("orderDetails.nails")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("orderDetails.qty")}: {order.nails}
                  </p>
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {order.nailsCost} L.E.
                </p>
              </div>
            )}
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2 last:border-b-0">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {t("orderDetails.shipping")}
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {order.shippingCost} L.E.
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 font-semibold text-gray-900 dark:text-gray-100">
            <p>{t("orderDetails.total")}</p>
            <p>{order.total} L.E.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
