import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

/**
 * Fetch all available problems from LeetCode API via backend
 */
export function useProblems() {
    return useQuery({
        queryKey: ["problems"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/problems");
            return data;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
