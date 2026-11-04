import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import Logo from "@/components/layout/Logo";
import { useLogin } from "@/hooks/useAuth";
import { t } from "i18next";

const loginSchema = z.object({
  email: z.string().email(t("login.invalidEmail")),
  password: z.string().min(8, t("login.passwordMinLength")),
});

export default function Login() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [viewPass, setViewPass] = useState(false);
  const { mutate: login, isPending } = useLogin(formData);

  function handleSubmit(e) {
    e.preventDefault();

    const validationResult = loginSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message;
      toast(firstError || t("login.checkInput"));
      return;
    }

    login(formData);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-8 w-[400px]">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {t("login.subtitle")}
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-900 dark:text-gray-100">
              {t("login.email")}
            </label>
            <Input
              type="email"
              placeholder="admin@nexus.io"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md p-2"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-900 dark:text-gray-100">
              {t("login.password")}
            </label>
            <div className="relative">
              <Input
                type={viewPass ? "text" : "password"}
                placeholder="********"
                className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md p-2 pr-10 w-full"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setViewPass((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                tabIndex={-1}
              >
                {viewPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 dark:bg-blue-600 text-white rounded-md p-2 hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? t("login.signingIn") : t("login.signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}
