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
const UnifaceHelper = __importStar(require("./UnifaceHelper"));
const UnifaceHelper_1 = require("./UnifaceHelper");
const data_mock_1 = require("../../../../tests/mocks/data.mock");
(0, globals_1.describe)('v1 application helpers TokenHelper', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('filterNullUndefinedAttributes()', () => {
        const jsonValido = {
            email: 'user@example.com',
            username: 'username',
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve remover atributos nulos corretamente', () => {
            const jsonNull = {
                ...jsonValido,
                password: null,
            };
            (0, globals_1.expect)((0, UnifaceHelper_1.filterNullUndefinedAttributes)(jsonNull)).toEqual(jsonValido);
        });
        (0, globals_1.it)('deve remover atributos undefined corretamente', () => {
            const jsonUndefined = {
                ...jsonValido,
                password: undefined,
            };
            (0, globals_1.expect)((0, UnifaceHelper_1.filterNullUndefinedAttributes)(jsonUndefined)).toEqual(jsonValido);
        });
    });
    (0, globals_1.describe)('unifaceBaseStructHelper()', () => {
        const baseStructUniface = {
            root: {
                sistema: 'PORTAL_APP',
                operationId: 'fake-operation',
                versao: 'v1',
                'X-Correlation-ID': 'corr-id-123',
                'alternative-url': 'https://fake-alt-url.com',
                'production-redirect': 'https://fake-prod-redirect.com',
                payload: 'payload',
            },
        };
        const unifaceOperation = {
            operationId: 'fake-operation',
            version: 'v1',
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve retornar a estrutura base correta', () => {
            globals_1.jest.spyOn(UnifaceHelper, 'filterNullUndefinedAttributes').mockReturnValueOnce(baseStructUniface.root);
            (0, globals_1.expect)((0, UnifaceHelper_1.unifaceBaseStructHelper)(unifaceOperation, 'payload', data_mock_1.header)).toEqual(baseStructUniface);
        });
    });
    (0, globals_1.describe)('unifaceJsonToXmlHelper()', () => {
        const baseStructUniface = {
            root: {
                sistema: 'PORTAL_APP',
                operationId: 'fake-operation',
                versao: 'v1',
                'X-Correlation-ID': 'corr-id-123',
                'alternative-url': 'https://fake-alt-url.com',
                'production-redirect': 'https://fake-prod-redirect.com',
                payload: 'payload',
            },
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve retornar uma string iniciando com "xml="', () => {
            const result = (0, UnifaceHelper_1.unifaceJsonToXmlHelper)(baseStructUniface);
            (0, globals_1.expect)(typeof result).toBe('string');
            (0, globals_1.expect)(result.startsWith('xml=')).toBe(true);
        });
    });
});
