import ax from "@/Axios";
import type {
    UseCreateScholarType,
    UseGetMunicipalityType,
    UseBarangayType,
} from "@/Types/ScholarTypes";
import { toast } from "sonner";
import { create } from "zustand";

export const UseCreateScholar = create<UseCreateScholarType>((set: any) => ({
    loading: false,

    CreateScholarData: null,
    GetCreateScholarData: async () => {
        try {
            const r = await ax.get("/scholars/create");
            set({ CreateScholarData: r.data });
        } catch (err) {
            console.log(err);
        }
    },
}));

export const UseGetMunicipality = create<UseGetMunicipalityType>(
    (set: any) => ({
        Municipalities: null,
        GetMunicipalities: async (district_id: string) => {
            try {
                const r = await ax.post("/getMunicipalities", {
                    district: district_id,
                });
                set({ Municipalities: r.data });
                console.log(r.data);
            } catch (err) {
                console.log(err);
            }
        },
    })
);
// UseGetScholarType
export const UseGetScholar = create<any>((set: any) => ({
    page: 1,
    totalPage: 0,
    loading: false,
    scholars: null,
    code: null,
    muniValue: null,
    totalScholar: 0,
    offset: 0,
    cs_count: 0,

    setPage: (page: number) => set({ page: page }),
    setmuniValue: (val: any) => set({ muniValue: val }),
    setCode: (code: string) => set({ code: code }),

    GetScholars: async (code: any, page: number, search: string) => {
        if (code == null) {
            set({ scholars: null });
            return null;
        }
        set({ loading: true });

        try {
            const r = await ax.post("/scholars/get", {
                code: code,
                page: page,
                search: search,
            });
            set({ scholars: r.data.get_scholars });
            set({ totalPage: r.data.total_page });
            set({ totalScholar: r.data.total_count });
            set({ offset: r.data.offset });
            set({ cs_count: r.data.current_scholar_count });
        } catch (err) {
            console.log(err);
        } finally {
            set({ loading: false });
        }
    },
}));

export const UseBarangay = create<UseBarangayType>((set: any) => ({
    Barangays: null,
    GetBarangays: async (code: string) => {
        try {
            const r = await ax.post("/getBarangays", { code: code });
            set({ Barangays: r.data });
        } catch (err) {
            console.log(err);
        }
    },
}));

export const ScholarStore = create<any>(() => ({
    store: async (
        form: any,
        setLoading: any,
        nav: any,
        eligibilities: any,
        trainings: any
    ) => {
        setLoading(true);
        try {
            const r = await ax.post("/scholars/store", {
                form,
                eligibilities,
                trainings,
            });
            nav("/scholars");
            setTimeout(
                () => toast.success("Success", { description: r.data.message }),
                300
            );
            console.log(r);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    },
}));

export const ScholarEdit = create<any>((set: any) => ({
    scholarData: null,
    clearScholarData: () => set({ scholarData: null }),
    getScholarData: async ({id, setEligibilities, setTrainings}: any) => {
        try {
            const r = await ax.get(`/scholars/${id}/edit`);
            set({ scholarData: r.data.scholar });
            setEligibilities(r.data.eligibilities);
            setTrainings(r.data.trainings);
        } catch (err) {
            console.log(err);
        }
    },

    update: async ({ form, setLoading, id, eligibilities, trainings }: any) => {
        console.log(eligibilities);
        setLoading(true);
        try {
            const r = await ax.post(`/scholars/${id}/update`, {form, eligibilities, trainings});
            console.log(r.data);
            toast.success("Updated", { description: r.data.message });
        } catch (err: any) {
            console.log(err);
            toast.error("Error", { description: err.response.data.message });
        } finally {
            setLoading(false);
        }
    },
}));

export const UseScholarShow = create<any>((set: any) => ({
    fullName: "",
    scholarData: null,
    servicePeriods: null,
    eligibilities: null,
    trainings: null,

    getScholarShowData: async (id: any) => {
        set({ fullName: "" });
        set({ scholarData: "loading" });
        try {
            const r = await ax.get(`/scholars/${id}/show`);
            set({ fullName: r.data.scholar.full_name });
            set({ scholarData: r.data.scholar });
            set({ servicePeriods: r.data.service_periods });
            set({ eligibilities: r.data.eligibilities });
            set({ trainings: r.data.trainings });
            console.log(r);
        } catch (err) {
            console.log(err);
        }
    },
}));

export const AdditionalInfo = create<any>((set: any, get: any) => ({
    show: false,
    code: null,
    search: null,
    page: 1,

    setCode: (code: any) => set({ code: code }),
    setSearch: (search: any) => set({ search: search }),
    setPage: (page: any) => set({ page: page }),
    setShow: (e: boolean) => set({ show: e }),

    getScholars: async () => {
        try {
             await ax.post("/scholars/get", {
            code: get().code,
            page: get().page,
            search: get().search,
        });
        } catch (err) {
            console.log(err);
        }
    },
}));
