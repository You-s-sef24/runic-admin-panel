import { useState } from "react";
import Header from "@/components/layout/Header";
import { ProductsTable } from "@/components/ProductsTable";
import { Button } from "@/components/ui/button";
import AddProductDialog from "@/components/AddProductDialog";
import { useTranslation } from "react-i18next";

export default function Products() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div>
      <Header title={t("sidebar.products")} />
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2">
            <input
              placeholder={t("products.searchPlaceholder")}
              type="search"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md p-2 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <AddProductDialog
            show={
              <Button className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-800 dark:hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50">
                + {t("products.addProduct")}
              </Button>
            }
          />
        </div>
        <ProductsTable
          search={search}
          page={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
