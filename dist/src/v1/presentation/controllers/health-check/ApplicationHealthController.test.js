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
const ApplicationHealthController_1 = require("./ApplicationHealthController");
const HttpHelper = __importStar(require("../../../../../v1/presentation/helpers/http-helper"));
const axios_1 = require("axios");
globals_1.jest.mock('@/main/factories/repository/logger/LoggerFactory', () => ({
    LoggerFactory: () => ({
        error: globals_1.jest.fn(),
    }),
}));
const healthCheck = {
    check: globals_1.jest.fn(),
};
const logger = {
    info: globals_1.jest.fn(),
};
(0, globals_1.describe)('v1 presentation controllers health-check', () => {
    (0, globals_1.describe)('ApplicationHealthController', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.describe)('handle()', () => {
            let controller;
            const responseMock = {
                statusCode: axios_1.HttpStatusCode.Ok,
                body: {
                    status: 'Ok',
                },
            };
            (0, globals_1.beforeEach)(() => {
                globals_1.jest.clearAllMocks();
                controller = new ApplicationHealthController_1.HealthCheckController(healthCheck, logger);
            });
            (0, globals_1.afterAll)(() => {
                globals_1.jest.clearAllMocks();
            });
            (0, globals_1.it)('deve verificar a saúde da aplicação com sucesso', async () => {
                globals_1.jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                globals_1.jest.spyOn(controller['healthCheck'], 'check').mockResolvedValueOnce('Ok');
                globals_1.jest.spyOn(HttpHelper, 'ok').mockReturnValueOnce(responseMock);
                const response = await controller.handle();
                (0, globals_1.expect)(response.statusCode).toBe(axios_1.HttpStatusCode.Ok);
                (0, globals_1.expect)(controller['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                    origem: globals_1.expect.any(String),
                    versao: globals_1.expect.any(String),
                    destino: globals_1.expect.any(String),
                    classe: globals_1.expect.any(String),
                    headerLog: globals_1.expect.any(Object),
                }));
                (0, globals_1.expect)(healthCheck.check).toHaveBeenCalledTimes(1);
            });
        });
    });
});
