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
var Authenticate = function (loginApi, logoutApi, resetApi, messageHandler) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9sb2dpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0NBQTBIO0FBTzFILElBQUksV0FBVyxHQUFHLFVBQWdCLGNBQW1DO0lBQ2pFLE1BQU0sQ0FBQyxVQUFDLEtBQVUsSUFBSyxPQUFBLFVBQUMsYUFBc0I7UUFDMUMsT0FBQSxzQkFBTSxDQUFrQixhQUFhLENBQUMsQ0FDbEMsbUJBQUcsRUFBb0MsQ0FBQztZQUNwQyx1QkFBTyxDQUEwQixtQkFBbUIsQ0FBQyxDQUFDLFVBQUEsU0FBUyxJQUFJLE9BQUEsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQTFCLENBQTBCLEVBQUUsVUFBQSxTQUFTLElBQUksT0FBQSxVQUFBLENBQUMsSUFBSSxPQUFBLGNBQU0sU0FBUyxJQUFFLFVBQVUsZUFBTSxTQUFTLENBQUMsVUFBVSxJQUFFLEtBQUssRUFBRSxDQUFDLE9BQUcsRUFBbEUsQ0FBa0UsRUFBdkUsQ0FBdUUsRUFDL0sscUJBQUssQ0FBaUIsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLHNCQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBRWpGLGFBQWE7Z0JBQ1QsdUJBQU8sQ0FBMEIsc0JBQXNCLENBQUMsQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUE3QixDQUE2QixFQUFFLFVBQUEsU0FBUyxJQUFJLE9BQUEsVUFBQSxDQUFDLElBQUksT0FBQSxjQUFNLFNBQVMsSUFBRSxVQUFVLGVBQU0sU0FBUyxDQUFDLFVBQVUsSUFBRSxRQUFRLEVBQUUsQ0FBQyxPQUFHLEVBQXJFLENBQXFFLEVBQTFFLENBQTBFLEVBQ3hMLHFCQUFLLENBQWlCLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxzQkFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVB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