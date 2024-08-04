"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
/**  Overall, this abstract class provides some useful constants and
 methods that can be used in the subclass to simplify the handling of HTTP
 requests and responses.*/
var AbstractBase = /** @class */ (function () {
    function AbstractBase(req, res, next) {
        /** for controllers */
        this.STATUS_CODE_OK = 200;
        this.STATUS_CODE_CREATED = 201;
        this.STATUS_CODE_NO_CONTENT = 204;
        this.STATUS_CODE_NOT_FOUND = 404;
        this.STATUS_CODE_BAD_REQ = 400;
        /**messages */
        this.SUCCESS_MSG = 'success';
        this.NOT_FOUND_RESOURCE_MSG = 'resource not found';
        this.INTERNAL_SERVER_ERROR_MSG = 'internal server error';
        this.req = req;
        this.res = res;
        this.next = next;
    }
    AbstractBase.prototype.HttpResponse = function (response) {
        /** create data transfer object check for the data coming */
        var dto = {
            success: response.success,
            // status: response.status,
            message: response.message,
            data: response.data
        };
        if (Array.isArray(response.data))
            dto.results = response.data.length;
        if (response.accessToken) {
            dto.accessToken = response.accessToken;
        }
        if (response.refreshToken) {
            dto.refreshToken = response.refreshToken;
        }
        /**return response*/
        return this.res.status(response.status).json(dto);
    };
    /** fot static methods */
    AbstractBase.SUCCESS_CODE = 200;
    AbstractBase.CREATED_CODE = 201;
    AbstractBase.NOT_FOUND_CODE = 404;
    AbstractBase.BAD_REQUEST_CODE = 400;
    AbstractBase.NOT_PROCESSABLE_ENTITY_CODE = 422;
    /** readonly messages */
    AbstractBase.SUCCESS_STATUS = true;
    AbstractBase.SUCCESS_MSG = 'success';
    AbstractBase.NOT_FOUND_ERROR = 'not_found_error';
    AbstractBase.BAD_REQUEST_ERROR = 'bad_request_error';
    AbstractBase.NOT_FOUND_ERROR_MSG = 'resource not found';
    AbstractBase.BAD_REQUEST_MSG = 'bad request';
    AbstractBase.NOT_PROCESSABLE_ENTITY_ERROR = 'not_processable_entity';
    return AbstractBase;
}());
exports.Base = AbstractBase;
