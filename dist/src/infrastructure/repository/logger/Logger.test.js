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
const axios_1 = require("axios");
const Logger_1 = require("./Logger");
const winston = __importStar(require("winston"));
const LoggerHelper = __importStar(require("../../helpers/LoggerHelper"));
const UnifaceHelper = __importStar(require("../../../v1/application/helpers/UnifaceHelper"));
const AzureApplicationModule = __importStar(require("winston-azure-application-insights"));
const winston_azure_application_insights_1 = require("winston-azure-application-insights");
globals_1.jest.mock('winston-azure-application-insights', () => ({
    AzureApplicationInsightsLogger: globals_1.jest.fn().mockImplementation(() => ({
        log: globals_1.jest.fn(),
    })),
}));
globals_1.jest.mock('winston', () => {
    return {
        createLogger: globals_1.jest.fn(() => ({
            log: globals_1.jest.fn(),
        })),
        format: {
            timestamp: globals_1.jest.fn(() => null),
            prettyPrint: globals_1.jest.fn(() => null),
            combine: globals_1.jest.fn(() => null),
        },
        Logger: globals_1.jest.fn(() => ({
            log: globals_1.jest.fn(),
        })),
        transports: {
            Console: globals_1.jest.fn(),
        },
    };
});
(0, globals_1.describe)('logger Logger', () => {
    const oldEnv = process.env;
    let logger;
    const jsonSensivel = {
        atributo: 'fake-info',
        atributoSensivel: '*',
    };
    const xmlSensivel = '<xml>*</xml>';
    const logData = {
        tipo: 'info',
        origem: 'test',
        versao: 'v1',
        destino: 'test',
        classe: 'test',
        headerLog: 'test',
        body: jsonSensivel,
        requestParam: jsonSensivel,
        pathVariable: 'test',
        erro: jsonSensivel,
        payload: xmlSensivel,
        response: jsonSensivel,
        status: axios_1.HttpStatusCode.Ok,
    };
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
        process.env.NODE_ENV = 'development';
        process.env.APPINSIGHTS_CONNECTION_STRING = 'fake-connection-string';
        process.env.LOG_LEVEL = 'fake-log-level';
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
        process.env = oldEnv;
    });
    (0, globals_1.describe)('constructor()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            globals_1.jest.spyOn(winston['format'], 'timestamp').mockReturnValueOnce(null);
            globals_1.jest.spyOn(winston['format'], 'prettyPrint').mockReturnValueOnce(null);
            globals_1.jest.spyOn(winston['format'], 'combine').mockReturnValueOnce(null);
        });
        (0, globals_1.it)('deve criar um logger se ambiente for development e APPINSIGHTS_CONNECTION_STRING estiver definido', () => {
            globals_1.jest.spyOn(winston['transports'], 'Console').mockReturnValueOnce(new winston.transports.Console());
            globals_1.jest.spyOn(AzureApplicationModule, 'AzureApplicationInsightsLogger').mockReturnValueOnce(new winston_azure_application_insights_1.AzureApplicationInsightsLogger({ instrumentationKey: process.env.APPINSIGHTS_CONNECTION_STRING }));
            globals_1.jest.spyOn(winston, 'createLogger').mockReturnValueOnce(new winston.Logger());
            logger = new Logger_1.Logger();
            (0, globals_1.expect)(logger).toBeInstanceOf(Logger_1.Logger);
        });
        (0, globals_1.it)('deve criar um logger se APPINSIGHTS_CONNECTION_STRING estiver indefinido', () => {
            process.env.NODE_ENV = 'production';
            process.env.APPINSIGHTS_CONNECTION_STRING = '';
            globals_1.jest.spyOn(winston, 'createLogger').mockReturnValue(new winston.Logger());
            logger = new Logger_1.Logger();
            (0, globals_1.expect)(logger).toBeInstanceOf(Logger_1.Logger);
        });
        (0, globals_1.it)('deve criar um logger se LOG_LEVEL estiver indefinido', () => {
            process.env.NODE_ENV = 'production';
            process.env.APPINSIGHTS_CONNECTION_STRING = '';
            process.env.LOG_LEVEL = '';
            globals_1.jest.spyOn(winston, 'createLogger').mockReturnValue(new winston.Logger());
            logger = new Logger_1.Logger();
            (0, globals_1.expect)(logger).toBeInstanceOf(Logger_1.Logger);
        });
    });
    (0, globals_1.describe)('log()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            globals_1.jest.spyOn(AzureApplicationModule, 'AzureApplicationInsightsLogger').mockReturnValueOnce(new winston_azure_application_insights_1.AzureApplicationInsightsLogger({ instrumentationKey: process.env.APPINSIGHTS_CONNECTION_STRING }));
        });
        (0, globals_1.it)('deve registrar corretamente uma mensagem de log do tipo info', async () => {
            globals_1.jest.spyOn(LoggerHelper, 'maskFieldsHelper').mockReturnValue(jsonSensivel);
            globals_1.jest.spyOn(LoggerHelper, 'maskXmlFieldsHelper').mockReturnValue(xmlSensivel);
            globals_1.jest.spyOn(UnifaceHelper, 'filterNullUndefinedAttributes').mockReturnValue(logData);
            globals_1.jest.spyOn(logger['logger'], 'log').mockReturnValueOnce(null);
            const result = logger.log(logData, 'info');
            (0, globals_1.expect)(logger['logger'].log).toHaveBeenCalledWith('info', globals_1.expect.any(Object));
            (0, globals_1.expect)(LoggerHelper.maskFieldsHelper).toHaveBeenCalledTimes(4);
            (0, globals_1.expect)(LoggerHelper.maskXmlFieldsHelper).toHaveBeenCalledTimes(1);
            (0, globals_1.expect)(result).resolves.toBeUndefined();
        });
    });
    (0, globals_1.describe)('info()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve chamar log com o nível de log "info"', () => {
            globals_1.jest.spyOn(logger, 'log').mockResolvedValueOnce(null);
            logger.info(logData);
            (0, globals_1.expect)(logger.log).toHaveBeenCalledWith(logData, 'info');
        });
    });
    (0, globals_1.describe)('warn()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve chamar log com o nível de log "warn"', () => {
            globals_1.jest.spyOn(logger, 'log').mockResolvedValueOnce(null);
            logger.warn(logData);
            (0, globals_1.expect)(logger.log).toHaveBeenCalledWith(logData, 'warn');
        });
    });
    (0, globals_1.describe)('error()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve chamar log com o nível de log "error"', () => {
            globals_1.jest.spyOn(logger, 'log').mockResolvedValueOnce(null);
            logger.error(logData);
            (0, globals_1.expect)(logger.log).toHaveBeenCalledWith(logData, 'error');
        });
    });
    (0, globals_1.describe)('debug()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve chamar log com o nível de log "debug"', () => {
            globals_1.jest.spyOn(logger, 'log').mockResolvedValueOnce(null);
            logger.debug(logData);
            (0, globals_1.expect)(logger.log).toHaveBeenCalledWith(logData, 'debug');
        });
    });
});
