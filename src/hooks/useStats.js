import { useQuery } from "@tanstack/react-query";
import {
  getOrdersByStatus,
  getPriceDistribution,
  getProductsByCategory,
  getSummary,
  getTopProducts,
} from "@/api/stats";

export function useOrdersByStatus() {
  return useQuery({
    queryKey: ["stats", "orders-by-status"],
    queryFn: getOrdersByStatus,
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: ["stats", "top-products"],
    queryFn: getTopProducts,
  });
}

export function useProductsByCategory() {
  return useQuery({
    queryKey: ["stats", "products-by-category"],
    queryFn: getProductsByCategory,
  });
}

export function usePriceDistribution() {
  return useQuery({
    queryKey: ["stats", "price-distribution"],
    queryFn: getPriceDistribution,
  });
}

export function useSummary() {
  return useQuery({
    queryKey: ["stats", "summary"],
    queryFn: getSummary,
  });
}
