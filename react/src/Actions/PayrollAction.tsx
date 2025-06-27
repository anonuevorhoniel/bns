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

    setIndexPage: (page: number) => {
        set({ indexPage: page });
    },

    getPayroll: async (setLoading: any) => {
        setLoading(true);
        let page = get().indexPage;
        try {
            const r = await ax.post("/payrolls", { page });
            console.log(r);
            set({ payrolls: r.data.payrolls });
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

    submitPayroll: ({ checked, form }: any) => {
        if (checked.length == 0) {
            toast.error("None selected", {
                description: "Please select atleast one scholar",
            });
        } else {
            storeScholarPayroll(checked, form);
        }

        async function storeScholarPayroll(checked: any, form: any) {
            try {
                const r = await ax.post("/payrolls/store", {
                    scholars: checked,
                    form,
                });

                console.log(r.data.message);
            } catch (err) {
                console.log(err);
            }
        }
    },
}));
