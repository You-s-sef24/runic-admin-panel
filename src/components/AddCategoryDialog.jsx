"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useState } from "react";
import z from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Textarea } from "./ui/textarea";
import { X } from "lucide-react";
import { useAddCategory } from "@/hooks/useCategories";

// const CATEGORY_OPTIONS = [
//   { id: "accessories", en: "3D Accessories", ar: "إكسسوارات ثلاثية الأبعاد" },
//   {
//     id: "acrylic",
//     en: "Acrylic Signs & Designs",
//     ar: "لافتات وتصاميم من الأكريليك",
//   },
//   {
//     id: "pegboard",
//     en: "Pegboards & Accessories",
//     ar: "لوحات تعليق ومستلزماتها",
//   },
//   { id: "frames", en: "Frames & Displays", ar: "إطارات ومعروضات" },
//   { id: "decorations", en: "Decorations", ar: "ديكورات وتزيين" },
// ];

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
    .file("Please upload an image")
    .max(5 * 1024 * 1024, "Image must be smaller than 5 MB"),
});

export default function AddCategoryDialog({ show }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: {
      en: "",
      ar: "",
    },
    description: {
      ar: "",
      en: "",
    },
    image: null,
  });
  const { mutate: createCategory, isPending } = useAddCategory(formData);

  function handleSubmit(e) {
    e.preventDefault();
    const parsedData = formSchema.safeParse(formData);
    if (!parsedData.success) {
      const firstError = parsedData.error.issues[0]?.message;
      toast.error(firstError || "Please check your input");
      return;
    }

    createCategory(
      {
        name: formData.name,
        description: formData.description,
        image: formData.image,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData({
            name: {
              en: "",
              ar: "",
            },
            description: {
              en: "",
              ar: "",
            },
            image: null,
          });
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={show} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("categories.addCategoryTitle")}</DialogTitle>
          <DialogDescription>
            {t("categories.addCategoryDescription")}
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
                value={formData.name.en || ""}
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
                value={formData.name.ar || ""}
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
                value={formData.description.en || ""}
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
                value={formData.description.ar || ""}
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

                setFormData((prev) => ({
                  ...prev,
                  image,
                }));

                e.target.value = "";
              }}
            />
            {formData.image && (
              <div className="flex gap-2 flex-wrap mt-1">
                <div className="relative w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-zinc-800">
                  <img
                    src={URL.createObjectURL(formData.image)}
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
              disabled={isPending}
              render={
                <Button variant="outline">{t("categories.cancel")}</Button>
              }
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
