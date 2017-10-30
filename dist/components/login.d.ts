import { C, Option } from 'monadic_react';
export declare type LoginData<R> = {
    email: string;
    password: string;
    role: R;
};
export declare type ResetData<R> = {
    new_password: string;
    new_password_confirm: string;
    role: R;
    token: string;
};
export declare type RegisterData<R> = {
    username: string;
    email: string;
    emailConfirmation: string;
    password: string;
    passwordConfirmation: string;
    role: R;
};
export declare type ChangeData = {
    password: string;
    newPassword: string;
    newPasswordConfirmation: string;
};
export declare type ApiResult = "success" | "failure";
export declare type AuthState<U, R> = {
    kind: "login" | "requestreset" | "reset" | "register" | "changepassword" | "loggedin";
    loginState: LoginData<R>;
    resetState: ResetData<R>;
    registerState: RegisterData<R>;
    user: Option<U>;
};
export declare type AuthResult<U, R> = {
    role: R;
    user: Option<U>;
};
export declare let Authenticate: <U, R>(loginApi: (loginData: LoginData<R>) => C<Option<U>>, logoutApi: (loginData: LoginData<R>) => C<void>, registerApi: (registerData: RegisterData<R>) => C<ApiResult>, requestResetApi: (loginData: LoginData<R>) => C<ApiResult>, resetApi: (resetData: ResetData<R>) => C<ApiResult>, changeApi: (changeData: ChangeData) => C<ApiResult>, messageHandler: (message: string) => void) => (role_to_string: (role: R) => string) => (roles: R[]) => (_: AuthState<U, R>) => C<AuthState<U, R>>;
