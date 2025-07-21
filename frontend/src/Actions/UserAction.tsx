import ax from "@/Axios";
import { create } from "zustand";

export const UseUser = create<any>((set: any) => ({
    getUserData: async (page: number) => {
        set({ userDataLoad: true });
        const r = await ax.post("/users", { page: page });
        return { userData: r.data.users, total_page: r.data.total_page };
    },
}));
