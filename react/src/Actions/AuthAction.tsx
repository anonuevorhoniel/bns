import ax from "@/Axios";
import type { UseAuthType } from "@/Types/LoginTypes";
import { create } from "zustand";

export const UseAuth = create<UseAuthType>((set: any) => ({
    user: null,
    authenticate: async (nav: any) => {
        set({user: null});
        try {
            const r = await ax.get("/users/check-auth");
            set({ user: r.data });
        } catch (err: any) {
            if (err.response.status == 401) {
                nav("/");
            }
            console.log(err);
        }
    },
}));
