import ax from "@/Axios";
import type { UseLoginType } from "@/Types/LoginTypes";
import { toast } from "sonner";
import { create } from "zustand";

export const UseLogin = create<UseLoginType>((set: any, get: any) => ({
    loading: false,
    loginForm: {
        email: "",
        password: "",
    },
    setLogin: (prev: any) => {
        set((state: any) => ({
            loginForm: { ...state.loginForm, ...prev },
        }));
    },

    authenticate: async (nav: any) => {
        set({ loading: true });
        try {
            const r = await ax.post("/users/authenticate", {
                email: get().loginForm.email,
                password: get().loginForm.password,
            });
            toast.success("Success", { description: r.data.message });
            nav("/dashboard");
        } catch (e: any) {
            console.log(e);
            toast.error("Error", { description: e.response.data.message });
        } finally {
            set({ loading: false });
        }
    },
}));
