import ax from "@/Axios";
import { create } from "zustand";

export const UseServicePeriodAction = create<any>((set: any, get: any) => ({
    page: 1,
    setPage: (page: number) => set({ page: page }),
    getData: async (search: string) => {
        let page = get().page;
        const r = await ax.post("/service_periods", {
            page: page,
            search: search,
        });
        return { pages: r.data.pages, data: r.data.volunteers };
    },
}));

export const UseViewServicePeriod = create<any>((set: any, get: any) => ({
    viewOpen: false,
    setViewOpen: (state: boolean) => set({ viewOpen: state }),

    viewPage: 1,
    setViewPage: (page: any) => set({ viewPage: page }),

    scholarId: null,
    setScholarId: (id: any) => set({ scholarId: id }),

    viewPageInfo: null,

    dataView: null,
    setDataView: async () => {
        let id = get().scholarId;
        try {
            const r = await ax.post(`/service_periods/${id}/show`);
            return {
                dataView: r.data.service_periods,
                viewPageInfo: r.data.page_info,
            };
        } catch (err) {
            console.log(err);
        }
    },
}));

export const useCreateSchema = create<any>((set: any) => ({
    to: "",
    setTo: (to: any) => set({ to: to }),
}));

export const deleteServicePeriod = create<any>((set: any, get: any) => ({
    alertDelete: false,
    setAlertDelete: (state: boolean) => set({ alertDelete: state }),

    SPID: null,
    setSPID: (id: any) => set({ SPID: id }),

    deleteBtnDisable: false,
    setDeleteBtnDisable: (state: boolean) => set({ deleteBtnDisable: state }),
    setDeleteSP: async () => {
        let id = get().SPID;
        await ax.get(`/service_periods/${id}/destroy`);
    },
}));

export const UseStoreServicePeriod = create<any>((set: any, get: any) => ({
    spFormData: {
        from: "",
        to: "",
        to_date: "",
    },

    setSpFormData: ({ name, value }: any) =>
        set((state: any) => ({
            spFormData: { ...state.spFormData, [name]: value },
        })),

    storeSP: async (scholarId: any) => {
        let form = get().spFormData;
        await ax.post("/service_periods/single_store", {
            from: form.from,
            to: form.to_date,
            specific: form.to,
            volunteer_id: scholarId,
        });
    },
}));

export const UseCreateServicePeriod = create<any>((set: any, get: any) => ({
    loading: false,

    storeRefresh: 1,
    spCreateOpen: false,
    setspCreateOpen: (state: boolean) => set({ spCreateOpen: state }),

    pageData: null,

    form: {
        from: "",
        to: "",
        specific_date: "",
        municipality_code: "",
    },

    setForm: ({ name, value }: any) =>
        set((state: any) => ({
            form: { ...state.form, [name]: value },
        })),
    clearForm: () => set({ form: null }),

    scholars: null,
    getScholars: async (page: any) => {
        let municipality_code = get()?.form?.municipality_code;
        if (!municipality_code || municipality_code == "") {
            return;
        }
        set({ loading: true });
        try {
            const r = await ax.post(`/gmv/${municipality_code}`, {
                page: page,
            });
            set({ pageData: r.data.page_data });
            set({ scholars: r.data.data });
        } catch (err) {
            console.log(err);
        } finally {
            set({ loading: false });
        }
    },

    batchStoreSP: async ({ selectedIds}: any) => {
        let form = get().form;
        let data = {
            from: form.from,
            to: form.to,
            specific_date: form.specific_date,
            municipality_code: form.municipality_code,
            members: selectedIds,
        };
        await ax.post("/service_periods/store", data);
    },
}));
