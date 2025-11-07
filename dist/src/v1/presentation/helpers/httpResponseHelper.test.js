"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const HttpHelper = __importStar(require("./http-helper"));
const FormatUtils = __importStar(require("../../application/helpers/FormatUtils"));
const httpResponseHelper_1 = require("./httpResponseHelper");
const errors_1 = require("../../../../v1/domain/shared/errors");
const UnassignedError_1 = require("../../../../v1/domain/shared/errors/UnassignedError");
globals_1.jest.mock('@/main/factories/repository/logger/LoggerFactory', () => ({
    LoggerFactory: () => ({
        error: globals_1.jest.fn(),
    }),
}));
globals_1.jest.mock('@/v1/domain/shared/errors/Error', () => ({
    Error: globals_1.jest.fn(),
}));
(0, globals_1.describe)('v1 presentation helpers httpResponseHelper', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('errorValidator()', () => {
        const errorHttp = {
            body: {
                error: '',
            },
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Unauthorized"', () => {
            const errorUnauthorized = {
                ...errorHttp,
                statusCode: 401,
            };
            const jsonWebTokenError = new errors_1.JsonWebTokenError();
            const authenticationError = new errors_1.AuthenticationError();
            const expiredJwtError = new errors_1.ExpiredJwtError();
            const permissionError = new errors_1.PermissionError();
            const keycloakTokenError = new errors_1.KeycloakTokenError();
            globals_1.jest.spyOn(HttpHelper, 'unauthorized').mockReturnValue(errorUnauthorized);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(jsonWebTokenError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorUnauthorized);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(authenticationError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorUnauthorized);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(expiredJwtError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorUnauthorized);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(permissionError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorUnauthorized);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(keycloakTokenError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorUnauthorized);
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Bad Request"', () => {
            const errorBadRequest = {
                ...errorHttp,
                statusCode: 400,
            };
            const invalidAppVersionError = new errors_1.InvalidAppVersionError();
            const invalidParamError = new errors_1.InvalidParamError();
            globals_1.jest.spyOn(HttpHelper, 'badRequest').mockReturnValue(errorBadRequest);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(invalidAppVersionError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorBadRequest);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(invalidParamError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorBadRequest);
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Timeout"', () => {
            const errorTimeout = {
                ...errorHttp,
                statusCode: 408,
            };
            const timeoutConnectError = new errors_1.TimeoutConnectError();
            globals_1.jest.spyOn(HttpHelper, 'requestTimeout').mockReturnValue(errorTimeout);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(timeoutConnectError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorTimeout);
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Precondition Failed"', () => {
            const errorPreconditionFailed = {
                ...errorHttp,
                statusCode: 412,
            };
            const invalidRefreshTokenError = new errors_1.InvalidRefreshTokenError();
            const invalidHeaderError = new errors_1.InvalidHeaderError();
            globals_1.jest.spyOn(HttpHelper, 'preconditionFailed').mockReturnValue(errorPreconditionFailed);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(invalidRefreshTokenError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorPreconditionFailed);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(invalidHeaderError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorPreconditionFailed);
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Unassigned"', () => {
            const errorUnassigned = {
                ...errorHttp,
                statusCode: 430,
            };
            const unassignedError = new UnassignedError_1.UnassignedError('fake-stack', '430', 'Unassigned Error');
            globals_1.jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValue('430');
            globals_1.jest.spyOn(HttpHelper, 'unassigned').mockReturnValue(errorUnassigned);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(unassignedError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorUnassigned);
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Not Found"', () => {
            const errorNotFound = {
                ...errorHttp,
                statusCode: 404,
            };
            const notFoundError = new errors_1.NotFoundError();
            globals_1.jest.spyOn(HttpHelper, 'notFound').mockReturnValue(errorNotFound);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(notFoundError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorNotFound);
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Not Implemented"', () => {
            const errorNotImplemented = {
                ...errorHttp,
                statusCode: 501,
            };
            const notImplementedError = new errors_1.NotImplementedError();
            globals_1.jest.spyOn(HttpHelper, 'notImplemented').mockReturnValue(errorNotImplemented);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(notImplementedError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorNotImplemented);
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Server Error"', () => {
            const errorServerError = {
                ...errorHttp,
                statusCode: 500,
            };
            const serverError = new errors_1.ServerError();
            globals_1.jest.spyOn(HttpHelper, 'serverError').mockReturnValue(errorServerError);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(serverError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorServerError);
        });
        (0, globals_1.it)('deve validar corretamente um erro HTTP "Server Error" com log', () => {
            const dadosSimples = 'fake-value';
            const dadosBody = {
                body: 'fake-body',
            };
            const dadosData = {
                data: 'fake-data',
            };
            const errorServerError = {
                ...errorHttp,
                statusCode: 500,
            };
            const serverError = new errors_1.ServerError();
            globals_1.jest.spyOn(HttpHelper, 'serverError').mockReturnValue(errorServerError);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(serverError, dadosSimples, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorServerError);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(serverError, dadosBody, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorServerError);
            (0, globals_1.expect)((0, httpResponseHelper_1.httpResponseHelper)(serverError, dadosData, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorServerError);
        });
    });
});
