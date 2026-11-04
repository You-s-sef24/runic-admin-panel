import { ImageIcon, PencilIcon } from "lucide-react";
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
import { DeleteProductDialog } from "@/components/DeleteProductDialog";
import EditProductDialog from "./EditProductDialog";
import { useLanguageStore } from "@/store/langStore";
import { useGetProducts } from "@/hooks/useProduct";
import Pagination from "./Pagination";

const LIMIT = 10;

export function ProductsTable({ search = "", page = 1, onPageChange }) {
  const language = useLanguageStore((s) => s.language);
  const { t } = useTranslation();
  const { data, isLoading, isError, isPlaceholderData } = useGetProducts({
    page,
    limit: LIMIT,
  });
  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading products...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load products</p>;

  const query = search.toLowerCase();
  const filteredProducts = products.filter(
    (product) =>
      (product.name?.en || "").toLowerCase().includes(query) ||
      (product.name?.ar || "").toLowerCase().includes(query) ||
      (product.categoryId?.name?.en || "").toLowerCase().includes(query) ||
      (product.categoryId?.name?.ar || "").toLowerCase().includes(query),
  );

  const headClass =
    "h-11 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400";

  return (
    <>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        {filteredProducts.length} {t("products.productFound")}
      </p>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-zinc-800/50 dark:hover:bg-zinc-800/50">
              <TableHead className={`w-24 text-start ${headClass}`}>
                {t("products.image")}
              </TableHead>
              <TableHead className={`text-start ${headClass}`}>
                {t("products.product")}
              </TableHead>
              <TableHead className={`text-start ${headClass}`}>
                {t("products.category")}
              </TableHead>
              <TableHead className={`text-start ${headClass}`}>
                {t("products.price")}
              </TableHead>
              <TableHead className={`text-start ${headClass}`}>
                {t("products.dimensions")}
              </TableHead>
              <TableHead className={`text-end ${headClass}`}>
                {t("products.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-gray-500"
                >
                  {t("products.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const isEn = language === "en";
                const displayName = isEn
                  ? product.name.en
                  : product.name.ar || product.name.en;
                const otherName = isEn ? product.name.ar : product.name.en;
                const category = product.categoryId;
                const displayCategory = category?.name
                  ? isEn
                    ? category.name.en
                    : category.name.ar || category.name.en
                  : null;
                const thumbnail = product.images?.[0];

                return (
                  <TableRow
                    key={product._id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                  >
                    <TableCell className="py-3 text-start align-middle">
                      {thumbnail ? (
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}/uploads/${thumbnail}`}
                          alt={displayName}
                          className="size-14 rounded-lg border border-gray-200 object-cover dark:border-zinc-800"
                        />
                      ) : (
                        <div className="flex size-14 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-400 dark:border-zinc-800 dark:bg-zinc-800">
                          <ImageIcon className="size-5" />
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="py-3 text-start align-middle">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {displayName}
                        </span>
                        {otherName && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {otherName}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-3 text-start align-middle">
                      {displayCategory ? (
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {displayCategory}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {t("categories.none", "None")}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="py-3 text-start align-middle font-medium text-gray-900 dark:text-gray-100">
                      {product.price} L.E.
                    </TableCell>

                    <TableCell className="py-3 text-start align-middle text-sm text-gray-600 dark:text-gray-300">
                      {product.dimensions} {t("products.in")}
                    </TableCell>

                    <TableCell className="py-3 text-end align-middle">
                      <div className="flex justify-end gap-1">
                        <EditProductDialog
                          product={product}
                          show={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                              <PencilIcon className="size-4" />
                              <span className="sr-only">
                                {t("products.edit")}
                              </span>
                            </Button>
                          }
                        />
                        <DeleteProductDialog product={product} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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
