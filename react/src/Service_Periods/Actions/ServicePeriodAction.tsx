import ax from "@/Axios";
import { create } from "zustand";

export const UseServicePeriod = create<any>((set: any, get: any) => ({
    servicePeriodData: null,
    servicePeriodDataLoad: false,
    servicePeriodDataPage: 1,
    setServicePeriodDataPage: (page: number) => set({servicePeriodDataPage: page}),
    pages: null,


    getServicePeriodData: async () => {
        set({ servicePeriodDataLoad: true });
        try {
            let page = get().servicePeriodDataPage;
            const r = await ax.post('/service_periods', {page: page})
            set({pages: r.data.pages});
            set({servicePeriodData: r.data.volunteers});
        } catch (err) {
            console.log(err);
        } finally {
            set({ servicePeriodDataLoad: false });
        }
    },
}));
