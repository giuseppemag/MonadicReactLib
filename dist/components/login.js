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
            function (ld) { return monadic_react_1.a("Forgot password?", null, null, false, "forgot_password")(__assign({}, ld, { kind: "requestreset" })); },
            function (ld) { return monadic_react_1.a("Create an account", null, null, false, "register")(__assign({}, ld, { kind: "register" })); }
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
var changePassword = function (changeApi, messageHandler) {
    return function (role_to_string) {
        return monadic_react_1.any('reset_form')([
            function (authS) { return inner_changePassword(role_to_string)({ password: "", newPassword: "", newPasswordConfirmation: "" }).then(undefined, function (changeData) {
                return monadic_react_1.button("Change password", false, "reset_button")(authS).then(undefined, function (authS) {
                    return changeApi(changeData).then(undefined, function (result) {
                        if (result == "failure") {
                            messageHandler("reset_failed");
                            return monadic_react_1.unit(__assign({}, authS, { kind: "changepassword" }));
                        }
                        messageHandler("reset_success");
                        return monadic_react_1.unit(__assign({}, authS, { kind: "loggedin" }));
                    });
                });
            }); }
        ]);
    };
};
var inner_changePassword = function (role_to_string) {
    return monadic_react_1.repeat("inner_change-repeat")(monadic_react_1.any("inner_change-any")([
        monadic_react_1.retract("old_password_retract")(function (changeData) { return changeData.password; }, function (changeData) { return function (v) { return (__assign({}, changeData, { password: v })); }; }, monadic_react_1.label("Old Password", true, null, "old_password_label")(monadic_react_1.string("edit", "password", "old_password_input"))),
        monadic_react_1.retract("new_password_retract")(function (changeData) { return changeData.newPassword; }, function (changeData) { return function (v) { return (__assign({}, changeData, { newPassword: v })); }; }, monadic_react_1.label("New Password", true, null, "new_password_label")(monadic_react_1.string("edit", "password", "new_password_input"))),
        monadic_react_1.retract("new_password_confirm_retract")(function (changeData) { return changeData.newPasswordConfirmation; }, function (changeData) { return function (v) { return (__assign({}, changeData, { newPasswordConfirmation: v })); }; }, monadic_react_1.label("Confirm password", true, null, "new_password_confirm_label")(monadic_react_1.string("edit", "password", "new_password_confirm_input"))),
    ]));
};
var loggedin = function (logoutApi, messageHandler) {
    return monadic_react_1.any('logout_form')([
        function (ld) { return monadic_react_1.a("Logout", null, "nofollow", false, "logout_link")(ld).then("logout_api_call", function (ld) { return logoutApi(ld.loginState); }).then(undefined, function (_) { return monadic_react_1.unit(__assign({}, ld, { kind: "login", user: monadic_react_1.none() })); }); },
        function (ld) { return monadic_react_1.a("Change password", null, "nofollow", false, "change_password_link")(ld).then("change_password_kind", function (_) { return monadic_react_1.unit(__assign({}, ld, { kind: "changepassword" })); }); }
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
exports.Authenticate = function (loginApi, logoutApi, registerApi, requestResetApi, resetApi, changeApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (authState) {
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
        ]))(authState).filter(function (s) { return s.kind != "requestreset" && s.kind != "loggedin"; }).map(function (f) { return { role: f.loginState.role, user: f.user }; });
    }; }; };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9sb2dpbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtDQUEwSDtBQVUxSCxJQUFJLEtBQUssR0FBRyxVQUFnQixRQUFtRCxFQUFFLGNBQXlDO0lBQ3RILE1BQU0sQ0FBQyxVQUFDLGNBQW1DLElBQUssT0FBQSxVQUFDLEtBQVU7UUFDdkQsT0FBQSxtQkFBRyxDQUFtQyxZQUFZLENBQUMsQ0FBQztZQUNoRCxXQUFXLENBQU8sY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzlDLFVBQUEsRUFBRSxJQUFJLE9BQUEsc0JBQU0sQ0FBa0IsT0FBTyxFQUFFLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQUEsRUFBRTtnQkFDNUUsT0FBQSxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBQSxDQUFDO29CQUNyQyxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7b0JBQ3RELE1BQU0sQ0FBQyxvQkFBSSxjQUFzQixFQUFFLElBQUUsSUFBSSxFQUFFLENBQUMsSUFBRSxDQUFBO2dCQUNsRCxDQUFDLENBQUM7WUFIRixDQUdFLENBQUMsRUFKTCxDQUlLO1lBQ1gsVUFBQSxFQUFFLElBQUksT0FBQSxpQkFBQyxDQUFrQixrQkFBa0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRyxpQkFBaUIsQ0FBQyxjQUFNLEVBQUUsSUFBRSxJQUFJLEVBQUUsY0FBYyxJQUFFLEVBQTdHLENBQTZHO1lBQ25ILFVBQUEsRUFBRSxJQUFJLE9BQUEsaUJBQUMsQ0FBa0IsbUJBQW1CLEVB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