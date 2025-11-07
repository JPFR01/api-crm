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
exports.Logger = void 0;
const LoggerHelper_1 = require("../../../../infrastructure/helpers/LoggerHelper");
const UnifaceHelper_1 = require("../../../../v1/application/helpers/UnifaceHelper");
const winston = __importStar(require("winston"));
const winston_azure_application_insights_1 = require("winston-azure-application-insights");
const { combine, timestamp, prettyPrint } = winston.format;
class Logger {
    constructor() {
        const transports = [];
        if (process.env.NODE_ENV === 'development') {
            transports.push(new winston.transports.Console());
        }
        if (process.env.APPINSIGHTS_CONNECTION_STRING) {
            transports.push(new winston_azure_application_insights_1.AzureApplicationInsightsLogger({
                instrumentationKey: process.env.APPINSIGHTS_CONNECTION_STRING,
            }));
        }
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: combine(timestamp(), prettyPrint()),
            transports,
        });
    }
    async log(data, level) {
        this.logger.log(level, (0, UnifaceHelper_1.filterNullUndefinedAttributes)({
            tipo: data.tipo,
            origem: data.origem,
            versao: data.versao,
            destino: data.destino,
            classe: data.classe,
            headerLog: data.headerLog,
            body: (0, LoggerHelper_1.maskFieldsHelper)(data.body),
            requestParam: (0, LoggerHelper_1.maskFieldsHelper)(data.requestParam),
            pathVariable: data.pathVariable,
            erro: (0, LoggerHelper_1.maskFieldsHelper)(data.erro),
            payload: (0, LoggerHelper_1.maskXmlFieldsHelper)(data.payload),
            response: (0, LoggerHelper_1.maskFieldsHelper)(data.response),
            status: data.status,
        }));
    }
    async info(data) {
        await this.log(data, 'info');
    }
    async warn(data) {
        await this.log(data, 'warn');
    }
    async error(data) {
        await this.log(data, 'error');
    }
    async debug(data) {
        await this.log(data, 'debug');
    }
}
exports.Logger = Logger;
