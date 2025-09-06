import ax from "@/Axios";
import { create, type StateCreator } from "zustand";

type EmailType = {
    emailForm: any;
    setEmailForm: any;
    changeEmail: () => any;
    clearEmailForm: () => any;
};

type PasswordType = {
    passwordForm: any;
    setPasswordForm: any;
    changePassword: () => any;
    clearPasswordForm: () => any;
};

export const ChangeEmail: StateCreator<EmailType> = (set: any, get: any) => ({
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

export const ChangePassword: StateCreator<any> = (set: any, get: any) => ({
    passwordForm: null,
    setPasswordForm: ({ name, value }: any) =>
        set((state: any) => ({
            passwordForm: {
                ...state.passwordForm,
                [name]: value,
            },
        })),
    changePassword: async () => {
        const r = await ax.post("/users/change_password", get().passwordForm);
        return r.data;
    },
});

export const UseAccountAction = create<EmailType & PasswordType>((...a) => ({
    ...ChangeEmail(...a),
    ...ChangePassword(...a),
}));
5;
