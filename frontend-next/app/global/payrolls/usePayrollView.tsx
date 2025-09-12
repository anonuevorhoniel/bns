import { create } from "zustand";

type payrollViewType = {
    open: boolean;
    setOpen: (state: boolean) => any;
    id: any;
    setId: (id: any) => any;
    page: number;
    setPage: (page: number) => any;
    payrollView: boolean;
    setPayrollView: (state: boolean) => any;
};

export const usePayrollView = create<payrollViewType>((set: any) => ({
    open: false,
    setOpen: (state: boolean) => set({ open: state }),

    id: null,
    setId: (id: any) => set({ id: id }),

    page: 1,
    setPage: (page: number) => set({ page: page }),

    payrollView: true,
    setPayrollView: (state: boolean) => set({ payrollView: state }),
}));
