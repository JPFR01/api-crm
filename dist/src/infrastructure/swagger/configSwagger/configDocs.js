"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configDocs = exports.components = exports.privatePaths = exports.publicPaths = void 0;
const yamljs_1 = __importDefault(require("yamljs"));
const path = require('path');
const healthCheck = yamljs_1.default.load(path.resolve(__dirname, '../yaml/healthCheck.yaml'));
const login = yamljs_1.default.load(path.resolve(__dirname, '../yaml/authentication/login.yaml'));
const refreshToken = yamljs_1.default.load(path.resolve(__dirname, '../yaml/authentication/refreshToken.yaml'));
const retrievePersonalData = yamljs_1.default.load(path.resolve(__dirname, '../yaml/cooperative-member/retrievePersonalData.yaml'));
exports.publicPaths = {
    ...healthCheck,
    ...login,
    ...refreshToken,
};
exports.privatePaths = {
    ...retrievePersonalData,
};
const securitySchemes = {
    bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    },
};
exports.components = {
    securitySchemes,
};
function addSecurityToPaths(pathsObj) {
    const securedPaths = {};
    for (const [route, methods] of Object.entries(pathsObj)) {
        securedPaths[route] = {};
        for (const [method, spec] of Object.entries(methods)) {
            securedPaths[route][method] = {
                ...(typeof spec === 'object' && spec !== null ? spec : {}),
                security: [{ bearerAuth: [] }],
            };
        }
    }
    return securedPaths;
}
exports.configDocs = {
    apis: ['./src/app/**/**.controller.ts'],
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'API Imagem NodeJS',
            version: '1.0.0',
            description: 'Especificação dos EndPoints de autenticação disponibilizados no middleware para comunicação com as APIs internas.',
        },
        servers: [
            {
                url: `http://localhost:${Number(process.env.PORT || 3000)}/v1`,
                description: 'Desenvolvimento',
            },
            {
                url: process.env.SWAGGER_URL_STG,
                description: 'Stage',
            },
            {
                url: process.env.SWAGGER_URL_PRD,
                description: 'Produção',
            },
        ],
        paths: {
            ...exports.publicPaths,
            ...addSecurityToPaths(exports.privatePaths),
        },
        components: exports.components,
    },
};
