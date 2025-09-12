import { create } from "zustand";

type useMasterlistType = {
    open: boolean;
    setOpen: (state: boolean) => any;
};
export const useMasterlist = create<useMasterlistType>((set: any) => ({
    open: false,
    setOpen: (state: boolean) => set({ open: state }),
}));
