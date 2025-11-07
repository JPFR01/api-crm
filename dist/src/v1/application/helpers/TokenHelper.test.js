"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const TokenHelper_1 = require("./TokenHelper");
const data_mock_1 = require("../../../../tests/mocks/data.mock");
const errors_1 = require("../../../../v1/domain/shared/errors");
(0, globals_1.describe)('v1 application helpers TokenHelper', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('payLoaderHelper()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve retornar o payload do token como uma string', () => {
            const stringify = JSON.stringify(data_mock_1.payloadTokenResponse);
            (0, globals_1.expect)((0, TokenHelper_1.payLoaderHelper)(data_mock_1.payloadTokenResponse)).toEqual(stringify);
        });
    });
    (0, globals_1.describe)('optionsHelper()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        const algoritmos = [
            'HS256',
            'HS384',
            'HS512',
            'RS256',
            'RS384',
            'RS512',
            'ES256',
            'ES384',
            'ES512',
            'RS256',
            'RS384',
            'RS512',
        ];
        algoritmos.forEach((algoritmoToken) => {
            (0, globals_1.it)(`deve retornar corretamente as opções do token para o algoritmo ${algoritmoToken}`, () => {
                (0, globals_1.expect)((0, TokenHelper_1.optionsHelper)(algoritmoToken)).toEqual({ algorithm: algoritmoToken });
            });
        });
    });
    (0, globals_1.describe)('tokenErrorHelper()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve lançar "ExpiredJwtError" corretamente', async () => {
            const error = new Error('Token expirado');
            error.name = 'TokenExpiredError';
            await (0, globals_1.expect)(async () => (0, TokenHelper_1.tokenErrorHelper)(error)).rejects.toThrow(errors_1.ExpiredJwtError);
        });
        (0, globals_1.it)('deve lançar "JsonWebTokenError" corretamente', async () => {
            const error = new Error('JWT inválido');
            error.name = 'JsonWebTokenError';
            await (0, globals_1.expect)(async () => (0, TokenHelper_1.tokenErrorHelper)(error)).rejects.toThrow(errors_1.JsonWebTokenError);
        });
        (0, globals_1.it)('deve lançar "NotBeforeError" corretamente', async () => {
            const error = new Error('Token não está ativo');
            error.name = 'NotBeforeError';
            await (0, globals_1.expect)(async () => (0, TokenHelper_1.tokenErrorHelper)(error)).rejects.toThrow(errors_1.NotBeforeError);
        });
        (0, globals_1.it)('deve lançar "ServerError" para outros tipos de erro', async () => {
            const error = new Error('Erro desconhecido');
            error.name = 'OutroErro';
            await (0, globals_1.expect)(async () => (0, TokenHelper_1.tokenErrorHelper)(error)).rejects.toThrow(errors_1.ServerError);
        });
    });
    (0, globals_1.describe)('tokenValidationHelper()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve ocorrer um erro de autenticação se token não existir', async () => {
            const headerInvalido = { ...data_mock_1.header };
            headerInvalido['authorization'] = null;
            await (0, globals_1.expect)(async () => (0, TokenHelper_1.tokenValidationHelper)(headerInvalido, 'Class.function')).rejects.toThrow(errors_1.AuthenticationError);
        });
        (0, globals_1.it)('deve ocorrer um erro de autenticação se token for inválido', async () => {
            const headerInvalido = { ...data_mock_1.header };
            headerInvalido['authorization'] = 'token-invalido';
            await (0, globals_1.expect)(async () => (0, TokenHelper_1.tokenValidationHelper)(headerInvalido, 'Class.function')).rejects.toThrow(errors_1.AuthenticationError);
        });
        (0, globals_1.it)('deve validar o token corretamente', () => {
            (0, globals_1.expect)((0, TokenHelper_1.tokenValidationHelper)(data_mock_1.header, 'Class.function')).toBeUndefined();
        });
    });
});
