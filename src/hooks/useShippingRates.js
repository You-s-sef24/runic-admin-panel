import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createShippingRate,
  deleteShippingRate,
  getShippingRates,
  updateShippingRate,
} from "@/api/shippingRates";
import { toast } from "sonner";
import errorMessage from "@/lib/errorMessage";

export function useGetShippingRates() {
  return useQuery({
    queryKey: ["shipping-rates"],
    queryFn: getShippingRates,
  });
}

export function useCreateShippingRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShippingRate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success(data?.message);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useUpdateShippingRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateShippingRate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success(data?.message);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useDeleteShippingRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShippingRate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success(data?.message);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}
