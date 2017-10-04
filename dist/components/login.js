"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var monadic_react_1 = require("monadic_react");
var login = function (loginApi, messageHandler) {
    return function (role_to_string) { return function (roles) {
        return monadic_react_1.any('login_form')([
            inner_login(role_to_string)(roles)(true),
            function (ld) { return monadic_react_1.button("Login", false, "login_button")(ld).then(undefined, function (ld) {
                return loginApi(ld.loginState).then(undefined, function (u) {
                    u.kind == "none" ? messageHandler("login_failed") : "";
                    return monadic_react_1.unit(__assign({}, ld, { user: u }));
                });
            }); },
            function (ld) { return monadic_react_1.a("Forgot password?", null, null, false, "forgot_password")(__assign({}, ld, { kind: "requestreset" })); }
        ]);
    }; };
};
var inner_login = function (role_to_string) {
    return function (roles) { return function (show_password) {
        return monadic_react_1.repeat("inner_login_repeat")(monadic_react_1.any("inner_login_any")([
            monadic_react_1.retract("email_retract")(function (authState) { return authState.loginState.email; }, function (authState) { return function (v) { return (__assign({}, authState, { loginState: __assign({}, authState.loginState, { email: v }) })); }; }, monadic_react_1.label("Email", true, null, "email_label")(monadic_react_1.string("edit", "email", "email_input"))),
            show_password ?
                monadic_react_1.retract('password_retract')(function (authState) { return authState.loginState.password; }, function (authState) { return function (v) { return (__assign({}, authState, { loginState: __assign({}, authState.loginState, { password: v }) })); }; }, monadic_react_1.label("Password", true, null, "password_label")(monadic_react_1.string("edit", "password", "password_input")))
                : function (authState) { return monadic_react_1.unit(null).never("inner_login_password"); },
            monadic_react_1.retract('role_retract')(function (authState) { return authState.loginState.role; }, function (authState) { return function (v) { return (__assign({}, authState, { loginState: __assign({}, authState.loginState, { role: v }) })); }; }, monadic_react_1.label("Role", true, null, "role_label")(function (r) { return monadic_react_1.selector("dropdown", role_to_string, "role_selector")(roles, r); })),
        ]));
    }; };
};
var resetPasswordRequest = function (requestResetApi, messageHandler) {
    return function (role_to_string) { return function (roles) {
        return monadic_react_1.any('requestreset_form')([
            inner_login(role_to_string)(roles)(false),
            function (ld) { return monadic_react_1.button("Request reset", false, "request_reset_button")(ld).then(undefined, function (ld) {
                return requestResetApi(ld.loginState).then(undefined, function (result) {
                    result == "success" ? messageHandler("reset_success") : messageHandler("reset_failed");
                    return monadic_react_1.unit(ld);
                });
            }); },
            function (ld) { return monadic_react_1.a("Back to login", null, null, false, "back_to_login")(__assign({}, ld, { kind: "login" })); }
        ]);
    }; };
};
var resetPassword = function (resetApi, messageHandler) {
    return function (role_to_string) { return function (roles) {
        return monadic_react_1.any('reset_form')([
            inner_resetPassword(role_to_string)(roles),
            function (ld) { return monadic_react_1.button("Change password", false, "reset_button")(ld).then(undefined, function (ld) {
                return resetApi(ld.resetState).then(undefined, function (result) {
                    if (result == "failure") {
                        messageHandler("reset_failed");
                        return monadic_react_1.unit(__assign({}, ld, { kind: "reset" }));
                    }
                    messageHandler("reset_success");
                    return monadic_react_1.unit(__assign({}, ld, { kind: "login" }));
                });
            }); },
        ]);
    }; };
};
var inner_resetPassword = function (role_to_string) {
    return function (roles) {
        return monadic_react_1.repeat("inner_reset_repeat")(monadic_react_1.any("inner_reset_any")([
            monadic_react_1.retract("new_password_retract")(function (authState) { return authState.resetState.new_password; }, function (authState) { return function (v) { return (__assign({}, authState, { resetState: __assign({}, authState.resetState, { new_password: v }) })); }; }, monadic_react_1.label("Password", true, null, "new_password_label")(monadic_react_1.string("edit", "password", "new_password_input"))),
            monadic_react_1.retract("new_password_confirm_retract")(function (authState) { return authState.resetState.new_password_confirm; }, function (authState) { return function (v) { return (__assign({}, authState, { resetState: __assign({}, authState.resetState, { new_password_confirm: v }) })); }; }, monadic_react_1.label("Confirm password", true, null, "new_password_confirm_label")(monadic_react_1.string("edit", "password", "new_password_confirm_input"))),
        ]));
    };
};
var logout = function (logoutApi, messageHandler) {
    return monadic_react_1.any('logout_form')([
        function (ld) { return monadic_react_1.button("Logout", false, "logout_button")(ld).then(undefined, function (ld) { return logoutApi(ld.loginState); }).then(undefined, function (_) { return monadic_react_1.unit(__assign({}, ld, { kind: "login" })); }); }
    ]);
};
var register = function (registerApi, messageHandler) {
    return function (role_to_string) { return function (roles) {
        return monadic_react_1.any('register_form')([
            inner_register(role_to_string)(roles),
            function (ld) { return monadic_react_1.button("Register", false, "register_button")(ld).then(undefined, function (ld) {
                return registerApi(ld.registerState).then(undefined, function (result) {
                    if (result == "failure") {
                        messageHandler("register_failed");
                        return monadic_react_1.unit(__assign({}, ld, { kind: "register" }));
                    }
                    messageHandler("register_success");
                    return monadic_react_1.unit(__assign({}, ld, { kind: "login" }));
                });
            }); }
        ]);
    }; };
};
var inner_register = function (role_to_string) {
    return function (roles) {
        return monadic_react_1.repeat("inner_register_repeat")(monadic_react_1.any("inner_register_any")([
            monadic_react_1.retract("username_retract")(function (authState) { return authState.registerState.username; }, function (authState) { return function (v) { return (__assign({}, authState, { registerState: __assign({}, authState.registerState, { username: v }) })); }; }, monadic_react_1.label("Username", true, null, "username_label")(monadic_react_1.string("edit", "text", "username_input"))),
            monadic_react_1.retract("email_retract")(function (authState) { return authState.registerState.email; }, function (authState) { return function (v) { return (__assign({}, authState, { registerState: __assign({}, authState.registerState, { email: v }) })); }; }, monadic_react_1.label("Email", true, null, "email_label")(monadic_react_1.string("edit", "email", "email_input"))),
            monadic_react_1.retract("emailconfirm_retract")(function (authState) { return authState.registerState.emailConfirmation; }, function (authState) { return function (v) { return (__assign({}, authState, { registerState: __assign({}, authState.registerState, { emailConfirmation: v }) })); }; }, monadic_react_1.label("Confirm email", true, null, "emailconfirm_label")(monadic_react_1.string("edit", "email", "emailconfirm_input"))),
            monadic_react_1.retract("password_retract")(function (authState) { return authState.registerState.password; }, function (authState) { return function (v) { return (__assign({}, authState, { registerState: __assign({}, authState.registerState, { password: v }) })); }; }, monadic_react_1.label("Password", true, null, "password_label")(monadic_react_1.string("edit", "password", "password_input"))),
            monadic_react_1.retract("passwordConfirm_retract")(function (authState) { return authState.registerState.passwordConfirmation; }, function (authState) { return function (v) { return (__assign({}, authState, { registerState: __assign({}, authState.registerState, { passwordConfirmation: v }) })); }; }, monadic_react_1.label("Confirm password", true, null, "passwordConfirm_label")(monadic_react_1.string("edit", "password", "passwordConfirm_input"))),
            monadic_react_1.retract('role_retract')(function (authState) { return authState.registerState.role; }, function (authState) { return function (v) { return (__assign({}, authState, { registerState: __assign({}, authState.registerState, { role: v }) })); }; }, monadic_react_1.label("Role", true, null, "role_label")(function (r) { return monadic_react_1.selector("dropdown", role_to_string, "role_selector")(roles, r); })),
        ]));
    };
};
exports.Authenticate = function (loginApi, logoutApi, registerApi, requestResetApi, resetApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (authState) {
        return monadic_react_1.repeat('authenticate')(monadic_react_1.any('authenticate_wrapper')([
            function (ld) {
                return ld.kind == "login" ?
                    login(loginApi, messageHandler)(role_to_string)(roles)(ld)
                    : ld.kind == "logout" ?
                        logout(logoutApi, messageHandler)(ld)
                        : ld.kind == "requestreset" ?
                            resetPasswordRequest(requestResetApi, messageHandler)(role_to_string)(roles)(ld)
                            : ld.kind == "reset" ?
                                resetPassword(resetApi, messageHandler)(role_to_string)(roles)(ld)
                                : register(registerApi, messageHandler)(role_to_string)(roles)(ld);
            }
        ]))(authState).filter(function (s) { return s.kind != "requestreset" && s.kind != "logout"; }).map(function (f) { return { role: f.loginState.role, user: f.user }; });
    }; }; };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9sb2dpbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtDQUEwSDtBQVMxSCxJQUFJLEtBQUssR0FBRyxVQUFnQixRQUFtRCxFQUFFLGNBQXlDO0lBQ3RILE1BQU0sQ0FBQyxVQUFDLGNBQW1DLElBQUssT0FBQSxVQUFDLEtBQVU7UUFDdkQsT0FBQSxtQkFBRyxDQUFtQyxZQUFZLENBQUMsQ0FBQztZQUNoRCxXQUFXLENBQU8sY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzlDLFVBQUEsRUFBRSxJQUFJLE9BQUEsc0JBQU0sQ0FBa0IsT0FBTyxFQUFFLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQUEsRUFBRTtnQkFDNUUsT0FBQSxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBQSxDQUFDO29CQUNyQyxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7b0JBQ3RELE1BQU0sQ0FBQyxvQkFBSSxjQUFzQixFQUFFLElBQUUsSUFBSSxFQUFFLENBQUMsSUFBRSxDQUFBO2dCQUNsRCxDQUFDLENBQUM7WUFIRixDQUdFLENBQUMsRUFKTCxDQUlLO1lBQ1gsVUFBQSxFQUFFLElBQUksT0FBQSxpQkFBQyxDQUFrQixrQkFBa0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRyxpQkFBaUIsQ0FBQyxjQUFNLEVBQUUsSUFBRSxJQUFJLEVBQUUsY0FBYyxJQUFFLEVBQTdHLENBQTZHO1NBQ3RILENBQUM7SUFSRixDQVFFLEVBVDBDLENBUzFDLENBQUE7QUFDVixDQUFD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