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
                : function (authState) { return monadic_react_1.unit(null).never(); },
            monadic_react_1.retract('inner_login_role')(function (authState) { return authState.loginState.role; }, function (authState) { return function (v) { return (__assign({}, authState, { loginState: __assign({}, authState.loginState, { role: v }) })); }; }, monadic_react_1.label("Role", true)(function (r) { return monadic_react_1.selector("dropdown", role_to_string)(roles, r); })),
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
            function (ld) { return monadic_react_1.a("Forgot password?")(__assign({}, ld, { kind: "requestreset" })); }
        ]);
    }; };
};
var resetPasswordRequest = function (resetApi, messageHandler) {
    return function (role_to_string) { return function (roles) {
        return monadic_react_1.any('requestreset_form')([
            inner_login(role_to_string)(roles)(false),
            function (ld) { return monadic_react_1.button("Request reset", false)(ld).then(undefined, function (ld) {
                return resetApi(ld.loginState).then(undefined, function (result) {
                    result == "success" ? messageHandler("reset_success") : messageHandler("reset_failed");
                    return monadic_react_1.unit(ld);
                });
            }); },
            function (ld) { return monadic_react_1.a("Back to login")(__assign({}, ld, { kind: "login" })); }
        ]);
    }; };
};
var logout = function (logoutApi, messageHandler) {
    return monadic_react_1.any()([
        function (ld) { return monadic_react_1.button("Logout", false)(ld).then(undefined, function (ld) { return logoutApi(ld.loginState); }).then(undefined, function (_) { return monadic_react_1.unit(__assign({}, ld, { kind: "login" })); }); }
    ]);
};
exports.Authenticate = function (loginApi, logoutApi, resetApi, messageHandler) {
    return function (role_to_string) { return function (roles) { return function (authState) {
        return monadic_react_1.repeat()(monadic_react_1.any()([
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