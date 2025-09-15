import { create } from "zustand";
type editSignatoryType = {
    open: boolean;
    setOpen: (state: boolean) => any;

    signatory: any;
    setSignatory: (signatory: any) => any;
};
export const useEditSignatory = create<editSignatoryType>((set: any) => ({
    open: false,
    setOpen: (state) => set({ open: state }),

    signatory: null,
    setSignatory: (signatory) => set({ signatory: signatory }),
}));
