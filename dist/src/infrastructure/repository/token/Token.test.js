"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Token_1 = require("./Token");
const errors_1 = require("../../../../v1/domain/shared/errors");
const data_mock_1 = require("../../../../tests/mocks/data.mock");
(0, globals_1.describe)('token Token', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('authentication()', () => {
        let token;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const httpMethodsMock = {
                openToken: globals_1.jest.fn(),
                validateToken: globals_1.jest.fn(),
            };
            token = new Token_1.Token(httpMethodsMock);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve ocorrer erro caso token estiver vazio', () => {
            const result = token.authentication(null);
            (0, globals_1.expect)(result).rejects.toThrow(errors_1.InvalidParamError);
            (0, globals_1.expect)(token['keycloak'].validateToken).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('deve retornar "Unauthorized" como status do token', () => {
            globals_1.jest.spyOn(token['keycloak'], 'validateToken').mockResolvedValueOnce('Unauthorized');
            const result = token.authentication('invalid_token');
            (0, globals_1.expect)(result).resolves.toEqual('Unauthorized');
        });
        (0, globals_1.it)('deve retornar "Expired" como status do token', () => {
            globals_1.jest.spyOn(token['keycloak'], 'validateToken').mockResolvedValueOnce('Expired');
            const result = token.authentication('expired_token');
            (0, globals_1.expect)(result).resolves.toEqual('Expired');
        });
        (0, globals_1.it)('deve retornar "Active" como status do token', () => {
            globals_1.jest.spyOn(token['keycloak'], 'validateToken').mockResolvedValueOnce('Active');
            const result = token.authentication('valid_token');
            (0, globals_1.expect)(result).resolves.toEqual('Active');
        });
    });
    (0, globals_1.describe)('open()', () => {
        let token;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const httpMethodsMock = {
                openToken: globals_1.jest.fn(),
                validateToken: globals_1.jest.fn(),
            };
            token = new Token_1.Token(httpMethodsMock);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve ocorrer um erro caso token estiver vazio', () => {
            const result = token.open('');
            (0, globals_1.expect)(result).rejects.toThrow(errors_1.InvalidParamError);
        });
        (0, globals_1.it)('deve ocorrer um erro ao abrir o token', () => {
            globals_1.jest.spyOn(token['keycloak'], 'openToken').mockRejectedValueOnce(new Error('Token inválido'));
            const result = token.open('invalid_token');
            (0, globals_1.expect)(result).rejects.toThrow(Error);
        });
        (0, globals_1.it)('deve abrir o token corretamente', () => {
            globals_1.jest.spyOn(token['keycloak'], 'openToken').mockResolvedValueOnce(data_mock_1.payloadTokenResponse);
            const result = token.open('valid_token');
            (0, globals_1.expect)(result).resolves.toEqual(data_mock_1.payloadTokenResponse);
        });
    });
});
