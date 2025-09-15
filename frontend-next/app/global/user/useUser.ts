import { create } from "zustand";

type UserType = {
    email: string;
    name: string;
    classification: string;
};

type useUserType = {
    user: UserType;
    setUser: (user: UserType) => any;
};

export const useUser = create<useUserType>((set: any) => ({
    user: { email: "", name: "", classification: "" },
    setUser: (user: any) => set({ user: user }),
}));
