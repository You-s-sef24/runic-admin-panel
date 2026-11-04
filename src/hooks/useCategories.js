import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "@/api/categories";
import errorMessage from "@/lib/errorMessage";

export function useGetCategories(params) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetCategoryById(id) {
  return useQuery({
    queryFn: () => getCategoryById(id),
    queryKey: ["category", id],
  });
}

export function useAddCategory(category) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createCategory(category),
    mutationKey: ["categories"],

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(data.message);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useDeleteCategory(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteCategory(id),
    mutationKey: ["categories"],

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(data.message);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
      toast.success(data.message);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}
