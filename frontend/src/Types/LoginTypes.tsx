export type UseLoginType = {
    loginForm: LoginFormType;
    setLogin: any;
    loading: boolean;
    authenticate: any
}

export type LoginFormType = {
    email: string;
    password: string;
}

export type UseAuthType = {
    user: any;
    authenticate: any;
}

export type UserType = {
    email: string,
    name: string,
    password: string,
}