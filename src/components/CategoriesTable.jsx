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
import { useLanguageStore } from "@/store/langStore";
import { useGetCategories } from "@/hooks/useCategories";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import Pagination from "./Pagination";

const LIMIT = 10;

export function CategoriesTable({ search = "", page = 1, onPageChange }) {
  const language = useLanguageStore((s) => s.language);
  const { t } = useTranslation();
  const { data, isLoading, isError, isPlaceholderData } = useGetCategories({
    page,
    limit: LIMIT,
  });
  const categories = data?.categories ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading categories...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load categories</p>;

  const filteredCategories = categories.filter((category) => {
    const query = search.toLowerCase();
    return (
      (category.name?.en || "").toLowerCase().includes(query) ||
      (category.name?.ar || "").toLowerCase().includes(query)
    );
  });

  const headClass =
    "h-11 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400";

  return (
    <>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        {filteredCategories.length} {t("categories.categoryFound")}
      </p>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-zinc-800/50 dark:hover:bg-zinc-800/50">
              <TableHead className={`w-24 text-start ${headClass}`}>
                {t("categories.image")}
              </TableHead>
              <TableHead className={`text-start ${headClass}`}>
                {t("categories.category")}
              </TableHead>
              <TableHead className={`text-end ${headClass}`}>
                {t("categories.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-10 text-center text-sm text-gray-500"
                >
                  {t("categories.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => {
                const isEn = language === "en";
                const displayName = isEn
                  ? category.name.en
                  : category.name.ar || category.name.en;
                const otherName = isEn ? category.name.ar : category.name.en;
                const description = isEn
                  ? category.description?.en
                  : category.description?.ar || category.description?.en;

                return (
                  <TableRow
                    key={category._id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                  >
                    <TableCell className="py-3 text-start align-middle">
                      {category.image ? (
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}/uploads/${category.image}`}
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
                        {description && (
                          <span className="hidden max-w-md text-xs text-gray-400 line-clamp-1 md:block dark:text-gray-500">
                            {description}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-3 text-end align-middle">
                      <div className="flex justify-end gap-1">
                        <EditCategoryDialog
                          category={category}
                          show={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                              <PencilIcon className="size-4" />
                              <span className="sr-only">
                                {t("categories.edit")}
                              </span>
                            </Button>
                          }
                        />
                        <DeleteCategoryDialog category={category} />
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
