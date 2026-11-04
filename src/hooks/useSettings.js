import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getNailCost, updateNailCost } from "@/api/settings";
import errorMessage from "@/lib/errorMessage";

export function useGetNailCost() {
  return useQuery({
    queryKey: ["nail-cost"],
    queryFn: getNailCost,
  });
}

export function useUpdateNailCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNailCost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["nail-cost"] });
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(errorMessage(err));
    },
  });
}
