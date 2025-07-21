import ax from "@/Axios";
import { toast } from "sonner";
import { create } from "zustand";

export const UseSignatoryIndex = create<any>((set: any, get: any) => ({
    indexTableLoad: false,

    refresh: 1,
    setRefresh: () => set({ refresh: get().refresh + 1 }),

    indexPage: 1,
    setIndexPage: (page: any) => set({ indexPage: page }),

    openCreate: false,
    setOpenCreate: (state: boolean) => set({ openCreate: state }),

    openEdit: false,
    setOpenEdit: (state: boolean) => set({ openEdit: state }),

    pageInfo: null,
    designations: null,

    signatoryIndex: null,
    setSignatoryIndex: async () => {
        set({ indexTableLoad: true });
        let indexPage = get().indexPage;
        try {
            const r = await ax.post("/signatories", { page: indexPage });
            set({ signatoryIndex: r.data.signatories });
            set({ pageInfo: r.data.page_info });
            set({ designations: r.data.designations });
        } catch (err) {
            console.log(err);
        } finally {
            set({ indexTableLoad: false });
        }
    },

    createForm: null,
    setCreateForm: ({ name, value }: any) =>
        set((state: any) => ({
            createForm: {
                ...state.createForm,
                [name]: value,
            },
        })),

    editForm: null,
    setEditForm: ({ name, value }: any) =>
        set((state: any) => ({
            editForm: {
                ...state.editForm,
                [name]: value,
            },
        })),
    setAllDataEditForm: (payload: any) =>
        set((state: any) => ({
            editForm: { ...state.editForm, ...payload },
        })),

    storeButtonLoad: false,
    updateButtonLoad: false,

    storeSignatory: async () => {
        set({ storeButtonLoad: true });
        let form = get().createForm;
        try {
            await ax.post("/signatories/store", form);
            toast.success("Success", {
                description: "Signatories has been added",
            });
        } catch (err: any) {
            toast.error("Error", { description: err.response.data.message });
        } finally {
            set({ storeButtonLoad: false });
            set({ openCreate: false });
            get().setRefresh();
        }
    },

    editSignatory: null,
    getEditSignatory: async (id: any) => {
        try {
            const r = await ax.get(`/signatories/${id}/edit`);
            set({ editSignatory: r.data.signatory });
        } catch (err) {
            console.log(err);
        }
    },

    updateSignatory: async () => {
        set({ updateButtonLoad: true });
        let id = get().editSignatory.id;
        let form = get().editForm;
        if (!id) {
            return;
        }
        try {
            const r = await ax.post(`/signatories/${id}/update`, form);
            toast.success("Success", { description: r.data.message });
        } catch (err: any) {
            toast.error("Error", { description: err.response.data.message });
        } finally {
            get().setRefresh();
            set({ updateButtonLoad: false });
            set({ openEdit: false });
        }
    },
}));
