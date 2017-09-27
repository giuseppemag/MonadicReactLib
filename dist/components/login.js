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
        return monadic_react_1.repeat("inner_login")(monadic_react_1.any()([
            monadic_react_1.retract("inner_login_email")(function (authState) { return authState.loginState.email; }, function (authState) { return function (v) { return (__assign({}, authState, { loginState: __assign({}, authState.loginState, { email: v }) })); }; }, monadic_react_1.label("Email", true)(monadic_react_1.string("edit", "email", "email_input"))),
            show_password ?
                monadic_react_1.retract('inner_login_password')(function (authState) { return authState.loginState.password; }, function (authState) { return function (v) { return (__assign({}, authState, { loginState: __assign({}, authState.loginState, { password: v }) })); }; }, monadic_react_1.label("Password", true)(monadic_react_1.string("edit", "password", "password_input")))
                : function (authState) { return monadic_react_1.unit(null).never("inner_login_password"); },
            monadic_react_1.retract('inner_login_role')(function (authState) { return authState.loginState.role; }, function (authState) { return function (v) { return (__assign({}, authState, { loginState: __assign({}, authState.loginState, { role: v }) })); }; }, monadic_react_1.label("Role", true)(function (r) { return monadic_react_1.selector("dropdown", role_to_string, "role_selector")(roles, r); })),
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
var resetPasswordRequest = function (resetApi, messageHandler) {
    return function (role_to_string) { return function (roles) {
        return monadic_react_1.any('requestreset_form')([
            inner_login(role_to_string)(roles)(false),
            function (ld) { return monadic_react_1.button("Request reset", false, "request_reset_button")(ld).then(undefined, function (ld) {
                return resetApi(ld.loginState).then(undefined, function (result) {
                    result == "success" ? messageHandler("reset_success") : messageHandler("reset_failed");
                    return monadic_react_1.unit(ld);
                });
            }); },
            function (ld) { return monadic_react_1.a("Back to login", null, null, false, "back_to_login")(__assign({}, ld, { kind: "login" })); }
        ]);
    }; };
};
var logout = function (logoutApi, messageHandler) {
    return monadic_react_1.any('logout_form')([
        function (ld) { return monadic_react_1.button("Logout", false, "logout_button")(ld).then(undefined, function (ld) { return logoutApi(ld.loginState); }).then(undefined, function (_) { return monadic_react_1.unit(__assign({}, ld, { kind: "login" })); }); }
    ]);
};
exports.Authenticate = function (loginApi, logoutApi, resetApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (authState) {
        return monadic_react_1.repeat('authenticate')(monadic_react_1.any('authenticate_wrapper')([
            function (ld) {
                return ld.kind == "login" ?
                    login(loginApi, messageHandler)(role_to_string)(roles)(ld)
                    : ld.kind == "logout" ?
                        logout(logoutApi, messageHandler)(ld)
                        :
                            resetPasswordRequest(resetApi, messageHandler)(role_to_string)(roles)(ld);
            }
        ]))(authState).filter(function (s) { return s.kind != "requestreset" && s.kind != "logout"; }).map(function (f) { return f.user; });
    }; }; };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9sb2dpbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtDQUEwSDtBQU8xSCxJQUFJLFdBQVcsR0FBRyxVQUFnQixjQUFtQztJQUNqRSxNQUFNLENBQUMsVUFBQyxLQUFVLElBQUssT0FBQSxVQUFDLGFBQXNCO1FBQzFDLE9BQUEsc0JBQU0sQ0FBa0IsYUFBYSxDQUFDLENBQ2xDLG1CQUFHLEVBQW9DLENBQUM7WUFDcEMsdUJBQU8sQ0FBMEIsbUJBQW1CLENBQUMsQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUExQixDQUEwQixFQUFFLFVBQUEsU0FBUyxJQUFJLE9BQUEsVUFBQSxDQUFDLElBQUksT0FBQSxjQUFNLFNBQVMsSUFBRSxVQUFVLGVBQU0sU0FBUyxDQUFDLFVBQVUsSUFBRSxLQUFLLEVBQUUsQ0FBQyxPQUFHLEVBQWxFLENBQWtFLEVBQXZFLENBQXVFLEVBQy9LLHFCQUFLLENBQWlCLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxzQkFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUVqRixhQUFhO2dCQUNULHVCQUFPLENBQTBCLHNCQUFzQixDQUFDLENBQUMsVUFBQSxTQUFTLElBQUksT0FBQSxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBN0IsQ0FBNkIsRUFBRSxVQUFBLFNBQVMsSUFBSSxPQUFBLFVBQUEsQ0FBQyxJQUFJLE9BQUEsY0FBTSxTQUFTLElBQUUsVUFBVSxlQUFNLFNBQVMsQ0FBQyxVQUFVLElBQUUsUUFBUSxFQUFFLENBQUMsT0FBRyxFQUFyRSxDQUFxRSxFQUExRSxDQUEwRSxFQUN4TCxxQkFBSyxDQUFpQixVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsc0JBQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxF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