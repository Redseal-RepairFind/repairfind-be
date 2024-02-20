import {NextFunction, Request, Response} from 'express';

interface DTO {
    [key: string]: string | [] | object | boolean | number;
}

/**  Overall, this abstract class provides some useful constants and
 methods that can be used in the subclass to simplify the handling of HTTP
 requests and responses.*/

abstract class AbstractBase {
    protected readonly req: Request;
    protected readonly res: Response;
    protected readonly next: NextFunction;

    constructor(req: Request, res: Response, next: NextFunction) {
        this.req = req;
        this.res = res;
        this.next = next;
    }

    /** fot static methods */
    protected static readonly SUCCESS_CODE = 200;
    protected static readonly CREATED_CODE: 201 = 201;
    protected static readonly NOT_FOUND_CODE: 404 = 404;
    protected static readonly BAD_REQUEST_CODE: 400 = 400;
    protected static readonly NOT_PROCESSABLE_ENTITY_CODE: 422 = 422;

    /** readonly messages */
    protected static readonly SUCCESS_STATUS: boolean = true;
    protected static readonly SUCCESS_MSG: string = 'success';
    protected static readonly NOT_FOUND_ERROR: string = 'not_found_error';
    protected static readonly BAD_REQUEST_ERROR: string = 'bad_request_error';
    protected static readonly NOT_FOUND_ERROR_MSG: string = 'resource not found';
    protected static readonly BAD_REQUEST_MSG: string = 'bad request';
    static readonly NOT_PROCESSABLE_ENTITY_ERROR = 'not_processable_entity';

    /** for controllers */
    protected readonly STATUS_CODE_OK: 200 = 200;
    protected readonly STATUS_CODE_CREATED: 201 = 201;
    protected readonly STATUS_CODE_NO_CONTENT: 204 = 204;
    protected readonly STATUS_CODE_NOT_FOUND: 404 = 404;
    protected readonly STATUS_CODE_BAD_REQ: 400 = 400;

    /**messages */
    protected readonly SUCCESS_MSG: string = 'success';
    protected readonly NOT_FOUND_RESOURCE_MSG: string = 'resource not found';
    protected readonly INTERNAL_SERVER_ERROR_MSG: string = 'internal server error';

    protected HttpResponse(response: any): Response {
        /** create data transfer object check for the data coming */
        const dto: DTO = {
            success: response.success,
            // status: response.status,
            message: response.message,
            data: response.data
        };

        if (Array.isArray(response.data)) dto.results = response.data.length;
        if (response.accessToken) {
            dto.accessToken = response.accessToken
        }
        if (response.refreshToken) {
            dto.refreshToken = response.refreshToken
        }
        /**return response*/
        return this.res.status(response.status).json(dto);
    }
}

export const Base = AbstractBase;
