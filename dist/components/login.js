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
            function (ld) { return ld.resetState != null ? monadic_react_1.a("Forgot password?", null, null, false, "forgot_password")(__assign({}, ld, { kind: "requestreset" })) : monadic_react_1.unit(null).never(); },
            function (ld) { return ld.registerState != null ? monadic_react_1.a("Create an account", null, null, false, "register")(__assign({}, ld, { kind: "register" })) : monadic_react_1.unit(null).never(); }
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
            function (authS) { return inner_changePassword()({ password: "", newPassword: "", newPasswordConfirmation: "" }).then(undefined, function (changeData) {
                return monadic_react_1.button("Change password", false, "reset_button")(authS).then(undefined, function (authS) {
                    return changeApi(changeData).then(undefined, function (result) {
                        if (result == "failure") {
                            messageHandler("change_password_failed");
                            return monadic_react_1.unit(__assign({}, authS, { kind: "changepassword" }));
                        }
                        messageHandler("change_password_success");
                        return monadic_react_1.unit(__assign({}, authS, { kind: "loggedin" }));
                    });
                });
            }); }
        ]);
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9sb2dpbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtDQUEwSDtBQVUxSCxJQUFJLEtBQUssR0FBRyxVQUFnQixRQUFtRCxFQUFFLGNBQXlDO0lBQ3RILE1BQU0sQ0FBQyxVQUFDLGNBQW1DLElBQUssT0FBQSxVQUFDLEtBQVU7UUFDdkQsT0FBQSxtQkFBRyxDQUFtQyxZQUFZLENBQUMsQ0FBQztZQUNoRCxXQUFXLENBQU8sY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzlDLFVBQUEsRUFBRSxJQUFJLE9BQUEsc0JBQU0sQ0FBa0IsT0FBTyxFQUFFLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQUEsRUFBRTtnQkFDNUUsT0FBQSxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBQSxDQUFDO29CQUNyQyxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7b0JBQ3RELE1BQU0sQ0FBQyxvQkFBSSxjQUFzQixFQUFFLElBQUUsSUFBSSxFQUFFLENBQUMsSUFBRSxDQUFBO2dCQUNsRCxDQUFDLENBQUM7WUFIRixDQUdFLENBQUMsRUFKTCxDQUlLO1lBQ1gsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQUMsQ0FBa0Isa0JBQWtCLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUcsaUJBQWlCLENBQUMsY0FBTSxFQUFFLElBQUUsSUFBSSxFQUFFLGNBQWMsSUFBRSxDQUFDLENBQUMsQ0FBQyxvQkFB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