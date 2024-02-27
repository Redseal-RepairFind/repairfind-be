"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ServiceUnavailableError = exports.ForbiddenError = exports.UnAuthorizedError = exports.BadRequestError = void 0;
var CustomError = /** @class */ (function (_super) {
    __extends(CustomError, _super);
    function CustomError(message, code, name) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, CustomError.prototype);
        _this.code = code;
        _this.isOperational = true;
        _this.message = message;
        _this.name = name || 'error';
        return _this;
    }
    return CustomError;
}(Error));
exports.default = CustomError;
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(msg) {
        var _this = _super.call(this, msg || 'BadRequestError', 400) || this;
        _this.name = 'BadRequestError';
        return _this;
    }
    return BadRequestError;
}(CustomError));
exports.BadRequestError = BadRequestError;
var UnAuthorizedError = /** @class */ (function (_super) {
    __extends(UnAuthorizedError, _super);
    function UnAuthorizedError(msg) {
        var _this = _super.call(this, msg || 'UnAuthorized', 401) || this;
        _this.name = 'UnAuthorizedError';
        return _this;
    }
    return UnAuthorizedError;
}(CustomError));
exports.UnAuthorizedError = UnAuthorizedError;
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(msg) {
        var _this = _super.call(this, msg || 'Forbidden', 403) || this;
        _this.name = 'ForbiddenError';
        return _this;
    }
    return ForbiddenError;
}(CustomError));
exports.ForbiddenError = ForbiddenError;
var ServiceUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(msg) {
        var _this = _super.call(this, msg || 'Service Unavailable', 503) || this;
        _this.name = 'ServiceUnavailableError';
        return _this;
    }
    return ServiceUnavailableError;
}(CustomError));
exports.ServiceUnavailableError = ServiceUnavailableError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(msg) {
        var _this = _super.call(this, msg || 'NotFoundError', 404) || this;
        _this.name = 'NotFoundError';
        return _this;
    }
    return NotFoundError;
}(CustomError));
exports.NotFoundError = NotFoundError;
