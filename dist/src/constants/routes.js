"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACL = exports.AppRoutes = exports.Versions = void 0;
var Versions;
(function (Versions) {
    Versions["v2"] = "/api/v2";
})(Versions || (exports.Versions = Versions = {}));
var AppRoutes;
(function (AppRoutes) {
    AppRoutes["home"] = "/";
    AppRoutes["health"] = "/health";
    AppRoutes["docs"] = "/docs";
})(AppRoutes || (exports.AppRoutes = AppRoutes = {}));
var ACL;
(function (ACL) {
    ACL["BRAND"] = "BRAND";
    ACL["CUSTOMER"] = "CUSTOMER";
    ACL["GUEST_OR_USER"] = "GUEST_OR_USER";
})(ACL || (exports.ACL = ACL = {}));
