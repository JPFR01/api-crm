import {expect, describe, it, beforeAll, jest} from '@jest/globals';
import {getAuthErrorMessage, isExpiredTokenError} from './HttpMethodErrorHelpers';

const errorInvalidGrant: unknown = {
    error: 'invalid_grant',
};
const errorInvalidClient: unknown = {
    error: 'invalid_client',
};
const errorUnauthorizedClient: unknown = {
    error: 'unauthorized_client',
};
const errorGeneric: unknown = {
    error: 'other_error',
};
const errorStackInvalidGrant: unknown = {
    stack: '{"error": "invalid_grant"}',
};
const errorStackInvalidGeneric: unknown = {
    stack: '{"error": "other_error"}',
};

describe('helpers HttpMethodErrorHelpers', (): void => {
    beforeAll((): void => {
        jest.clearAllMocks();
    });

    describe('helpers HttpMethodErrorHelpers getAuthErrorMessage', (): void => {
        it('Deve retornar mensagem se usuário e/ou senha é inválido', (): void => {
            const error: string = getAuthErrorMessage(errorInvalidGrant);

            expect(errorInvalidGrant).toHaveProperty('error', 'invalid_grant');
            expect(error).toBe('Usuário ou senha inválido!');
        });

        it('Deve retornar mensagem se usuário é inválido', (): void => {
            const error: string = getAuthErrorMessage(errorInvalidClient);

            expect(errorInvalidClient).toHaveProperty('error', 'invalid_client');
            expect(error).toBe('Usuário inválido!');
        });

        it('Deve retornar mensagem se usuário não autorizado', (): void => {
            const error: string = getAuthErrorMessage(errorUnauthorizedClient);

            expect(errorUnauthorizedClient).toHaveProperty('error', 'unauthorized_client');
            expect(error).toBe('Usuário não autorizado!');
        });

        describe('getAuthErrorMessage defaultValue', (): void => {
            const errorDefault: string = getAuthErrorMessage(errorGeneric);

            it('Deve retornar mensagem padrão', (): void => {
                expect(errorGeneric).toHaveProperty('error');
                expect(errorDefault).toBe('Erro de autenticação.');
            });

            it('Deve retornar mensagem padrão se errorData for undefined', (): void => {
                expect(getAuthErrorMessage(undefined)).toBe('Erro de autenticação.');
                expect(getAuthErrorMessage(null)).toBe('Erro de autenticação.');
            });
        });
    });

    describe('helpers HttpMethodErrorHelpers isExpiredTokenError', (): void => {
        it('Deve retornar true se errorData.error for invalid_grant', (): void => {
            const expiredToken: boolean = isExpiredTokenError(errorInvalidGrant);

            expect(errorInvalidGrant).toHaveProperty('error', 'invalid_grant');
            expect(expiredToken).toBe(true);
        });

        it('Deve retornar false se errorData.error não for invalid_grant', (): void => {
            const expiredToken: boolean = isExpiredTokenError(errorGeneric);

            expect(errorGeneric).not.toHaveProperty('error', 'invalid_grant');
            expect(expiredToken).toBe(false);
        });

        it('Deve retornar true se errorData.stack.error for invalid_grant', (): void => {
            const expiredToken: boolean = isExpiredTokenError(errorStackInvalidGrant);

            expect(errorStackInvalidGrant).toHaveProperty('stack');
            expect(expiredToken).toBe(true);
        });

        it('Deve retornar true se errorData.stack.error for invalid_grant', (): void => {
            const expiredToken: boolean = isExpiredTokenError(errorStackInvalidGeneric);

            expect(errorStackInvalidGeneric).toHaveProperty('stack');
            expect(expiredToken).toBe(false);
        });

        it('Deve retornar false se JSON.parse lançar exceção', (): void => {
            const errorStackInvalid: unknown = {stack: '{invalid json'};
            const expiredToken: boolean = isExpiredTokenError(errorStackInvalid);

            expect(expiredToken).toBe(false);
        });

        it('Deve retornar false se errorData for undefined', (): void => {
            expect(isExpiredTokenError(undefined)).toBe(false);
            expect(isExpiredTokenError(null)).toBe(false);
        });
    });
});
