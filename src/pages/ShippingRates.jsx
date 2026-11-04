import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Header from "@/components/layout/Header";
import ShippingRateDialog from "@/components/ShippingRateDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteShippingRate,
  useGetShippingRates,
  useUpdateShippingRate,
} from "@/hooks/useShippingRates";
import { useLanguageStore } from "@/store/langStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function ShippingRates() {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);

  const { data, isLoading, isError } = useGetShippingRates();
  const rates = data?.shippingRates ?? [];
  const { mutate: updateRate } = useUpdateShippingRate();
  const { mutate: deleteRate, isPending: isDeleting } = useDeleteShippingRate();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  function getName(rate) {
    return (
      (language === "en" ? rate.name?.en : rate.name?.ar) || rate.name?.en || ""
    );
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(rate) {
    setEditing(rate);
    setDialogOpen(true);
  }

  const q = search.trim().toLowerCase();
  const filtered = rates.filter(
    (rate) =>
      !q ||
      (rate.government || "").toLowerCase().includes(q) ||
      (rate.name?.en || "").toLowerCase().includes(q) ||
      (rate.name?.ar || "").includes(search.trim()),
  );

  return (
    <div>
      <Header title={t("sidebar.shippingRates")} />
      <div className="p-4">
        <div className="flex flex-wrap justify-between gap-2 mb-4">
          <Input
            type="search"
            placeholder={t("shippingRates.searchPlaceholder")}
            className="w-64 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            onClick={openCreate}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <PlusIcon className="size-4 me-1" />
            {t("shippingRates.addRate")}
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">{t("shippingRates.loading")}</p>
        ) : isError ? (
          <p className="text-sm text-red-500">{t("shippingRates.loadError")}</p>
        ) : (
          <div className="border rounded-2xl p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">
                    {t("shippingRates.government")}
                  </TableHead>
                  <TableHead className="text-start">
                    {t("shippingRates.name")}
                  </TableHead>
                  <TableHead className="text-start">
                    {t("shippingRates.price")}
                  </TableHead>
                  <TableHead className="text-start">
                    {t("shippingRates.active")}
                  </TableHead>
                  <TableHead className="text-end">
                    {t("shippingRates.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500 py-6"
                    >
                      {t("shippingRates.noResults")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((rate) => (
                    <TableRow key={rate._id}>
                      <TableCell className="font-medium text-start">
                        {rate.government}
                      </TableCell>
                      <TableCell className="text-start">
                        {getName(rate)}
                      </TableCell>
                      <TableCell className="text-start">
                        {rate.price} L.E.
                      </TableCell>
                      <TableCell className="text-start">
                        <Switch
                          checked={Boolean(rate.isActive)}
                          onCheckedChange={(v) =>
                            updateRate({ id: rate._id, isActive: v })
                          }
                        />
                      </TableCell>
                      <TableCell className="text-end">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => openEdit(rate)}
                          >
                            <PencilIcon className="size-4" />
                            <span className="sr-only">
                              {t("shippingRates.edit")}
                            </span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 text-red-600 dark:text-red-400"
                            onClick={() => setToDelete(rate)}
                          >
                            <Trash2Icon className="size-4" />
                            <span className="sr-only">
                              {t("shippingRates.delete")}
                            </span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ShippingRateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rate={editing}
      />

      <Dialog open={Boolean(toDelete)} onOpenChange={() => setToDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("shippingRates.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("shippingRates.deleteConfirm", {
                name: toDelete?.government,
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              {t("shippingRates.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() =>
                deleteRate(toDelete._id, { onSuccess: () => setToDelete(null) })
              }
            >
              {isDeleting ? "Deleting..." : t("shippingRates.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
