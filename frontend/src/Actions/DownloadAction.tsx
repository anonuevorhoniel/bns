import ax from "@/Axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useDirectory = create<any>((set: any, get: any) => ({
    openDirectoryDialog: false,
    form: {
        code: null,
        fund: null,
        year: null,
    },
    loading: false,

    setLoading: (state: boolean) => set({ loading: state }),

    setOpenDirectoryDialog: (state: boolean) =>
        set({ openDirectoryDialog: state }),

    setForm: ({ name, value }: any) =>
        set((state: any) => ({
            form: {
                ...state.form,
                [name]: value,
            },
        })),

    download: async () => {
        set({ loading: true });
        try {
            const r = await ax.post(
                "/scholars/directory/download",
                get().form,
                { responseType: "blob" }
            );
            const url = URL.createObjectURL(r.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Directory.xlsx";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error: any) {
            let responseObj = await error.response.data.text();
            const r = JSON.parse(responseObj);
            toast.error("Failed", { description: r.message });
        } finally {
            set({ loading: false });
        }
    },
}));

export const useMasterlist = create<any>((set: any, get: any) => ({
    openMasterlistDialog: false,
    setOpenMasterlistDialog: (state: boolean) =>
        set({ openMasterlistDialog: state }),
    form: {
        code: null,
        fund: null,
        year: null,
    },
    loading: false,

    setLoading: (state: boolean) => set({ loading: state }),

    setForm: ({ name, value }: any) =>
        set((state: any) => ({
            form: {
                ...state.form,
                [name]: value,
            },
        })),

    download: async () => {
        set({ loading: true });
        try {
            const r = await ax.post(
                "/scholars/masterlist/download",
                get().form,
                { responseType: "blob" }
            );
            const url = URL.createObjectURL(r.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Masterlist.xlsx";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error: any) {
            let responseObj = await error.response.data.text();
            const r = JSON.parse(responseObj);
            toast.error("Failed", { description: r.message });
        } finally {
            set({ loading: false });
        }
    },
}));
