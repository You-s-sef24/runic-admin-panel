import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetUsers } from "@/hooks/useAuth";
import { getAvatarColor, getInitials } from "@/lib/avatarColor";
import { formatDate } from "@/lib/formatDate";
import { useTranslation } from "react-i18next";
import Pagination from "./Pagination";

const LIMIT = 10;

export function UsersTable({ search = "", page = 1, onPageChange }) {
  const { t } = useTranslation();
  const { data, isLoading, isError, isPlaceholderData } = useGetUsers({
    page,
    limit: LIMIT,
  });

  if (isLoading)
    return <p className="text-sm text-gray-500">{t("users.loading")}</p>;
  if (isError)
    return <p className="text-sm text-red-500">{t("users.loadError")}</p>;

  const totalPages = data?.totalPages ?? 1;
  const filteredUsers = (data?.users ?? []).filter(
    (user) =>
      !user.isAdmin &&
      (user.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="border rounded-2xl p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">{t("users.name")}</TableHead>
              <TableHead className="text-start">{t("users.email")}</TableHead>
              <TableHead className="text-start">{t("users.phone")}</TableHead>
              <TableHead className="text-start">{t("users.joined")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 py-6"
                >
                  {t("users.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="text-start">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(user.name)}`}
                      >
                        {getInitials(user.name)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 text-start">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-gray-500 text-start">
                    {user.phone}
                  </TableCell>
                  <TableCell className="text-gray-500 text-start">
                    {formatDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))
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
    </div>
  );
}
