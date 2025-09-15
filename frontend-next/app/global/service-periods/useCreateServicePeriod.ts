import { create } from "zustand";

type createServicePeriodType = {
    open: boolean;
    setOpen: (state: boolean) => any;
    
    selectedIds: any[];
    setSelectedIds: (ids: any) => any;
    removeSeleted: (id: any) => any;
    clearSelected: () => any
};

export const useCreateServicePeriod = create<createServicePeriodType>(
    (set: any, get: any) => ({
        open: false,
        setOpen: (state: boolean) => set({ open: state }),

        selectedIds: [],
        setSelectedIds: (ids) =>
            set({ selectedIds: [...get().selectedIds, ids] }),
        removeSeleted: (id) => {
            set({
                selectedIds: get().selectedIds.filter(
                    (item: any) => item != id
                ),
            });
        },
        clearSelected: () => set({ selectedIds: [] }),
    })
);
