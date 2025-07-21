import ax from "@/Axios";
import { create, type StateCreator } from "zustand";

type AccountActionType = {
    emailForm: any;
    setEmailForm: any;
    changeEmail: () => any;
    clearEmailForm: () => any;
};
export const ChangeEmail: StateCreator<AccountActionType> = (
    set: any,
    get: any
) => ({
    emailForm: null,
    setEmailForm: ({ name, value }: any) =>
        set((state: any) => ({
            emailForm: {
                ...state.emailForm,
                [name]: value,
            },
        })),
    clearEmailForm: () => set({ emailForm: {} }),
    changeEmail: async () => {
        const r = await ax.post("/users/change_email", get().emailForm);
        return r.data;
    },
});

export const UseAccountAction = create<AccountActionType>((...a) => ({
    ...ChangeEmail(...a),
}));
5;
