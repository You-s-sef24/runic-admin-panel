import { TrashIcon } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguageStore } from "@/store/langStore";
import { useDeleteCategory } from "@/hooks/useCategories";

export function DeleteCategoryDialog({ category }) {
  const language = useLanguageStore((s) => s.language);
  const { t } = useTranslation();
  const { mutate: deleteCategory, isPending } = useDeleteCategory(category._id);
  const nameDisplayed = language === "en" ? category.name.en : category.name.ar;

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="size-8 text-red-600 hover:text-red-700"
          >
            <TrashIcon className="size-4" />
            <span className="sr-only">{t("categories.delete")}</span>
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Trans
              i18nKey="categories.deleteTitle"
              values={{ name: nameDisplayed }}
              components={{ bdi: <bdi /> }}
            />
          </AlertDialogTitle>
          <AlertDialogDescription
            className={language === "ar" ? `text-right` : ""}
          >
            {t("categories.deleteDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("categories.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-800 dark:hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50"
            onClick={() => deleteCategory(category.id)}
            disabled={isPending}
          >
            {isPending ? t("categories.deleting") : t("categories.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
