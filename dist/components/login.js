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
        return monadic_react_1.repeat('login_repeat')(monadic_react_1.any('login_form')([
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
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; }, 'login_filter');
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
        return monadic_react_1.repeat('requestreset_repeat')(monadic_react_1.any('requestreset_form')([
            inner_login(role_to_string)(roles)(false),
            function (ld) { return monadic_react_1.button("Request reset", false, "request_reset_button")(ld).then(undefined, function (ld) {
                return requestResetApi(ld.loginState).then(undefined, function (result) {
                    result == "success" ? messageHandler("request_reset_success") : messageHandler("request_reset_failed");
                    return monadic_react_1.unit(ld);
                });
            }); },
            function (ld) { return monadic_react_1.a("Back to login", null, null, false, "back_to_login")(__assign({}, ld, { kind: "login" })); }
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; }, 'resetpasswordrequest_filter');
    }; }; };
};
var resetPassword = function (resetApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (initAuthState) {
        return monadic_react_1.repeat('resetpassword_repeat')(monadic_react_1.any('reset_form')([
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
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; }, 'resetpassword_filter');
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
        return monadic_react_1.repeat('changepassword_repeat')(monadic_react_1.any('reset_form')([
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
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; }, 'changepassword_filter');
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
            return monadic_react_1.unit(__assign({}, ld, { kind: "login", user: monadic_react_1.none(), loginState: { email: "", password: "", role: null } }));
        }); },
        function (ld) { return monadic_react_1.a("Change password", null, "nofollow", false, "change_password_link")(ld).then("change_password_kind", function (_) { return monadic_react_1.unit(__assign({}, ld, { kind: "changepassword" })); }); }
    ]);
};
var register = function (registerApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (initAuthState) {
        return monadic_react_1.repeat('register_repeat')(monadic_react_1.any('register_form')([
            inner_register(role_to_string)(roles),
            function (ld) { return monadic_react_1.button("Register", false, "register_button")(ld).then(undefined, function (ld) {
                return registerApi(ld.registerState).then(undefined, function (result) {
                    if (result.status == "failure") {
                        messageHandler("register_failed");
                        return monadic_react_1.unit(__assign({}, ld, { kind: "register" }));
                    }
                    messageHandler("register_success");
                    return monadic_react_1.unit(__assign({}, ld, { kind: "login", user: result.user }));
                });
            }); },
            function (ld) { return monadic_react_1.a("Back to login", null, null, false, "back_to_login")(__assign({}, ld, { kind: "login" })); }
        ]))(initAuthState).filter(function (newState) { return initAuthState.kind != newState.kind; }, 'register_filter');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9sb2dpbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtDQUEwSDtBQVcxSCxJQUFJLEtBQUssR0FBRyxVQUFnQixRQUFtRCxFQUFFLGNBQXlDO0lBQ3RILE1BQU0sQ0FBQyxVQUFDLGNBQW1DLElBQUssT0FBQSxVQUFDLEtBQVUsSUFBSyxPQUFBLFVBQUEsYUFBYTtRQUN6RSxPQUFBLHNCQUFNLENBQWtCLGNBQWMsQ0FBQyxDQUNuQyxtQkFBRyxDQUFtQyxZQUFZLENBQUMsQ0FBQztZQUNoRCxXQUFXLENBQU8sY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzlDLFVBQUEsRUFBRSxJQUFJLE9BQUEsc0JBQU0sQ0FBa0IsT0FBTyxFQUFFLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQUEsRUFBRTtnQkFDNUUsT0FBQSxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBQSxDQUFDO29CQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ25CLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQTt3QkFDOUIsTUFBTSxDQUFDLG9CQUFJLENBQWtCLEVBQUUsQ0FBQyxDQUFBO29CQUNwQyxDQUFDO29CQUVELE1BQU0sQ0FBQyxvQkFBSSxjQUFzQixFQUFFLElBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxJQUFFLENBQUE7Z0JBQ3BFLENBQUMsQ0FBQztZQVBGLENBT0UsQ0FBQyxFQVJMLENBUUs7WUFDWCxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMs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