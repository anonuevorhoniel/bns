import ax from "@/app/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useGetScholar({
    page,
    search,
}: {
    page: number;
    search: string;
}) {
    return useQuery({
        queryKey: ["scholars", page, search],
        queryFn: async () =>
            await ax.post("/scholars/get", { page: page, search: search }),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });
}
