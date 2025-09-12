import { create } from "zustand";

type createServicePeriodType = {
    open: boolean;
    setOpen: (state: boolean) => any;
};

export const useCreateServicePeriod = create<createServicePeriodType>(
    (set: any) => ({
        open: false,
        setOpen: (state: boolean) => set({ open: state }),
    })
);
