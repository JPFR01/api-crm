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
const PhotoUpdate_1 = require("./PhotoUpdate");
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
const photoUpdate = {
    validate: globals_1.jest.fn(),
    update: globals_1.jest.fn(),
};
const logger = {
    info: globals_1.jest.fn(),
};
(0, globals_1.describe)('V1 presentation controllers cooperative-member', () => {
    (0, globals_1.describe)('photo-update PhotoUpdateController', () => {
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
                    imagemPerfil: 'fake-imagem',
                },
                headers: {
                    'device-id': 'fake-device-id',
                    'app-version': 'fake-app-version',
                    token: 'fake-token',
                    refreshToken: 'fake-refresh-token',
                },
            };
            const responseMock = {
                statusCode: axios_1.HttpStatusCode.NoContent,
                body: {},
            };
            (0, globals_1.beforeEach)(() => {
                globals_1.jest.clearAllMocks();
                controller = new PhotoUpdate_1.PhotoUpdateController(photoUpdate, logger);
            });
            (0, globals_1.afterAll)(() => {
                globals_1.jest.clearAllMocks();
            });
            (0, globals_1.it)('deve ocorrer erro ao atualizar foto', async () => {
                const errorMock = {
                    statusCode: axios_1.HttpStatusCode.BadRequest,
                    body: {
                        error: 'Invalid param',
                    },
                };
                globals_1.jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                globals_1.jest.spyOn(controller['photoUpdate'], 'validate').mockRejectedValueOnce(errors_1.InvalidParamError);
                globals_1.jest.spyOn(HttpResponseHelperModule, 'httpResponseHelper').mockReturnValueOnce(errorMock);
                const response = await controller.handle(requestMock);
                (0, globals_1.expect)(response.statusCode).toBe(axios_1.HttpStatusCode.BadRequest);
                (0, globals_1.expect)(controller['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                    origem: globals_1.expect.any(String),
                    versao: globals_1.expect.any(String),
                    destino: globals_1.expect.any(String),
                    classe: globals_1.expect.any(String),
                    headerLog: globals_1.expect.any(Object),
                    body: globals_1.expect.any(Object),
                }));
                (0, globals_1.expect)(photoUpdate.validate).toHaveBeenCalledWith(globals_1.expect.any(Object));
                (0, globals_1.expect)(httpResponseHelper_1.httpResponseHelper).toHaveBeenCalledTimes(1);
            });
            (0, globals_1.it)('deve atualizar a edição de foto com sucesso', async () => {
                globals_1.jest.spyOn(controller['logger'], 'info').mockResolvedValue(null);
                globals_1.jest.spyOn(controller['photoUpdate'], 'validate').mockResolvedValueOnce(null);
                globals_1.jest.spyOn(controller['photoUpdate'], 'update').mockResolvedValueOnce(null);
                globals_1.jest.spyOn(HttpHelper, 'noContent').mockReturnValueOnce(responseMock);
                const response = await controller.handle(requestMock);
                (0, globals_1.expect)(response.statusCode).toBe(axios_1.HttpStatusCode.NoContent);
                (0, globals_1.expect)(response.body).toEqual({});
                (0, globals_1.expect)(controller['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                    origem: globals_1.expect.any(String),
                    versao: globals_1.expect.any(String),
                    destino: globals_1.expect.any(String),
                    classe: globals_1.expect.any(String),
                    headerLog: globals_1.expect.any(Object),
                    body: {
                        body: {
                            cpfUsuario: requestMock.body.cpfUsuario,
                            imagemPerfil: requestMock.body.imagemPerfil,
                        },
                        header: globals_1.expect.any(Object),
                    },
                }));
                (0, globals_1.expect)(photoUpdate.validate).toHaveBeenCalledWith(globals_1.expect.any(Object));
                (0, globals_1.expect)(photoUpdate.update).toHaveBeenCalledWith(globals_1.expect.any(Object));
                (0, globals_1.expect)(controller['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                    origem: globals_1.expect.any(String),
                    versao: globals_1.expect.any(String),
                    destino: globals_1.expect.any(String),
                    classe: globals_1.expect.any(String),
                    headerLog: globals_1.expect.any(Object),
                    body: {
                        body: {
                            cpfUsuario: requestMock.body.cpfUsuario,
                            imagemPerfil: requestMock.body.imagemPerfil,
                        },
                        header: globals_1.expect.any(Object),
                    },
                    response: {},
                    status: globals_1.expect.any(Number),
                }));
            });
        });
    });
});
