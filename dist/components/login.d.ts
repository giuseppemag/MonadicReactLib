import { Option } from 'monadic_react';
export declare type LoginData<R> = {
    email: string;
    password: string;
    role: R;
};
export declare type ResetPasswordData<R> = {
    email: string;
    role: R;
};
export declare type ResetPasswordResult = "success" | "failure";
export declare type AuthState<U, R> = {
    kind: "login" | "requestreset" | "logout";
    loginState: LoginData<R>;
    resetState: ResetPasswordData<R>;
    user: Option<U>;
};
