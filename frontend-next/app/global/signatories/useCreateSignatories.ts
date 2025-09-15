import { create } from "zustand";

type createSignatoryType = {
    open: boolean;
    setOpen: (state: boolean) => any;
};

export const useCreateSignatory = create<createSignatoryType>(
    (set: any, get: any) => ({
        open: false,
        setOpen: (state: boolean) => set({ open: state }),
    })
);
