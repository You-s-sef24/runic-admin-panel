import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getUsers, login, logout, updateUser } from "@/api/users";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useGetUsers(params) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useLogin(user) {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => login(user),
    mutationKey: ["user"],

    onSuccess: (data) => {
      if (!data.user.isAdmin) {
        toast.error("You don't have access to the dashboard");
        return;
      }
      setUser(data.user);
      toast.success(data.message);
      navigate("/dashboard");
    },
    onError: () => toast.error("Login Failed"),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: (data) => toast.success(data.message),
    onSettled: () => {
      queryClient.clear();
      setUser(null);
      navigate("/");
    },
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      const current = useAuthStore.getState().user;
      setUser({ ...current, ...data.user });
      toast.success(data.message);
    },
    onError: (error) => {
      const data = error.response?.data;
      toast.error(
        data?.message || data?.errors?.[0]?.msg || "Update Profile Failed",
      );
    },
  });
}
