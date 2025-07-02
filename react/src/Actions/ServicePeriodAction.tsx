import ax from "@/Axios";
import { toast } from "sonner";
import { create } from "zustand";

export const UseServicePeriod = create<any>((set: any, get: any) => ({
    data: null,
    loading: false,
    page: 1,
    setPage: (page: number) => set({ page: page }),
    pages: null,
    search: "",

    getData: async (search: string) => {
        set({ loading: true });
        try {
            let page = get().page;
            const r = await ax.post("/service_periods", {
                page: page,
                search: search,
            });
            set({ pages: r.data.pages });
            set({ data: r.data.volunteers });
        } catch (err) {
            console.log(err);
        } finally {
            set({ loading: false });
        }
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
            set({ dataView: r.data.service_periods });
            set({ viewPageInfo: r.data.page_info });
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

    refresh: 0,

    setDeleteSP: async () => {
        let id = get().SPID;
        let setting = get().setDeleteBtnDisable;
        let alertShow = get().setAlertDelete;
        setting(true);

        try {
            const r = await ax.get(`/service_periods/${id}/destroy`);
            console.log(r);
        } catch (err) {
            console.log(err);
        } finally {
            setting(false);
            alertShow(false);
            set({ refresh: get().refresh + 1 });
            toast.warning("Deleted", { description: "Sevice Period Deleted" });
        }
    },
}));

export const UseStoreServicePeriod = create<any>((set: any, get: any) => ({
    storeSingleRefresh: 1,
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
        try {
            await ax.post("/service_periods/single_store", {
                from: form.from,
                to: form.to_date,
                specific: form.to,
                volunteer_id: scholarId,
            });
            toast.success('Sucess!', {description: 'Service Period has been added'});
        } catch (err: any) {
            toast.error("Error", { description: err.response.data });
        } finally {
            set({storeSingleRefresh: get().storeSingleRefresh + 1});
        }
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
    clearForm: () => set({form: null}),

    scholars: null,
    getScholars: async (page: any) => {
        let municipality_code = get()?.form?.municipality_code;
        if (!municipality_code || municipality_code == "") {
            return;
        }
        set({loading: true});
        try {
            const r = await ax.post(`/gmv/${municipality_code}`, {
                page: page,
            });
            set({ pageData: r.data.page_data });
            set({ scholars: r.data.data });
        } catch (err) {
            console.log(err);
        } finally {
            set({loading: false});
        }
    },

    batchStoreSP: async ({ selectedIds, setspCreateOpen }: any) => {
        let form = get().form;
        let data = {
            from: form.from,
            to: form.to,
            specific_date: form.specific_date,
            municipality_code: form.municipality_code,
            members: selectedIds,
        };
        try {
            await ax.post("/service_periods/store", data);
            toast.success("Added!", { description: "Service Periods Created" });
        } catch (err) {
            console.log(err);
        } finally {
            setspCreateOpen(false);
            set((state: any) => ({ storeRefresh: state.storeRefresh + 1 }));
        }
    },
}));
