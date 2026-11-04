import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateShippingRate,
  useUpdateShippingRate,
} from "@/hooks/useShippingRates";

const schema = z.object({
  government: z.string().trim().min(1, "Government is required"),
  nameEn: z.string().trim().min(1, "English name is required"),
  nameAr: z.string().trim().min(1, "Arabic name is required"),
  price: z
    .number({ message: "Price is required" })
    .min(0, "Price must be 0 or more"),
});

const empty = {
  government: "",
  nameEn: "",
  nameAr: "",
  price: "",
  isActive: true,
};

export default function ShippingRateDialog({ open, onOpenChange, rate }) {
  const { t } = useTranslation();
  const isEdit = Boolean(rate);
  const [form, setForm] = useState(empty);
  const { mutate: createRate, isPending: isCreating } = useCreateShippingRate();
  const { mutate: updateRate, isPending: isUpdating } = useUpdateShippingRate();
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;
    setForm(
      rate
        ? {
            government: rate.government ?? "",
            nameEn: rate.name?.en ?? "",
            nameAr: rate.name?.ar ?? "",
            price: String(rate.price ?? ""),
            isActive: rate.isActive ?? true,
          }
        : empty,
    );
  }, [open, rate]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = schema.safeParse({
      ...form,
      price: form.price.trim() === "" ? undefined : Number(form.price),
    });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message || t("login.checkInput"));
      return;
    }

    const { government, nameEn, nameAr, price } = result.data;
    const payload = {
      government,
      name: { en: nameEn, ar: nameAr },
      price,
      isActive: form.isActive,
    };

    const options = { onSuccess: () => onOpenChange(false) };

    if (isEdit) updateRate({ id: rate._id, ...payload }, options);
    else createRate(payload, options);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("shippingRates.editRate") : t("shippingRates.addRate")}
          </DialogTitle>
          <DialogDescription>{t("shippingRates.dialogHint")}</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="government">{t("shippingRates.government")}</Label>
            <Input
              id="government"
              value={form.government}
              onChange={(e) => set("government", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name-en">{t("shippingRates.nameEn")}</Label>
              <Input
                id="name-en"
                dir="ltr"
                value={form.nameEn}
                onChange={(e) => set("nameEn", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name-ar">{t("shippingRates.nameAr")}</Label>
              <Input
                id="name-ar"
                dir="rtl"
                value={form.nameAr}
                onChange={(e) => set("nameAr", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">{t("shippingRates.price")}</Label>
            <div className="relative" dir="ltr">
              <Input
                id="price"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 pointer-events-none">
                L.E.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="is-active">{t("shippingRates.active")}</Label>
            <Switch
              id="is-active"
              checked={form.isActive}
              onCheckedChange={(v) => set("isActive", v)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("shippingRates.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {isPending ? "Saving..." : t("settings.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
