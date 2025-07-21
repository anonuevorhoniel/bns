import ax from "@/Axios";
import { create } from "zustand";

export const UseAuditTrail = create<any>((set: any, get: any) => ({
    page: 1,
    setPage: (page: any) => set({ page: page }),

    search: "",
    setSearch: (value: any) => set({ search: value }),

    setData: async () => {
        let page = get().page;
        let search = get().search;
        const r = await ax.post("/audit_trails", {
            page: page,
            search: search,
        });
        return { pageInfo: r.data.pages, data: r.data.trails };
    },
}));
