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
const LoginController_1 = require("./LoginController");
const HttpResponseHelperModule = __importStar(require("../../../../../../v1/presentation/helpers/httpResponseHelper"));
const httpResponseHelper_1 = require("../../../../../../v1/presentation/helpers/httpResponseHelper");
const errors_1 = require("../../../../../../v1/domain/shared/errors");
const axios_1 = require("axios");
globals_1.jest.mock('@/main/factories/repository/logger/LoggerFactory', () => ({
    LoggerFactory: () => ({
        error: globals_1.jest.fn(),
    }),
}));
const login = {
    validate: globals_1.jest.fn(),
    login: globals_1.jest.fn(),
};
const logger = {
    info: globals_1.jest.fn(),
};
(0, globals_1.describe)('V1 presentation controllers authentication', () => {
    (0, globals_1.describe)('login LoginController', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.describe)('handle()', () => {
            let controller;
            const requestMock = {
                body: {
                    usernameOrEmail: 'user@example.com',
                    password: 'password',
                },
            };
            const responseMock = {
                accessToken: 'fake-token',
                expiresIn: 100,
                refreshExpiresIn: 200,
                refreshToken: 'fake-token',
                tokenType: 'Bearer fake-token',
                givenName: 'fake-given',
                familyName: 'fake-family',
            };
            (0, globals_1.beforeEach)(() => {
                globals_1.jest.clearAllMocks();
                controller = new LoginController_1.LoginController(login, logger);
            });
            (0, globals_1.afterAll)(() => {
                globals_1.jest.clearAllMocks();
            });
            (0, globals_1.it)('deve ocorrer erro ao fazer login', async () => {
                const errorMock = {
                    statusCode: 400,
                    body: {
                        error: 'Invalid param',
                    },
                };
                globals_1.jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                globals_1.jest.spyOn(controller['login'], 'validate').mockRejectedValueOnce(errors_1.InvalidParamError);
                globals_1.jest.spyOn(HttpResponseHelperModule, 'httpResponseHelper').mockReturnValueOnce(errorMock);
                const response = await controller.handle(requestMock);
                (0, globals_1.expect)(response.statusCode).toBe(axios_1.HttpStatusCode.BadRequest);
                (0, globals_1.expect)(response.body).toEqual({ error: 'Invalid param' });
                (0, globals_1.expect)(controller['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                    origem: globals_1.expect.any(String),
                    versao: globals_1.expect.any(String),
                    destino: globals_1.expect.any(String),
                    classe: globals_1.expect.any(String),
                    body: {
                        body: {
                            usernameOrEmail: requestMock.body.usernameOrEmail,
                            password: requestMock.body.password,
                        },
                    },
                }));
                (0, globals_1.expect)(login.validate).toHaveBeenCalledWith(globals_1.expect.any(Object));
                (0, globals_1.expect)(httpResponseHelper_1.httpResponseHelper).toHaveBeenCalledTimes(1);
            });
            (0, globals_1.it)('deve chamar o Login com os valores corretos', async () => {
                globals_1.jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                globals_1.jest.spyOn(controller['login'], 'validate').mockResolvedValueOnce(null);
                globals_1.jest.spyOn(controller['login'], 'login').mockResolvedValueOnce(responseMock);
                globals_1.jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                const response = await controller.handle(requestMock);
                (0, globals_1.expect)(response.statusCode).toBe(axios_1.HttpStatusCode.Ok);
                (0, globals_1.expect)(response.body).toEqual({ data: responseMock });
                (0, globals_1.expect)(controller['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                    origem: globals_1.expect.any(String),
                    versao: globals_1.expect.any(String),
                    destino: globals_1.expect.any(String),
                    classe: globals_1.expect.any(String),
                    body: {
                        body: {
                            usernameOrEmail: requestMock.body.usernameOrEmail,
                            password: requestMock.body.password,
                        },
                    },
                }));
                (0, globals_1.expect)(login.validate).toHaveBeenCalledWith(globals_1.expect.any(Object));
                (0, globals_1.expect)(login.login).toHaveBeenCalledWith(globals_1.expect.any(Object));
                (0, globals_1.expect)(controller['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                    origem: globals_1.expect.any(String),
                    versao: globals_1.expect.any(String),
                    destino: globals_1.expect.any(String),
                    classe: globals_1.expect.any(String),
                    body: {
                        body: {
                            usernameOrEmail: requestMock.body.usernameOrEmail,
                            password: requestMock.body.password,
                        },
                    },
                    response: {
                        accessToken: responseMock.accessToken,
                        expiresIn: responseMock.expiresIn,
                        refreshExpiresIn: responseMock.refreshExpiresIn,
                        refreshToken: responseMock.refreshToken,
                        tokenType: responseMock.tokenType,
                        givenName: responseMock.givenName,
                        familyName: responseMock.familyName,
                    },
                    status: globals_1.expect.any(Number),
                }));
            });
        });
    });
});
