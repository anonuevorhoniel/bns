import { create } from "zustand";

type payrollSummaryType = {
    open: boolean;
    setOpen: (state: boolean) => any;
};
export const usePayrollSummary = create<payrollSummaryType>((set: any) => ({
    open: false,
    setOpen: (state) => set({ open: state }),
}));
