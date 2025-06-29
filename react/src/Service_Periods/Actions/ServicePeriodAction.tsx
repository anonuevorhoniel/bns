import ax from "@/Axios";
import { create } from "zustand";

export const UseServicePeriod = create<any>((set: any, get: any) => ({
    data: null,
    loading: false,
    page: 1,
    setPage: (page: number) => set({page: page}),
    pages: null,
    search: "",

    getData: async (search: string) => {
        set({ loading: true });
        try {
            let page = get().page;
            const r = await ax.post('/service_periods', {page: page, search: search})
            set({pages: r.data.pages});
            set({data: r.data.volunteers});
            console.log(r.data);
            
        } catch (err) {
            console.log(err);
        } finally {
            set({ loading: false });
        }
    },
}));

export const UseViewServicePeriod = create<any>((set: any, get: any) => ({
    viewOpen: false,
    setViewOpen: (state: boolean) => set({viewOpen: state}),
 }));
