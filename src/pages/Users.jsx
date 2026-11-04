import { useState } from "react";

import { UsersTable } from "@/components/UsersTable";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";

export default function Users() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  return (
    <div>
      <Header title={t("sidebar.users")} />
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <Input
            placeholder={t("common.search")}
            className="max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <UsersTable search={search} page={page} onPageChange={setPage} />
      </div>
    </div>
  );
}
