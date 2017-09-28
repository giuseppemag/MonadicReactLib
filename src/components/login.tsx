import { a, any, button, C, div, label, none, Option, repeat, retract, selector, string, some, unit } from 'monadic_react'

export type LoginData<R> = { email: string, password: string, role: R }
export type ResetPasswordData<R> = { email: string, role: R }
export type ResetPasswordResult = "success" | "failure"
export type AuthState<U, R> = { kind: "login" | "requestreset" | "logout", loginState: LoginData<R>, user: Option<U> }
export type AuthResult<U, R> = {role: R, user: Option<U>}

let inner_login = function <U, R>(role_to_string: (role: R) => string) : (roles: R[]) => (show_password: boolean) => (_: AuthState<U, R>) => C<AuthState<U, R>> {
    return (roles: R[]) => (show_password: boolean) =>
        repeat<AuthState<U, R>>("inner_login_repeat")(
            any<AuthState<U, R>, AuthState<U, R>>("inner_login_any")([
                retract<AuthState<U, R>, string>("email_retract")(authState => authState.loginState.email, authState => v => ({ ...authState, loginState: {...authState.loginState, email: v}}),
                    label<string, string>("Email", true, null, "email_label")(string("edit", "email", "email_input"))),

                show_password ?
                    retract<AuthState<U, R>, string>('password_retract')(authState => authState.loginState.password, authState => v => ({ ...authState, loginState: {...authState.loginState, password: v}}),
                        label<string, string>("Password", true, null, "password_label")(string("edit", "password", "password_input")))
                    : authState => unit(null).never("inner_login_password"),

                retract<AuthState<U, R>, R>('role_retract')(authState => authState.loginState.role, authState => v => ({ ...authState, loginState: {...authState.loginState, role: v}}),
                    label<R, R>("Role", true, null, "role_label")(r => selector<R>("dropdown", role_to_string, "role_selector")(roles, r))),
            ])
        )
}

let login = function <U, R>(loginApi: (loginData: LoginData<R>) => C<Option<U>>, messageHandler: (message: string) => void) : (role_To_string: (role: R) => string) => (roles: R[]) => (_: AuthState<U, R>) => C<AuthState<U, R>>{
    return (role_to_string: (role: R) => string) => (roles: R[]) =>
        any<AuthState<U, R>, AuthState<U, R>>('login_form')([
            inner_login<U, R>(role_to_string)(roles)(true),
            ld => button<AuthState<U, R>>("Login", false, "login_button")(ld).then(undefined, ld =>
                    loginApi(ld.loginState).then(undefined, u => {
                        u.kind == "none" ? messageHandler("login_failed") : ""
                        return unit<AuthState<U, R>>({...ld, user: u})
                    })),
            ld => a<AuthState<U, R>>("Forgot password?", null, null, false,  "forgot_password")({ ...ld, kind: "requestreset"})
        ])
}

let resetPasswordRequest = function <U, R>(resetApi: (loginData: LoginData<R>) => C<ResetPasswordResult>, messageHandler: (message: string) => void) : (role_To_string: (role: R) => string) => (roles: R[]) => (_: AuthState<U, R>)  => C<AuthState<U, R>>{
    return (role_to_string: (role: R) => string) => (roles: R[]) =>
        any<AuthState<U, R>, AuthState<U, R>>('requestreset_form')([
            inner_login<U, R>(role_to_string)(roles)(false),
            ld => button<AuthState<U, R>>("Request reset", false, "request_reset_button")(ld).then(undefined, ld =>
                resetApi(ld.loginState).then(undefined, result => {
                    result == "success" ? messageHandler("reset_success") : messageHandler("reset_failed")
                    return unit<AuthState<U, R>>(ld)
                })
            ),
            ld => a<AuthState<U, R>>("Back to login", null, null, false, "back_to_login")({ ...ld, kind: "login"})
        ])
}

let logout = function <U, R>(logoutApi: (loginData: LoginData<R>) => C<void>, messageHandler: (message: string) => void) : (_: AuthState<U, R>) => C<AuthState<U, R>> {
       return any<AuthState<U, R>, AuthState<U, R>>('logout_form')([
            ld => button<AuthState<U, R>>("Logout", false, "logout_button")(ld).then(undefined, ld => logoutApi(ld.loginState)).then(undefined, _ => unit<AuthState<U, R>>({...ld, kind: "login"}))
        ])
}

export let Authenticate = function <U, R>(loginApi: (loginData: LoginData<R>) => C<Option<U>>, logoutApi: (loginData: LoginData<R>) => C<void>, resetApi: (loginData: LoginData<R>) => C<ResetPasswordResult>, messageHandler: (message: string) => void) {
    return (role_to_string: (role: R) => string) => (roles: R[]) => (authState: AuthState<U, R>): C<AuthResult<U, R>> =>
        repeat<AuthState<U, R>>('authenticate')(
            any<AuthState<U, R>, AuthState<U, R>>('authenticate_wrapper')([
                ld =>
                    ld.kind == "login" ?
                        login<U, R>(loginApi, messageHandler)(role_to_string)(roles)(ld)
                    : ld.kind == "logout" ?
                        logout<U, R>(logoutApi, messageHandler)(ld)
                    :
                        resetPasswordRequest<U, R>(resetApi, messageHandler)(role_to_string)(roles)(ld)
            ])
        )(authState).filter(s => s.kind != "requestreset" && s.kind != "logout").map((f) => {return {role: f.loginState.role, user: f.user}})
}