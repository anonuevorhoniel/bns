import { create } from "zustand";

type payrollDownloadType = {
    id: any;
    setId: (id: string) => any;
};

export const useDownload = create<payrollDownloadType>((set: any) => ({
    id: null,
    setId: (id: string) => set({ id: id }),
}));
