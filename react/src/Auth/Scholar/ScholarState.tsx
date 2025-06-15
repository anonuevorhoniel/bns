import { create } from "zustand";

export const ViewScholar = create<any>((set: any) => ({
    show: false,
    setShow: (state: boolean) => set({show: state })
}));