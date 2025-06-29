import ax from "@/Axios";
import { create } from "zustand";

export const UseUser = create<any>((set: any) => ({
    userData: null,
    userDataLoad: false,

    getUserData: async (page: number) => {
        try {
            set({ userDataLoad: true });
            const r = await ax.post('/users', {page: page})
            set({userData: r.data.users})
            console.log(r.data);
        } catch (err) {
            console.log(err);
        } finally {
            set({ userDataLoad: false });
        }
    },
}));
