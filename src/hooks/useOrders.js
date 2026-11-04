import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrder, getOrders, updateOrder } from "@/api/orders";
import { toast } from "sonner";
import errorMessage from "@/lib/errorMessage";

export function useGetOrder(id) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  });
}

export function useGetOrders(params) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(data?.message);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}
