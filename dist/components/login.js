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
var inner_resetPassword = function (role_to_string) {
    return function (roles) {
        return monadic_react_1.repeat("inner_reset_repeat")(monadic_react_1.any("inner_reset_any")([
            monadic_react_1.retract("new_password_retract")(function (authState) { return authState.resetState.new_password; }, function (authState) { return function (v) { return (__assign({}, authState, { resetState: __assign({}, authState.resetState, { new_password: v }) })); }; }, monadic_react_1.label("Password", true, null, "new_password_label")(monadic_react_1.string("edit", "password", "new_password_input"))),
            monadic_react_1.retract("new_password_confirm_retract")(function (authState) { return authState.resetState.new_password_confirm; }, function (authState) { return function (v) { return (__assign({}, authState, { resetState: __assign({}, authState.resetState, { new_password_confirm: v }) })); }; }, monadic_react_1.label("Confirm password", true, null, "new_password_confirm_label")(monadic_react_1.string("edit", "password", "new_password_confirm_input"))),
        ]));
    };
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
var logout = function (logoutApi, messageHandler) {
    return monadic_react_1.any('logout_form')([
        function (ld) { return monadic_react_1.button("Logout", false, "logout_button")(ld).then(undefined, function (ld) { return logoutApi(ld.loginState); }).then(undefined, function (_) { return monadic_react_1.unit(__assign({}, ld, { kind: "login" })); }); }
    ]);
};
exports.Authenticate = function (loginApi, logoutApi, requestResetApi, resetApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (authState) {
        return monadic_react_1.repeat('authenticate')(monadic_react_1.any('authenticate_wrapper')([
            function (ld) {
                return ld.kind == "login" ?
                    login(loginApi, messageHandler)(role_to_string)(roles)(ld)
                    : ld.kind == "logout" ?
                        logout(logoutApi, messageHandler)(ld)
                        : ld.kind == "requestreset" ?
                            resetPasswordRequest(requestResetApi, messageHandler)(role_to_string)(roles)(ld)
                            : resetPassword(resetApi, messageHandler)(role_to_string)(roles)(ld);
            }
        ]))(authState).filter(function (s) { return s.kind != "requestreset" && s.kind != "logout"; }).map(function (f) { return { role: f.loginState.role, user: f.user }; });
    }; }; };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9sb2dpbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtDQUEwSDtBQVExSCxJQUFJLFdBQVcsR0FBRyxVQUFnQixjQUFtQztJQUNqRSxNQUFNLENBQUMsVUFBQyxLQUFVLElBQUssT0FBQSxVQUFDLGFBQXNCO1FBQzFDLE9BQUEsc0JBQU0sQ0FBa0Isb0JBQW9CLENBQUMsQ0FDekMsbUJBQUcsQ0FBbUMsaUJBQWlCLENBQUMsQ0FBQztZQUNyRCx1QkFBTyxDQUEwQixlQUFlLENBQUMsQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUExQixDQUEwQixFQUFFLFVBQUEsU0FBUyxJQUFJLE9BQUEsVUFBQSxDQUFDLElBQUksT0FBQSxjQUFNLFNBQVMsSUFBRSxVQUFVLGVBQU0sU0FBUyxDQUFDLFVBQVUsSUFBRSxLQUFLLEVBQUUsQ0FBQyxPQUFHLEVBQWxFLENBQWtFLEVBQXZFLENBQXVFLEVBQzNLLHFCQUFLLENBQWlCLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDLHNCQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBRXRHLGFBQWE7Z0JBQ1QsdUJBQU8sQ0FBMEIsa0JBQWtCLENBQUMsQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUE3QixDQUE2QixFQUFFLFVBQUEsU0FBUyxJQUFJLE9BQUEsVUFBQSxDQUFDLElBQUksT0FBQSxjQUFNLFNBQVMsSUFBRSxVQUFVLGVBQU0sU0FBUyxDQUFDLFVBQVUsSUFBRSxRQUFRLEVBQUUsQ0FBQyxPQUFHLEVBQXJFLENBQXFFLEVBQTFFLENBQTBFLEVBQ3BMLHFCQUFLLENBQWlCLFVBQVUsRUFBRSxJQUFJLEVBQUUs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