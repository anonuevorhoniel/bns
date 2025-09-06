import { create } from "zustand";

type scholarViewType = {
    open: boolean;
    setOpen: (state: boolean) => any;

    scholar: any;
    setScholar: (scholar: any) => any;
};

export const useScholarView = create<scholarViewType>((set: any) => ({
    open: false,
    setOpen: (state: boolean) => set({ open: state }),

    scholar: {},
    setScholar: (scholar: any) => set({ scholar: scholar }),
}));
