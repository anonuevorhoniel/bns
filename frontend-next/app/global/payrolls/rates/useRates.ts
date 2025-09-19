import { create } from "zustand";

type rateType = {
    open: boolean;
    setOpen: (state: boolean) => any;
}

export const useRates = create<rateType>((set: any) => ({
    open: false,
    setOpen: (state) => set({open: state}),
}))