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
            r.data.user.assigned_muni_code == null
                ? nav("/dashboard")
                : nav("/scholars");
            setTimeout(() => {
                toast.success("Success", { description: r.data.message });
            }, 200);
        } catch (e: any) {
            console.log(e);
            toast.error("Error", { description: e.response.data.message });
        } finally {
            set({ loading: false });
        }
    },
}));

export const UseLogout = create<any>((set: any) => ({
    logout: async (user_id: any, nav: any) => {
        try {
            await ax.post("/logout", { id: user_id });
            nav("/");
        } catch (err) {
            console.log(err);
        }
    },
}));
