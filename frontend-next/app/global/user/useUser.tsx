import { create } from "zustand";

type UserType = {
    email: string;
    name: string;
};

type useUserType = {
    user: UserType;
    setUser: (user: UserType) => any;
};

export const useUser = create<useUserType>((set: any) => ({
    user: { email: "", name: "" },
    setUser: (user: any) => set({ user: user }),
}));
