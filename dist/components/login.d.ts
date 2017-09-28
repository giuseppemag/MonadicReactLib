import { C, Option } from 'monadic_react';
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
    user: Option<U>;
};
export declare type AuthResult<U, R> = {
    role: R;
    user: Option<U>;
};
export declare let Authenticate: <U, R>(loginApi: (loginData: LoginData<R>) => C<Option<U>>, logoutApi: (loginData: LoginData<R>) => C<void>, resetApi: (loginData: LoginData<R>) => C<ResetPasswordResult>, messageHandler: (message: string) => void) => (role_to_string: (role: R) => string) => (roles: R[]) => (authState: AuthState<U, R>) => C<AuthResult<U, R>>;
