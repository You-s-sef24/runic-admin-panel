import Header from "@/components/layout/Header";
import { OrdersTable } from "@/components/OrdersTable";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function Orders() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  return (
    <div>
      <Header title={t("sidebar.orders")} />
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder={t("orders.searchPlaceholder", "Search orders...")}
              type="search"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md "
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40 h-10">
                <SelectValue
                  placeholder={t("orders.allStatus", "All Status")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("orders.allStatus", "All Status")}
                </SelectItem>
                <SelectItem value="pending">{t("orders.pending")}</SelectItem>
                <SelectItem value="delivered">
                  {t("orders.delivered")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <OrdersTable
          search={search}
          status={status === "all" ? "" : status}
          page={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
