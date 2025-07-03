import ax from "@/Axios";
import { create } from "zustand";

export const UseAuditTrail = create<any>((set: any, get: any) => ({
    page: 1,
    setPage: (page: any) => set({ page: page }),

    loading: false,
    pageInfo: null,
    search: "",
    setSearch: (value: any) => set({ search: value }),

    data: null,
    setData: async () => {
        let page = get().page;
        let search = get().search;
        set({ loading: true });
        try {
            const r = await ax.post("/audit_trails", {
                page: page,
                search: search,
            });
            set({ pageInfo: r.data.pages });
            set({ data: r.data.trails });
        } catch (err: any) {
            console.log(err.response.data.message);
        } finally {
            set({ loading: false });
        }
    },
}));
