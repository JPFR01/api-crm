"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const http_helper_1 = require("./http-helper");
const errors_1 = require("../../../../v1/domain/shared/errors");
const Error_1 = require("../../../../v1/domain/shared/errors/Error");
const UnassignedError_1 = require("../../../../v1/domain/shared/errors/UnassignedError");
globals_1.jest.mock('@/v1/domain/shared/errors/Error', () => ({
    Error: globals_1.jest.fn(),
}));
(0, globals_1.describe)('v1 presentation helpers httpHelper', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('serverError()', () => {
        const errorResponse = {
            statusCode: 500,
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Unauthorized" com código padrão', () => {
            const error = new Error_1.Error(errors_1.ServerError);
            error.status = null;
            errorResponse.body = error;
            (0, globals_1.expect)((0, http_helper_1.serverError)(error)).toEqual(errorResponse);
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Unauthorized" com código padrão', () => {
            const error = new Error_1.Error(errors_1.ServerError);
            error.status = 500;
            errorResponse.body = error;
            (0, globals_1.expect)((0, http_helper_1.serverError)(error)).toEqual(errorResponse);
        });
    });
    (0, globals_1.describe)('notImplemented()', () => {
        const errorResponse = {
            statusCode: 501,
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Not Implemented" com código padrão', () => {
            const error = new Error_1.Error(errors_1.NotImplementedError);
            error.status = null;
            errorResponse.body = error;
            (0, globals_1.expect)((0, http_helper_1.notImplemented)(error)).toEqual(errorResponse);
        });
    });
    (0, globals_1.describe)('badRequest()', () => {
        const errorResponse = {
            statusCode: 400,
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Bad Request" com código padrão', () => {
            const error = new Error_1.Error(errors_1.InvalidAppVersionError);
            error.status = null;
            errorResponse.body = error;
            (0, globals_1.expect)((0, http_helper_1.badRequest)(error)).toEqual(errorResponse);
        });
    });
    (0, globals_1.describe)('preconditionFailed()', () => {
        const errorResponse = {
            statusCode: 412,
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Precondition" com código padrão', () => {
            const error = new Error_1.Error(errors_1.InvalidRefreshTokenError);
            error.status = null;
            errorResponse.body = error;
            (0, globals_1.expect)((0, http_helper_1.preconditionFailed)(error)).toEqual(errorResponse);
        });
    });
    (0, globals_1.describe)('unauthorized()', () => {
        const errorResponse = {
            statusCode: 401,
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Unauthorized" com código padrão', () => {
            const error = new Error_1.Error(errors_1.KeycloakTokenError);
            error.status = null;
            errorResponse.body = error;
            (0, globals_1.expect)((0, http_helper_1.unauthorized)(error)).toEqual(errorResponse);
        });
    });
    (0, globals_1.describe)('notFound()', () => {
        const errorResponse = {
            statusCode: 404,
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Not Found" com código padrão', () => {
            const error = new Error_1.Error(errors_1.NotFoundError);
            error.status = null;
            errorResponse.body = error;
            (0, globals_1.expect)((0, http_helper_1.notFound)(error)).toEqual(errorResponse);
        });
    });
    (0, globals_1.describe)('requestTimeout()', () => {
        const errorResponse = {
            statusCode: 408,
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Request Timeout" com código padrão', () => {
            const error = new Error_1.Error(errors_1.TimeoutConnectError);
            error.status = null;
            errorResponse.body = error;
            (0, globals_1.expect)((0, http_helper_1.requestTimeout)(error)).toEqual(errorResponse);
        });
    });
    (0, globals_1.describe)('forbidden()', () => {
        const errorResponse = {
            statusCode: 403,
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Forbidden" com código padrão', () => {
            const error = new Error_1.Error(Error_1.Error);
            error.status = null;
            errorResponse.body = error;
            (0, globals_1.expect)((0, http_helper_1.forbidden)(error)).toEqual(errorResponse);
        });
    });
    (0, globals_1.describe)('unassigned()', () => {
        const errorResponse = {
            statusCode: 430,
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Unassigned" com código padrão', () => {
            const error = new Error_1.Error(UnassignedError_1.UnassignedError);
            error.status = null;
            errorResponse.body = error;
            (0, globals_1.expect)((0, http_helper_1.unassigned)(error, 430)).toEqual(errorResponse);
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Unassigned" sem código padrão', () => {
            const error = new Error_1.Error(UnassignedError_1.UnassignedError);
            error.status = 430;
            errorResponse.body = error;
            (0, globals_1.expect)((0, http_helper_1.unassigned)(error, 430)).toEqual(errorResponse);
        });
    });
    (0, globals_1.describe)('noContent()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente uma resposta HTTP "No Content" com mensagem', () => {
            const request = 'fake-message';
            const response = {
                statusCode: 204,
                body: {
                    mensagem: request,
                },
            };
            const result = (0, http_helper_1.noContent)(request);
            (0, globals_1.expect)(result).toEqual(response);
            (0, globals_1.expect)(result).toEqual(globals_1.expect.objectContaining({
                statusCode: globals_1.expect.any(Number),
                body: globals_1.expect.any(Object),
            }));
        });
        (0, globals_1.it)('deve validar corretamente uma resposta HTTP "No Content" com mensagem', () => {
            const response = {
                statusCode: 204,
                body: {},
            };
            const result = (0, http_helper_1.noContent)();
            (0, globals_1.expect)(result).toEqual(response);
            (0, globals_1.expect)(result).toEqual(globals_1.expect.objectContaining({
                statusCode: globals_1.expect.any(Number),
                body: globals_1.expect.any(Object),
            }));
        });
    });
    (0, globals_1.describe)('created()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente uma resposta HTTP "Created" com mensagem', () => {
            const request = 'fake-message';
            const response = {
                statusCode: 201,
                body: { data: request },
            };
            const result = (0, http_helper_1.created)(request);
            (0, globals_1.expect)(result).toEqual(response);
            (0, globals_1.expect)(result).toEqual(globals_1.expect.objectContaining({
                statusCode: globals_1.expect.any(Number),
                body: globals_1.expect.any(Object),
            }));
        });
        (0, globals_1.it)('deve validar corretamente uma resposta HTTP "Created" sem mensagem', () => {
            const response = {
                statusCode: 201,
            };
            const result = (0, http_helper_1.created)();
            (0, globals_1.expect)(result).toEqual(response);
            (0, globals_1.expect)(result).toEqual(globals_1.expect.objectContaining({
                statusCode: globals_1.expect.any(Number),
            }));
        });
    });
    (0, globals_1.describe)('ok()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente uma resposta HTTP "Ok" com mensagem', () => {
            const request = 'fake-message';
            const response = {
                statusCode: 200,
                body: { data: request },
            };
            const result = (0, http_helper_1.ok)(request);
            (0, globals_1.expect)(result).toEqual(response);
            (0, globals_1.expect)(result).toEqual(globals_1.expect.objectContaining({
                statusCode: globals_1.expect.any(Number),
                body: globals_1.expect.any(Object),
            }));
        });
        (0, globals_1.it)('deve validar corretamente uma resposta HTTP "Ok" sem mensagem', () => {
            const request = '';
            const response = {
                statusCode: 200,
                body: {},
            };
            const result = (0, http_helper_1.ok)(request);
            (0, globals_1.expect)(result).toEqual(response);
            (0, globals_1.expect)(result).toEqual(globals_1.expect.objectContaining({
                statusCode: globals_1.expect.any(Number),
                body: globals_1.expect.any(Object),
            }));
        });
    });
});
