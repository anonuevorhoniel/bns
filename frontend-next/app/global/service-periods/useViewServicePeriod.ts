import { create } from "zustand";

type viewServicePeriodType = {
    open: boolean;
    setOpen: (state: boolean) => any;

    scholar: any;
    setScholar: (scholar: any) => any;
};

export const useViewServicePeriod = create<viewServicePeriodType>(
    (set: any) => ({
        open: false,
        setOpen: (state: boolean) => set({ open: state }),

        scholar: null,
        setScholar: (scholar: any) => set({ scholar: scholar }),
    })
);
