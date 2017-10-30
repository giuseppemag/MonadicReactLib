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
    return function (role_to_string) { return function (roles) { return function (initAuthState) {
        return monadic_react_1.repeat()(monadic_react_1.any('login_form')([
            inner_login(role_to_string)(roles)(true),
            function (ld) { return monadic_react_1.button("Login", false, "login_button")(ld).then(undefined, function (ld) {
                return loginApi(ld.loginState).then(undefined, function (u) {
                    if (u.kind == "none") {
                        messageHandler("login_failed");
                        return monadic_react_1.unit(ld);
                    }
                    return monadic_react_1.unit(__assign({}, ld, { user: u, kind: "loggedin" }));
                });
            }); },
            function (ld) { return ld.resetState != null ? monadic_react_1.a("Forgot password?", null, null, false, "forgot_password")(__assign({}, ld, { kind: "requestreset" })) : monadic_react_1.unit(null).never(); },
            function (ld) { return ld.registerState != null ? monadic_react_1.a("Create an account", null, null, false, "register")(__assign({}, ld, { kind: "register" })) : monadic_react_1.unit(null).never(); }
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; });
    }; }; };
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
    return function (role_to_string) { return function (roles) { return function (initAuthState) {
        return monadic_react_1.repeat()(monadic_react_1.any('requestreset_form')([
            inner_login(role_to_string)(roles)(false),
            function (ld) { return monadic_react_1.button("Request reset", false, "request_reset_button")(ld).then(undefined, function (ld) {
                return requestResetApi(ld.loginState).then(undefined, function (result) {
                    result == "success" ? messageHandler("reset_success") : messageHandler("reset_failed");
                    return monadic_react_1.unit(ld);
                });
            }); },
            function (ld) { return monadic_react_1.a("Back to login", null, null, false, "back_to_login")(__assign({}, ld, { kind: "login" })); }
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; });
    }; }; };
};
var resetPassword = function (resetApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (initAuthState) {
        return monadic_react_1.repeat()(monadic_react_1.any('reset_form')([
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
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; });
    }; }; };
};
var inner_resetPassword = function (role_to_string) {
    return function (roles) {
        return monadic_react_1.repeat("inner_reset_repeat")(monadic_react_1.any("inner_reset_any")([
            monadic_react_1.retract("new_password_retract")(function (authState) { return authState.resetState.new_password; }, function (authState) { return function (v) { return (__assign({}, authState, { resetState: __assign({}, authState.resetState, { new_password: v }) })); }; }, monadic_react_1.label("Password", true, null, "new_password_label")(monadic_react_1.string("edit", "password", "new_password_input"))),
            monadic_react_1.retract("new_password_confirm_retract")(function (authState) { return authState.resetState.new_password_confirm; }, function (authState) { return function (v) { return (__assign({}, authState, { resetState: __assign({}, authState.resetState, { new_password_confirm: v }) })); }; }, monadic_react_1.label("Confirm password", true, null, "new_password_confirm_label")(monadic_react_1.string("edit", "password", "new_password_confirm_input"))),
        ]));
    };
};
var changePassword = function (changeApi, messageHandler) {
    return function (role_to_string) { return function (initAuthState) {
        return monadic_react_1.repeat()(monadic_react_1.any('reset_form')([
            function (authS) { return inner_changePassword()({ password: "", newPassword: "", newPasswordConfirmation: "" }).then(undefined, function (changeData) {
                return monadic_react_1.button("Change password", false, "reset_button")(authS).then(undefined, function (authS) {
                    return changeApi(changeData).then(undefined, function (result) {
                        if (result == "failure") {
                            messageHandler("change_password_failed");
                            return monadic_react_1.unit(authS);
                        }
                        messageHandler("change_password_success");
                        return monadic_react_1.unit(__assign({}, authS, { kind: "loggedin" }));
                    });
                });
            }); }
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; });
    }; };
};
var inner_changePassword = function () {
    return monadic_react_1.repeat("inner_change-repeat")(monadic_react_1.any("inner_change-any")([
        monadic_react_1.retract("old_password_retract")(function (changeData) { return changeData.password; }, function (changeData) { return function (v) { return (__assign({}, changeData, { password: v })); }; }, monadic_react_1.label("Old Password", true, null, "old_password_label")(monadic_react_1.string("edit", "password", "old_password_input"))),
        monadic_react_1.retract("new_password_retract")(function (changeData) { return changeData.newPassword; }, function (changeData) { return function (v) { return (__assign({}, changeData, { newPassword: v })); }; }, monadic_react_1.label("New Password", true, null, "new_password_label")(monadic_react_1.string("edit", "password", "new_password_input"))),
        monadic_react_1.retract("new_password_confirm_retract")(function (changeData) { return changeData.newPasswordConfirmation; }, function (changeData) { return function (v) { return (__assign({}, changeData, { newPasswordConfirmation: v })); }; }, monadic_react_1.label("Confirm password", true, null, "new_password_confirm_label")(monadic_react_1.string("edit", "password", "new_password_confirm_input"))),
    ]));
};
var loggedin = function (logoutApi, messageHandler) {
    return monadic_react_1.any('logout_form')([
        function (ld) { return monadic_react_1.a("Logout", null, "nofollow", false, "logout_link")(ld).then("logout_api_call", function (ld) { return logoutApi(ld.loginState); }).then(undefined, function (_) {
            return monadic_react_1.unit(__assign({}, ld, { kind: "login", user: monadic_react_1.none(), loginState: { email: null, password: null, role: null } }));
        }); },
        function (ld) { return monadic_react_1.a("Change password", null, "nofollow", false, "change_password_link")(ld).then("change_password_kind", function (_) { return monadic_react_1.unit(__assign({}, ld, { kind: "changepassword" })); }); }
    ]);
};
var register = function (registerApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (initAuthState) {
        return monadic_react_1.repeat()(monadic_react_1.any('register_form')([
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
            }); },
            function (ld) { return monadic_react_1.a("Back to login", null, null, false, "back_to_login")(__assign({}, ld, { kind: "login" })); }
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; });
    }; }; };
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
exports.Authenticate = function (loginApi, logoutApi, registerApi, requestResetApi, resetApi, changeApi, messageHandler) {
    return function (role_to_string) { return function (roles) {
        return monadic_react_1.repeat('authenticate')(monadic_react_1.any('authenticate_wrapper')([
            function (ld) {
                return ld.kind == "login" ?
                    login(loginApi, messageHandler)(role_to_string)(roles)(ld)
                    : ld.kind == "loggedin" ?
                        loggedin(logoutApi, messageHandler)(ld)
                        : ld.kind == "requestreset" ?
                            resetPasswordRequest(requestResetApi, messageHandler)(role_to_string)(roles)(ld)
                            : ld.kind == "reset" ?
                                resetPassword(resetApi, messageHandler)(role_to_string)(roles)(ld)
                                : ld.kind == "changepassword" ?
                                    changePassword(changeApi, messageHandler)(role_to_string)(ld)
                                    : register(registerApi, messageHandler)(role_to_string)(roles)(ld);
            }
        ]));
    }; };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9sb2dpbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtDQUEwSDtBQVUxSCxJQUFJLEtBQUssR0FBRyxVQUFnQixRQUFtRCxFQUFFLGNBQXlDO0lBQ3RILE1BQU0sQ0FBQyxVQUFDLGNBQW1DLElBQUssT0FBQSxVQUFDLEtBQVUsSUFBSyxPQUFBLFVBQUEsYUFBYTtRQUN6RSxPQUFBLHNCQUFNLEVBQW1CLENBQ3JCLG1CQUFHLENBQW1DLFlBQVksQ0FBQyxDQUFDO1lBQ2hELFdBQVcsQ0FBTyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDOUMsVUFBQSxFQUFFLElBQUksT0FBQSxzQkFBTSxDQUFrQixPQUFPLEVBQUUsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBQSxFQUFFO2dCQUM1RSxPQUFBLFFBQVEsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFBLENBQUM7b0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDbkIsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFBO3dCQUM5QixNQUFNLENBQUMsb0JBQUksQ0FBa0IsRUFBRSxDQUFDLENBQUE7b0JBQ3BDLENBQUM7b0JBRUQsTUFBTSxDQUFDLG9CQUFJLGNBQXNCLEVBQUUsSUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLElBQUUsQ0FBQTtnQkFDcEUsQ0FBQyxDQUFDO1lBUEYsQ0FPRSxDQUFDLEVBUkwsQ0FRSztZQUNYLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFD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