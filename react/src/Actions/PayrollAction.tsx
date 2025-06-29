import ax from "@/Axios";
import { toast } from "sonner";
import { create } from "zustand";

export const UsePayroll = create<any>((set: any, get: any) => ({
    form: {},
    rates: null,
    scholars: null,
    total_page: 0,
    tableLoad: false,
    scholar_ids: [],
    payrolls: null,
    indexPage: 1,
    totalPage: 0,
    totalPayroll: 0,
    offset: 0,
    limit: 0,
//current payroll count cpc
    cpc: 0,

    setIndexPage: (page: number) => {
        set({ indexPage: page });
    },

    getPayroll: async (setLoading: any) => {
        setLoading(true);
        let page = get().indexPage;
        try {
            const r = await ax.post("/payrolls", { page });
            set({ payrolls: r.data.payrolls });
            set({ totalPage: r.data.total_page });
            set({totalPayroll: r.data.total_payroll});
            set({offset: r.data.offset});
            set({limit: r.data.limit})
            set({cpc: r.data.current_payroll_count});
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    },

    getRates: async () => {
        try {
            const r = await ax.get("/rates");
            const rate = r.data.rates;
            set({ rates: rate });
        } catch (err) {
            console.log(err);
        }
    },

    getScholars: async ({ setLoading, page, pageChange }: any) => {
        !pageChange && setLoading(true);
        set({ tableLoad: true });
        try {
            let form = get().form;
            const r = await ax.post("/getScholars", { form, page });
            const scholar_data = r.data.results;
            const total_page = r.data.total_page;
            const scholar_ids = r.data.scholar_ids;
            console.log(r.data);
            set({ scholars: scholar_data });
            set({ total_page: total_page });
            set({ scholar_ids: scholar_ids });
        } catch (err) {
            console.log(err);
        } finally {
            !pageChange && setLoading(false);
            set({ tableLoad: false });
        }
    },

    setForm: ({ name, value }: any) => {
        set((state: any) => ({
            form: {
                ...state.form,
                [name]: value,
            },
        }));
    },

    clearForm: () => {
        set({ form: null });
    },

    submitPayroll: ({ checked, form, nav, setSubmitPLoad }: any) => {
        if (checked.length == 0) {
            toast.error("None selected", {
                description: "Please select atleast one scholar",
            });
        } else {
            storeScholarPayroll(checked, form);
        }

        async function storeScholarPayroll(checked: any, form: any) {
            setSubmitPLoad(true);
            try {
                await ax.post("/payrolls/store", {
                    scholars: checked,
                    form,
                });
                get().clearForm();
                nav("/payrolls");
                setTimeout(() => {
                    toast.success("Created", { description: "Payroll Added" });
                }, 100);
            } catch (err) {
                console.log(err);
            } finally {
                setSubmitPLoad(false)
            }
        }
    },
}));

export const UseViewPayroll = create<any>((set: any) => ({
    page: 1,
    viewPayroll: false,
    viewPayrollScholar: null,
    totalPpage: 1,
    id: null,
    loading: false,
    payroll: null,

    setPage: (page: number) => set({ page: page }),
    setViewPayroll: async (open: boolean, id: number, page: number, search: string) => {
        // set({ payroll: null });
        set({ loading: true });
        set({ id: id });
        set({ viewPayroll: open });
        if (id != undefined) {
            try {
                const r = await ax.post(`/payrolls/show/${id}`, {
                    page: page,
                    search: search
                });
                set({ viewPayrollScholar: r.data.volunteers });
                set({ totalPage: r.data.total_page });
                set({ payroll: r.data.payroll });
                console.log(r.data);
            } catch (err) {
                console.log(err);
            } finally {
                set({ loading: false });
            }
        }
    },
}));

export const UseDownloadPayroll = create<any>((set: any) => ({
    loadingId: null,

    download: async (id: any) => {
        set({ loadingId: id });
        try {
            const r = await ax.get(`/payrolls/${id}/download`, {
                responseType: "blob",
            });
            const url = URL.createObjectURL(r.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Payroll.xlsx";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Downloaded", {
                description: "Payroll Downloaded",
            });
        } catch (error: any) {
            try {
                let responseObj = await error.response.data.text();
                const r = JSON.parse(responseObj);
                toast.error("Failed", { description: r.message });
            } catch {
                toast.error("Failed", {
                    description: "An unexpected error occurred.",
                });
            }
        } finally {
            set({ loadingId: false });
        }
    },
}));

export const UseDownloadMasterlist = create<any>((set: any) => ({
    loadingIdMasterlist: null,

    downloadMasterlist: async (id: any) => {
        set({ loadingIdMasterlist: id });
        try {
            const r = await ax.get(`/payrolls/masterlists/${id}/download`, {
                responseType: "blob",
            });
            const url = URL.createObjectURL(r.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Masterlist.xlsx";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Downloaded", {
                description: "Masterlist Downloaded",
            });
        } catch (error: any) {
            try {
                let responseObj = await error.response.data.text();
                const r = JSON.parse(responseObj);
                toast.error("Failed", { description: r.message });
            } catch {
                toast.error("Failed", {
                    description: "An unexpected error occurred.",
                });
            }
        } finally {
            set({ loadingIdMasterlist: false });
        }
    },
}));
