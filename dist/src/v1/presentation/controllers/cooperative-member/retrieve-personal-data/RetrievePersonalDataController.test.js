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
const RetrievePersonalDataController_1 = require("./RetrievePersonalDataController");
const HttpResponseHelperModule = __importStar(require("../../../../../../v1/presentation/helpers/httpResponseHelper"));
const httpResponseHelper_1 = require("../../../../../../v1/presentation/helpers/httpResponseHelper");
const HttpHelper = __importStar(require("../../../../../../v1/presentation/helpers/http-helper"));
const errors_1 = require("../../../../../../v1/domain/shared/errors");
const axios_1 = require("axios");
globals_1.jest.mock('@/main/factories/repository/logger/LoggerFactory', () => ({
    LoggerFactory: () => ({
        error: globals_1.jest.fn(),
    }),
}));
const personalData = {
    validate: globals_1.jest.fn(),
    retrieve: globals_1.jest.fn(),
};
const logger = {
    info: globals_1.jest.fn(),
};
(0, globals_1.describe)('v1 presentation controllers cooperative-member', () => {
    (0, globals_1.describe)('retrieve-personal-data RetrievePersonalDataController', () => {
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
                    cpfUsuario: '123.456.789-01',
                },
                headers: {
                    'device-id': 'fake-device-id',
                    'app-version': 'fake-app-version',
                    token: 'fake-token',
                    refreshToken: 'fake-refresh-token',
                },
            };
            const responseMock = {
                codigoMatricula: 123456,
                cpfUsuario: '123.456.789-01',
                nomeUsuario: 'user',
                fotoUsuario: 'fake-imagem',
                codigoLocalAcerto: 100,
                nomeLocalAcerto: 'fake-local-acerto',
                dataAdmissao: new Date(),
            };
            (0, globals_1.beforeEach)(() => {
                globals_1.jest.clearAllMocks();
                controller = new RetrievePersonalDataController_1.RetrievePersonalDataController(personalData, logger);
            });
            (0, globals_1.afterAll)(() => {
                globals_1.jest.clearAllMocks();
            });
            (0, globals_1.it)('deve ocorrer erro ao buscar dados de cooperado', async () => {
                const errorMock = {
                    statusCode: axios_1.HttpStatusCode.BadRequest,
                    body: {
                        error: 'Invalid param',
                    },
                };
                globals_1.jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                globals_1.jest.spyOn(controller['personalData'], 'validate').mockRejectedValueOnce(errors_1.InvalidParamError);
                globals_1.jest.spyOn(HttpResponseHelperModule, 'httpResponseHelper').mockReturnValueOnce(errorMock);
                const response = await controller.handle(requestMock);
                (0, globals_1.expect)(response.statusCode).toBe(axios_1.HttpStatusCode.BadRequest);
                (0, globals_1.expect)(controller['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                    origem: globals_1.expect.any(String),
                    versao: globals_1.expect.any(String),
                    destino: globals_1.expect.any(String),
                    classe: globals_1.expect.any(String),
                    headerLog: globals_1.expect.any(Object),
                    body: {
                        cpfUsuario: requestMock.body.cpfUsuario,
                        header: globals_1.expect.any(Object),
                    },
                }));
                (0, globals_1.expect)(personalData.validate).toHaveBeenCalledWith(globals_1.expect.any(Object));
                (0, globals_1.expect)(httpResponseHelper_1.httpResponseHelper).toHaveBeenCalledTimes(1);
            });
            (0, globals_1.it)('deve atualizar a edição de foto com sucesso', async () => {
                globals_1.jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                globals_1.jest.spyOn(controller['personalData'], 'validate').mockResolvedValueOnce(null);
                globals_1.jest.spyOn(controller['personalData'], 'retrieve').mockResolvedValueOnce(responseMock);
                globals_1.jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                globals_1.jest.spyOn(HttpHelper, 'noContent').mockReturnValueOnce({
                    statusCode: axios_1.HttpStatusCode.Ok,
                    body: responseMock,
                });
                const response = await controller.handle(requestMock);
                (0, globals_1.expect)(response.statusCode).toBe(axios_1.HttpStatusCode.Ok);
                (0, globals_1.expect)(response.body).toEqual({ data: responseMock });
                (0, globals_1.expect)(controller['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                    origem: globals_1.expect.any(String),
                    versao: globals_1.expect.any(String),
                    destino: globals_1.expect.any(String),
                    classe: globals_1.expect.any(String),
                    headerLog: globals_1.expect.any(Object),
                    body: {
                        cpfUsuario: requestMock.body.cpfUsuario,
                        header: globals_1.expect.any(Object),
                    },
                }));
                (0, globals_1.expect)(personalData.validate).toHaveBeenCalledWith(globals_1.expect.any(Object));
                (0, globals_1.expect)(personalData.retrieve).toHaveBeenCalledWith(globals_1.expect.any(Object));
                (0, globals_1.expect)(controller['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                    origem: globals_1.expect.any(String),
                    versao: globals_1.expect.any(String),
                    destino: globals_1.expect.any(String),
                    classe: globals_1.expect.any(String),
                    body: {
                        cpfUsuario: requestMock.body.cpfUsuario,
                        header: globals_1.expect.any(Object),
                    },
                    response: {
                        codigoMatricula: responseMock.codigoMatricula,
                        cpfUsuario: responseMock.cpfUsuario,
                        nomeUsuario: responseMock.nomeUsuario,
                        fotoUsuario: responseMock.fotoUsuario,
                        codigoLocalAcerto: responseMock.codigoLocalAcerto,
                        nomeLocalAcerto: responseMock.nomeLocalAcerto,
                        dataAdmissao: responseMock.dataAdmissao,
                    },
                    status: globals_1.expect.any(Number),
                }));
            });
        });
    });
});
