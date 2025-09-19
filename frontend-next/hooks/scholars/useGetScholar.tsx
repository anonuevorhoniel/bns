import ax from "@/app/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useGetScholar({
    page,
    search,
    code,
    exceptID,
    changeVariable,
}: {
    page: number;
    search?: string;
    code?: string | null;
    exceptID?: number;
    changeVariable?: any[];
}) {
    return useQuery({
        //spread kung meron, kung wala edi empty
        queryKey: ["scholars", page, search, ...(changeVariable ?? [])],
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
