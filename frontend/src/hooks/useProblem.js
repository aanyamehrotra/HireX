import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

/**
 * Fetch specific problem details from backend
 */
export function useProblem(id) {
    return useQuery({
        queryKey: ["problem", id],
        queryFn: async () => {
            if (!id) return null;
            const { data } = await axiosInstance.get(`/problems/${id}`);
            return data;
        },
        enabled: !!id,
        retry: 1,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
