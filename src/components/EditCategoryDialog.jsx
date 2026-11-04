import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import z from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useUpdateCategory } from "@/hooks/useCategories";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const SERVER_URL = import.meta.env.VITE_BASE_URL;

const formSchema = z.object({
  name: z.object({
    en: z.string().trim().min(2, "English name must be at least 2 characters"),
    ar: z.string().trim().min(2, "Arabic name must be at least 2 characters"),
  }),
  description: z.object({
    en: z
      .string()
      .trim()
      .min(10, "English description must be at least 10 characters"),
    ar: z
      .string()
      .trim()
      .min(10, "Arabic description must be at least 10 characters"),
  }),
  image: z
    .custom(
      (v) => (typeof v === "string" ? v.length > 0 : v instanceof File),
      "Please upload an image",
    )
    .refine(
      (v) => !(v instanceof File) || v.size <= MAX_IMAGE_SIZE,
      "Image must be smaller than 5 MB",
    ),
});

export default function EditCategoryDialog({ show, category }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(
    category || {
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      image: null,
    },
  );
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setFormData({ ...category, image: category.image || null });
    }
  }, [category, open]);

  const previewSrc = useMemo(() => {
    if (formData.image instanceof File) {
      return URL.createObjectURL(formData.image);
    }
    if (typeof formData.image === "string" && formData.image) {
      return `${SERVER_URL}/uploads/${formData.image}`;
    }
    return null;
  }, [formData.image]);

  useEffect(() => {
    return () => {
      if (previewSrc?.startsWith("blob:")) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!category) {
      toast.error(t("categories.missingCategoryError"));
      return;
    }
    const validationResult = formSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message;
      toast.error(firstError || "Please check your input");
      return;
    }

    updateCategory(
      {
        id: category._id,
        name: formData.name,
        description: formData.description,
        image: formData.image,
      },
      {
        onSuccess: () => setOpen(false),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={show} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("categories.editCategoryTitle")}</DialogTitle>
          <DialogDescription>
            {t("categories.editCategoryDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name-en">{t("categories.name")}</Label>
              <Input
                id="name-en"
                name="name-en"
                placeholder={t("categories.englishNamePlaceholder")}
                value={formData.name?.en || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: { ...formData.name, en: e.target.value },
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name-ar">{t("categories.arabicName")}</Label>
              <Input
                id="name-ar"
                name="name-ar"
                placeholder={t("categories.arabicNamePlaceholder")}
                value={formData.name?.ar || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: { ...formData.name, ar: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="description-en">{t("categories.desc")}</Label>
              <Textarea
                id="description-en"
                name="description-en"
                className="resize-none h-25"
                placeholder={t("categories.englishDescPlaceholder")}
                value={formData.description?.en || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: {
                      ...formData.description,
                      en: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description-ar">
                {t("categories.descArabic")}
              </Label>
              <Textarea
                id="description-ar"
                name="description-ar"
                className="resize-none h-25"
                placeholder={t("categories.arabicDescPlaceholder")}
                value={formData.description?.ar || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: {
                      ...formData.description,
                      ar: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="image">{t("categories.image")}</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              disabled={!!formData.image || isPending}
              onChange={(e) => {
                const image = e.target.files?.[0] ?? null;
                setFormData((prev) => ({ ...prev, image }));
                e.target.value = "";
              }}
            />
            {previewSrc && (
              <div className="flex gap-2 flex-wrap mt-1">
                <div className="relative w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-zinc-800">
                  <img
                    src={previewSrc}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: null })}
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline">{t("categories.cancel")}</Button>
              }
              disabled={isPending}
            />
            <Button
              className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-800 dark:hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50"
              type="submit"
              disabled={isPending}
            >
              {isPending ? t("categories.saving") : t("categories.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
