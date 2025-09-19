import ax from "@/app/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useUser = () => {
    const data = useQuery({
        queryKey: ["user-auth"],
        queryFn: async () => await ax.get("/users/check-auth"),
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });

    return data;
};
