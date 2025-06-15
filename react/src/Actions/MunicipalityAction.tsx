import ax from "@/Axios";
import { create } from "zustand";

export const UseMuni = create<any>((set: any) => ({
    page: 1,
    total_scholars: 0,
    municipalities: null,
    total_page: 0,
    allMuni: null,
    loading: false,

    setPage: (page: number) => set({page: page}),

    getMunicipalities: async (page: number) => {
        set({loading: true});
        try {
            const r = await ax.post("/dashboard/get-muni", {page: page});
            set({municipalities: r.data.scholar_per_mun})
            set({total_page: r.data.total_page})
            set({total_scholars: r.data.scholars_count})
        } catch (err: any) {
            console.log(err);
        } finally {
            set({loading: false});
        }
    },

     getAllMuni: async () => {
        try {
            const r = await ax.get("/scholars/getAllMuni");
            set({allMuni: r.data.cities})
        } catch (err: any) {
            console.log(err);
        }
    },
}));
