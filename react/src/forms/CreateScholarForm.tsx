import { create } from "zustand";

export const useCreateScholarForm = create<any>((set: any, get: any) => ({
    form: {
        first_name: "",
        middle_name: "",
        last_name: "",
        name_on_id: "",
        id_no: "",
        sex: "",
        birth_date: "",
        civil_status: "",
        contact_number: "",
        district_id: "",
        citymuni_id: "",
        barangay_id: "",
        complete_address: "",
        educational_attainment: "",
    },
    eligibilities: [],

    clearForm: () =>
        set({
            form: {
                first_name: "",
                middle_name: "",
                last_name: "",
                name_on_id: "",
                id_no: "",
                sex: "",
                birth_date: "",
                civil_status: "",
                contact_number: "",
                district_id: "",
                citymuni_id: "",
                barangay_id: "",
                complete_address: "",
                educational_attainment: "",
            },
        }),

    setFormData: ({ name, value }: any) => {
        set((state: any) => ({
            form: {
                ...state.form,
                [name]: value,
            },
        }));
    },

    setFormBulk: (payload: any) => {
        set((state: any) => ({
            form: { ...state.form, ...payload },
        }));
    },
}));
