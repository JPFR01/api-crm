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
const LoggerHelper = __importStar(require("./LoggerHelper"));
(0, globals_1.describe)('helpers LoggerHelper', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('helpers LoggerHelper', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.describe)('helpers LoggerHelper maskFieldsHelper', () => {
            (0, globals_1.beforeEach)(() => {
                globals_1.jest.clearAllMocks();
            });
            (0, globals_1.it)('Deve retornar undefined se parâmetro for falsy', () => {
                (0, globals_1.expect)(LoggerHelper.maskFieldsHelper(undefined)).toBeUndefined();
                (0, globals_1.expect)(LoggerHelper.maskFieldsHelper(null)).toBeUndefined();
                (0, globals_1.expect)(LoggerHelper.maskFieldsHelper('')).toBeUndefined();
            });
            (0, globals_1.it)('Deve retornar undefined se parâmetro não for objeto válido', () => {
                (0, globals_1.expect)(LoggerHelper.maskFieldsHelper('not-json')).toBeUndefined();
            });
            (0, globals_1.it)('Deve retornar um objeto com dados não sensíveis', () => {
                const mockJson = { usernameOrEmail: 'user' };
                const result = LoggerHelper.maskFieldsHelper(mockJson);
                (0, globals_1.expect)(result).toEqual(mockJson);
            });
            (0, globals_1.it)('Deve retornar um objeto com objetos aninhados', () => {
                const mockJson = {
                    body: {
                        header: {
                            connection: 'keep-alive',
                        },
                    },
                };
                const result = LoggerHelper.maskFieldsHelper(mockJson);
                (0, globals_1.expect)(result).toEqual(mockJson);
            });
            (0, globals_1.it)('Deve retornar um objeto se parâmetro for objeto na string', () => {
                const result = LoggerHelper.maskFieldsHelper('{"value": "not-json-valid"}');
                (0, globals_1.expect)(result).toBeDefined();
            });
            (0, globals_1.it)('Deve retornar undefined se parâmetro não for um objeto válido', () => {
                const result = LoggerHelper.maskFieldsHelper([1, 2, 3]);
                (0, globals_1.expect)(result).toBeUndefined();
            });
            (0, globals_1.it)('Deve retornar um objeto com atributo sensível', () => {
                const mockJson = {
                    password: '102030',
                };
                const result = LoggerHelper.maskFieldsHelper(mockJson);
                (0, globals_1.expect)(result).toHaveProperty('password', '*');
            });
            (0, globals_1.it)('Deve retornar um objeto com token mascarado', () => {
                const mockJson = { authorization: 'Bearer mockTokenValido' };
                const result = LoggerHelper.maskFieldsHelper(mockJson);
                (0, globals_1.expect)(result).toHaveProperty('authorization', 'Bearer *');
            });
        });
        (0, globals_1.describe)('helpers LoggerHelper maskXmlFieldsHelper', () => {
            (0, globals_1.beforeEach)(() => {
                globals_1.jest.clearAllMocks();
            });
            (0, globals_1.it)('Deve retornar undefined se data for falsy', () => {
                (0, globals_1.expect)(LoggerHelper.maskXmlFieldsHelper('')).toBeUndefined();
            });
            (0, globals_1.it)('Deve retornar XML mascarado', () => {
                const mockXml = '<root><element>value</element></root>';
                const result = LoggerHelper.maskXmlFieldsHelper(mockXml);
                (0, globals_1.expect)(result).toBe(mockXml);
            });
            (0, globals_1.it)('Deve retornar erro se XML for inválido', () => {
                const mockXml = '<root><element';
                (0, globals_1.expect)(() => LoggerHelper.maskXmlFieldsHelper(mockXml)).toThrow();
            });
        });
    });
});
