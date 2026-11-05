import {
  Globe,
  Sun,
  Moon,
  User,
  Lock,
  Eye,
  EyeOff,
  Hammer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import { useThemeStore } from "@/store/themeStore";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/langStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import z from "zod";
import { toast } from "sonner";
import { useUpdateProfile } from "@/hooks/useAuth";
import { useGetNailCost, useUpdateNailCost } from "@/hooks/useSettings";

const profileDataSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  email: z.string().trim().email("Invalid email address"),
});

const passwordDataSchema = z.object({
  current: z.string().min(1, "Current password is required"),
  new: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Settings() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const user = useAuthStore((s) => s.user);
  const { mutate: updateProfile, isPending: isSavingProfile } =
    useUpdateProfile();
  const { mutate: updatePassword, isPending: isSavingPassword } =
    useUpdateProfile();
  const { data, isLoading: isLoadingNailCost } = useGetNailCost();
  const serverCost = data?.nailCost ?? 0;
  const { mutate: updateNailCost, isPending: isSavingNailCost } =
    useUpdateNailCost();

  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ current: "", new: "" });
  const [viewCurrentPass, setViewCurrentPass] = useState(false);
  const [viewNewPass, setViewNewPass] = useState(false);
  const [nailCost, setNailCost] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  useEffect(() => {
    if (serverCost !== undefined && serverCost !== null) {
      setNailCost(String(serverCost));
    }
  }, [serverCost]);

  const nailCostUnchanged =
    nailCost !== "" && Number(nailCost) === Number(serverCost);

  const profileUnchanged =
    profileData.name.trim() === (user?.name ?? "") &&
    profileData.email.trim() === (user?.email ?? "");

  function handleSaveProfile(e) {
    e.preventDefault();

    const validationResult = profileDataSchema.safeParse(profileData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message;
      toast.error(firstError || t("login.checkInput"));
      return;
    }

    // only the fields this form edits; the server ignores everything else
    updateProfile({
      name: validationResult.data.name,
      email: validationResult.data.email,
    });
  }

  function handleChangePassword(e) {
    e.preventDefault();

    const validationResult = passwordDataSchema.safeParse(passwordData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message;
      toast.error(firstError || t("login.checkInput"));
      return;
    }

    // the server verifies the current password; the browser never sees a hash
    updatePassword(
      {
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
      },
      {
        onSuccess: () => {
          setPasswordData({ current: "", new: "" });
        },
      },
    );
  }

  function handleSaveNailCost(e) {
    e.preventDefault();

    const parsed = Number(nailCost);
    if (nailCost.trim() === "" || Number.isNaN(parsed) || parsed < 0) {
      toast.error(t("settings.nailCostInvalid"));
      return;
    }

    updateNailCost(parsed);
  }

  return (
    <div>
      <Header title={t("sidebar.settings")} />
      <div className="p-4 flex flex-col gap-4 max-w-2xl">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="size-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("settings.language")}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={language === "en" ? "default" : "outline"}
              onClick={() => setLanguage("en")}
              className={
                language === "en"
                  ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500"
                  : ""
              }
            >
              English
            </Button>
            <Button
              variant={language === "ar" ? "default" : "outline"}
              onClick={() => setLanguage("ar")}
              className={
                language === "ar"
                  ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500"
                  : ""
              }
            >
              العربية
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="size-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("settings.appearance")}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className={
                theme === "light"
                  ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  : ""
              }
            >
              <Sun className="size-4 mr-1" /> {t("settings.light")}
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className={
                theme === "dark"
                  ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  : ""
              }
            >
              <Moon className="size-4 mr-1" /> {t("settings.dark")}
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="size-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("settings.accountInfo")}
            </h3>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSaveProfile}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">{t("settings.name")}</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{t("settings.email")}</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              disabled={isSavingProfile || profileUnchanged}
              className="w-fit bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {isSavingProfile ? "Saving..." : t("settings.saveChanges")}
            </Button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="size-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("settings.changePassword")}
            </h3>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleChangePassword}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-password">
                {t("settings.currentPassword")}
              </Label>
              <div className="relative" dir="ltr">
                <Input
                  id="current-password"
                  type={viewCurrentPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={passwordData.current}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      current: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => setViewCurrentPass((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {viewCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password">{t("settings.newPassword")}</Label>
              <div className="relative" dir="ltr">
                <Input
                  id="new-password"
                  type={viewNewPass ? "text" : "password"}
                  autoComplete="new-password"
                  value={passwordData.new}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, new: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setViewNewPass((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {viewNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isSavingPassword}
              className="w-fit bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {isSavingPassword ? "Updating..." : t("settings.changePassword")}
            </Button>
          </form>
        </div>

        {user?.isAdmin && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Hammer className="size-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {t("settings.nailCost")}
              </h3>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSaveNailCost}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="nail-cost">{t("settings.nailCostLabel")}</Label>
                <div className="relative" dir="ltr">
                  <Input
                    id="nail-cost"
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    disabled={isLoadingNailCost || isSavingNailCost}
                    value={isLoadingNailCost ? "" : nailCost}
                    placeholder={isLoadingNailCost ? "..." : "0"}
                    onChange={(e) => setNailCost(e.target.value)}
                    className="pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 pointer-events-none">
                    EGP
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("settings.nailCostHint")}
                </p>
              </div>

              <Button
                type="submit"
                disabled={
                  isLoadingNailCost || isSavingNailCost || nailCostUnchanged
                }
                className="w-fit bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {isSavingNailCost ? "Saving..." : t("settings.saveChanges")}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
