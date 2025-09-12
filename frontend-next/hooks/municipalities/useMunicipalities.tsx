import ax from "@/app/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useMunicipalities() {
    return useQuery({
        queryKey: ["municipalities"],
        queryFn: async () => await ax.get("/municipalities"),
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });
}
