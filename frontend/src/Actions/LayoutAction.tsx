import {create} from "zustand";

export const UseLayout = create((set: any) => ({
    b_item: "",
    b_subitems: null,

    setItem: (item: string) => set({b_item: item}),
    setBItem: (item: any) => set({b_subitems: item})
}))