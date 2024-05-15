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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.InternalServerError = exports.NotFoundError = exports.ServiceUnavailableError = exports.ForbiddenError = exports.UnAuthorizedError = exports.BadRequestError = void 0;
var logger_1 = require("./logger");
var CustomError = /** @class */ (function (_super) {
    __extends(CustomError, _super);
    function CustomError(message, code, type, error) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, CustomError.prototype);
        _this.code = code;
        _this.isOperational = true;
        _this.message = message;
        _this.type = type || 'error';
        _this.error = error || new Error;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return CustomError;
}(Error));
exports.default = CustomError;
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message, error) {
        return _super.call(this, message || 'Bad Request', 400, 'BadRequestError', error) || this;
    }
    return BadRequestError;
}(CustomError));
exports.BadRequestError = BadRequestError;
var UnAuthorizedError = /** @class */ (function (_super) {
    __extends(UnAuthorizedError, _super);
    function UnAuthorizedError(message, error) {
        return _super.call(this, message || 'Unauthorized', 401, 'UnAuthorizedError', error) || this;
    }
    return UnAuthorizedError;
}(CustomError));
exports.UnAuthorizedError = UnAuthorizedError;
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message, error) {
        return _super.call(this, message || 'Forbidden', 403, 'ForbiddenError', error) || this;
    }
    return ForbiddenError;
}(CustomError));
exports.ForbiddenError = ForbiddenError;
var ServiceUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(message, error) {
        return _super.call(this, message || 'Service Unavailable', 503, 'ServiceUnavailableError', error) || this;
    }
    return ServiceUnavailableError;
}(CustomError));
exports.ServiceUnavailableError = ServiceUnavailableError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message, error) {
        return _super.call(this, message || 'Not Found', 404, 'NotFoundError', error) || this;
    }
    return NotFoundError;
}(CustomError));
exports.NotFoundError = NotFoundError;
var InternalServerError = /** @class */ (function (_super) {
    __extends(InternalServerError, _super);
    function InternalServerError(message, error) {
        return _super.call(this, message || 'Internal Server Error', 500, 'InternalServerError', error) || this;
    }
    return InternalServerError;
}(CustomError));
exports.InternalServerError = InternalServerError;
function errorHandler(err, req, res, next) {
    logger_1.Logger.error(err);
    // Default status code and error message
    var statusCode = err.code || 500;
    var errorMessage = err.message || 'Internal Server Error';
    // Send JSON response with error details
    if (process.env.APN_ENV === "development") {
        return res.status(statusCode).json(__assign(__assign({ success: false, message: errorMessage }, err.error), { stack: err.stack }));
    }
    else {
        if (err.error.name === "CastError")
            errorMessage = "Invalid ".concat(err.error.path, ": ").concat(JSON.stringify(err.error.value), ".");
        if (err.error.code === 11000) {
            var value = err.error.message.match(/(["'])(\\?.)*?\1/)[0];
            errorMessage = "field value:".concat(value, " aleady exist. please use another");
        }
        if (err.error.name === "ValidationError") {
            var errors = Object.values(err.error.errors).map(function (el) { return el.message; });
            errorMessage = "Invalid input data. ".concat(errors.join(". "));
        }
        return res.status(statusCode).json({ success: false, message: errorMessage });
    }
    return res.status(statusCode).json({ success: false, message: errorMessage });
}
exports.errorHandler = errorHandler;
