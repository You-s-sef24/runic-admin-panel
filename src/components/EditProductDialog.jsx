import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "./ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { X } from "lucide-react";
import { useUpdateProduct } from "@/hooks/useProduct";
import { useGetCategories } from "@/hooks/useCategories";

const MAX_IMAGES = 5;
const SERVER_URL = import.meta.env.VITE_BASE_URL; // no /api at the end

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
  price: z.coerce.number().min(0, "Price must be a positive number"),
  dimensions: z.string().trim().min(1, "Dimensions are required"),
  categoryId: z.string().min(1, "Category is required"),
  images: z
    .array(z.union([z.string(), z.instanceof(File)]))
    .min(1, "Please upload at least one image")
    .max(MAX_IMAGES, `You can upload up to ${MAX_IMAGES} images`),
  featured: z.boolean().optional(),
});

function toFormState(product) {
  return {
    name: { en: product?.name?.en ?? "", ar: product?.name?.ar ?? "" },
    description: {
      en: product?.description?.en ?? "",
      ar: product?.description?.ar ?? "",
    },
    price: product?.price ?? "",
    dimensions: product?.dimensions ?? "",
    categoryId: product?.categoryId?._id ?? "",
    images: product?.images ?? [],
    featured: product?.featured ?? false,
  };
}

export default function EditProductDialog({ show, product }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(() => toFormState(product));
  const { mutate: updateProduct, isPending } = useUpdateProduct();
  const { data } = useGetCategories();
  const categories = data?.categories ?? [];

  useEffect(() => {
    if (product) setFormData(toFormState(product));
  }, [product, open]);

  const selectedCategory = categories.find(
    (c) => c._id === formData.categoryId,
  );

  const previews = useMemo(
    () =>
      formData.images.map((img) =>
        img instanceof File
          ? URL.createObjectURL(img)
          : `${SERVER_URL}/uploads/${img}`,
      ),
    [formData.images],
  );

  useEffect(() => {
    return () => {
      previews.forEach((src) => {
        if (src.startsWith("blob:")) URL.revokeObjectURL(src);
      });
    };
  }, [previews]);

  function handleImageChange(e) {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;

    const remainingSlots = MAX_IMAGES - formData.images.length;
    if (selected.length > remainingSlots) {
      toast.error(
        t(
          "products.maxImagesError",
          `You can upload up to ${MAX_IMAGES} images`,
        ),
      );
    }

    const accepted = selected.slice(0, remainingSlots);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...accepted] }));
    e.target.value = "";
  }

  function removeImage(index) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!product) {
      toast.error(t("products.missingProductError"));
      return;
    }
    const validationResult = formSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message;
      toast.error(firstError || "Please check your input");
      return;
    }

    updateProduct(
      {
        id: product._id,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        dimensions: formData.dimensions,
        categoryId: formData.categoryId,
        images: formData.images,
        featured: formData.featured,
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
          <DialogTitle>{t("products.editProductTitle")}</DialogTitle>
          <DialogDescription>
            {t("products.editProductDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name-en">{t("products.name")}</Label>
              <Input
                id="name-en"
                name="name-en"
                placeholder={t("products.englishNamePlaceholder")}
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
              <Label htmlFor="name-ar">{t("products.arabicName")}</Label>
              <Input
                id="name-ar"
                name="name-ar"
                placeholder={t("products.arabicNamePlaceholder")}
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
              <Label htmlFor="description-en">{t("products.desc")}</Label>
              <Textarea
                id="description-en"
                name="description-en"
                className="resize-none h-25"
                placeholder={t("products.englishDescPlaceholder")}
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
              <Label htmlFor="description-ar">{t("products.descArabic")}</Label>
              <Textarea
                id="description-ar"
                name="description-ar"
                className="resize-none h-25"
                placeholder={t("products.arabicDescPlaceholder")}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">{t("products.priceLabel")}</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="145"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="dimensions">
                {t("products.dimensionsLabel")}
              </Label>
              <Input
                id="dimensions"
                name="dimensions"
                placeholder={t("products.dimensionsPlaceholder")}
                value={formData.dimensions || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dimensions: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="images">
                {t("products.image")} ({formData.images.length}/{MAX_IMAGES})
              </Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                disabled={formData.images.length >= MAX_IMAGES || isPending}
                onChange={handleImageChange}
              />
              {previews.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-1">
                  {previews.map((src, index) => (
                    <div
                      key={src}
                      className="relative w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-zinc-800"
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category">{t("products.category")}</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger className="w-[200px] border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100">
                  <SelectValue
                    placeholder={t(
                      "products.categoryPlaceholder",
                      "Select category",
                    )}
                  >
                    {selectedCategory &&
                      (lang === "en"
                        ? selectedCategory.name.en
                        : selectedCategory.name.ar || selectedCategory.name.en)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100">
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {lang === "en" ? cat.name.en : cat.name.ar || cat.name.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, featured: checked === true })
              }
            />
            <Label htmlFor="featured" className="cursor-pointer">
              {t("products.featured", "Featured product")}
            </Label>
          </div>

          <DialogFooter>
            <DialogClose
              render={<Button variant="outline">{t("products.cancel")}</Button>}
              disabled={isPending}
            />
            <Button
              className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-800 dark:hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50"
              type="submit"
              disabled={isPending}
            >
              {isPending ? t("products.saving") : t("products.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
