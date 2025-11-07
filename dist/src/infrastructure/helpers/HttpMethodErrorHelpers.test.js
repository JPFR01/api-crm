"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const HttpMethodErrorHelpers_1 = require("./HttpMethodErrorHelpers");
const errorInvalidGrant = {
    error: 'invalid_grant',
};
const errorInvalidClient = {
    error: 'invalid_client',
};
const errorUnauthorizedClient = {
    error: 'unauthorized_client',
};
const errorGeneric = {
    error: 'other_error',
};
const errorStackInvalidGrant = {
    stack: '{"error": "invalid_grant"}',
};
const errorStackInvalidGeneric = {
    stack: '{"error": "other_error"}',
};
(0, globals_1.describe)('helpers HttpMethodErrorHelpers', () => {
    (0, globals_1.beforeAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('helpers HttpMethodErrorHelpers getAuthErrorMessage', () => {
        (0, globals_1.it)('Deve retornar mensagem se usuário e/ou senha é inválido', () => {
            const error = (0, HttpMethodErrorHelpers_1.getAuthErrorMessage)(errorInvalidGrant);
            (0, globals_1.expect)(errorInvalidGrant).toHaveProperty('error', 'invalid_grant');
            (0, globals_1.expect)(error).toBe('Usuário ou senha inválido!');
        });
        (0, globals_1.it)('Deve retornar mensagem se usuário é inválido', () => {
            const error = (0, HttpMethodErrorHelpers_1.getAuthErrorMessage)(errorInvalidClient);
            (0, globals_1.expect)(errorInvalidClient).toHaveProperty('error', 'invalid_client');
            (0, globals_1.expect)(error).toBe('Usuário inválido!');
        });
        (0, globals_1.it)('Deve retornar mensagem se usuário não autorizado', () => {
            const error = (0, HttpMethodErrorHelpers_1.getAuthErrorMessage)(errorUnauthorizedClient);
            (0, globals_1.expect)(errorUnauthorizedClient).toHaveProperty('error', 'unauthorized_client');
            (0, globals_1.expect)(error).toBe('Usuário não autorizado!');
        });
        (0, globals_1.describe)('getAuthErrorMessage defaultValue', () => {
            const errorDefault = (0, HttpMethodErrorHelpers_1.getAuthErrorMessage)(errorGeneric);
            (0, globals_1.it)('Deve retornar mensagem padrão', () => {
                (0, globals_1.expect)(errorGeneric).toHaveProperty('error');
                (0, globals_1.expect)(errorDefault).toBe('Erro de autenticação.');
            });
            (0, globals_1.it)('Deve retornar mensagem padrão se errorData for undefined', () => {
                (0, globals_1.expect)((0, HttpMethodErrorHelpers_1.getAuthErrorMessage)(undefined)).toBe('Erro de autenticação.');
                (0, globals_1.expect)((0, HttpMethodErrorHelpers_1.getAuthErrorMessage)(null)).toBe('Erro de autenticação.');
            });
        });
    });
    (0, globals_1.describe)('helpers HttpMethodErrorHelpers isExpiredTokenError', () => {
        (0, globals_1.it)('Deve retornar true se errorData.error for invalid_grant', () => {
            const expiredToken = (0, HttpMethodErrorHelpers_1.isExpiredTokenError)(errorInvalidGrant);
            (0, globals_1.expect)(errorInvalidGrant).toHaveProperty('error', 'invalid_grant');
            (0, globals_1.expect)(expiredToken).toBe(true);
        });
        (0, globals_1.it)('Deve retornar false se errorData.error não for invalid_grant', () => {
            const expiredToken = (0, HttpMethodErrorHelpers_1.isExpiredTokenError)(errorGeneric);
            (0, globals_1.expect)(errorGeneric).not.toHaveProperty('error', 'invalid_grant');
            (0, globals_1.expect)(expiredToken).toBe(false);
        });
        (0, globals_1.it)('Deve retornar true se errorData.stack.error for invalid_grant', () => {
            const expiredToken = (0, HttpMethodErrorHelpers_1.isExpiredTokenError)(errorStackInvalidGrant);
            (0, globals_1.expect)(errorStackInvalidGrant).toHaveProperty('stack');
            (0, globals_1.expect)(expiredToken).toBe(true);
        });
        (0, globals_1.it)('Deve retornar true se errorData.stack.error for invalid_grant', () => {
            const expiredToken = (0, HttpMethodErrorHelpers_1.isExpiredTokenError)(errorStackInvalidGeneric);
            (0, globals_1.expect)(errorStackInvalidGeneric).toHaveProperty('stack');
            (0, globals_1.expect)(expiredToken).toBe(false);
        });
        (0, globals_1.it)('Deve retornar false se JSON.parse lançar exceção', () => {
            const errorStackInvalid = { stack: '{invalid json' };
            const expiredToken = (0, HttpMethodErrorHelpers_1.isExpiredTokenError)(errorStackInvalid);
            (0, globals_1.expect)(expiredToken).toBe(false);
        });
        (0, globals_1.it)('Deve retornar false se errorData for undefined', () => {
            (0, globals_1.expect)((0, HttpMethodErrorHelpers_1.isExpiredTokenError)(undefined)).toBe(false);
            (0, globals_1.expect)((0, HttpMethodErrorHelpers_1.isExpiredTokenError)(null)).toBe(false);
        });
    });
});
