import ax from "@/app/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useGetScholar({
    page,
    search,
    code,
    exceptID,
}: {
    page: number;
    search: string;
    code?: string;
    exceptID?: number;
}) {
    return useQuery({
        queryKey: ["scholars", page, search],
        queryFn: async () =>
            await ax.post("/scholars", {
                page: page,
                search: search,
                code: code,
                except_scholar_id: exceptID,
            }),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });
}
