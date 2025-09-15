import { create } from "zustand";

type scholarViewType = {
    open: boolean;
    setOpen: (state: boolean) => any;

    scholar: any;
    setScholar: (scholar: any) => any;

    replacedScholar: any;
    setReplacedScholar: (scholar: any) => any;
};

export const useScholarView = create<scholarViewType>((set: any) => ({
    open: false,
    setOpen: (state: boolean) => set({ open: state }),

    scholar: {},
    setScholar: (scholar) => set({ scholar: scholar }),

    replacedScholar: {
        id: null,
        full_name: ""
    },
    setReplacedScholar: (scholar) => set({ replacedScholar: scholar }),
}));
