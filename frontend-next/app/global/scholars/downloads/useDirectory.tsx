import { create } from "zustand";

type useDirectoryType = {
    open: boolean;
    setOpen: (state: boolean) => any;
};

export const useDirectory = create<useDirectoryType>((set: any) => ({
    open: false,
    setOpen: (state: boolean) => set({ open: state }),
}));
