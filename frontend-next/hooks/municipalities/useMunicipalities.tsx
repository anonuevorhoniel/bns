import ax from "@/app/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default async function useMunicipalities() {
    try {
        const response = await ax.get("/municipalities");
        console.log(response.data);
        return response.data; 
    } catch (error) {
        console.error("Failed to fetch municipalities:", error);
        throw new Error("Failed to fetch municipalities");
    }
}
