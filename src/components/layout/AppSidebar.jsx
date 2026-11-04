import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  X,
  Loader2,
  Package2,
  Van,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Logo from "./Logo";
import { useLogout } from "@/hooks/useAuth";
import { t } from "i18next";

const navItems = [
  { to: "/dashboard", label: t("sidebar.dashboard"), icon: LayoutDashboard },
  { to: "/products", label: t("sidebar.products"), icon: Package },
  { to: "/categories", label: t("sidebar.categories"), icon: Package2 },
  { to: "/orders", label: t("sidebar.orders"), icon: ShoppingCart },
  { to: "/users", label: t("sidebar.users"), icon: Users },
  { to: "/shipping-rates", label: t("sidebar.shippingRates"), icon: Van },
  { to: "/settings", label: t("sidebar.settings"), icon: Settings },
];

export default function AppSidebar({ isOpen, onClose }) {
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  const { mutate: logout, isPending } = useLogout();

  function handleLogout() {
    logout();
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static top-0 start-0 z-50 flex flex-col w-64 h-screen bg-white dark:bg-gray-900 border-e border-gray-200 dark:border-gray-800 transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-center">
            <Logo />
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                {user?.name || "Admin"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            {isPending ? <Loader2 /> : <>{t("sidebar.logout")}</>}
          </button>
        </div>
      </aside>
    </>
  );
}
