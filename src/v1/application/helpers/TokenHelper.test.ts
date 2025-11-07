import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import {optionsHelper, payLoaderHelper, tokenErrorHelper, tokenValidationHelper} from './TokenHelper';
import {header, payloadTokenResponse} from '../../../../tests/mocks/data.mock';
import {algorithmToken} from '@/v1/domain/repository/token/Token';
import {AuthenticationError, ExpiredJwtError, JsonWebTokenError, NotBeforeError, ServerError} from '@/v1/domain/shared/errors';
import {Header} from '@/infrastructure/helpers/HeaderHelper';

describe('v1 application helpers TokenHelper', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('payLoaderHelper()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve retornar o payload do token como uma string', (): void => {
            const stringify: string = JSON.stringify(payloadTokenResponse);

            expect(payLoaderHelper(payloadTokenResponse)).toEqual(stringify);
        });
    });

    describe('optionsHelper()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        const algoritmos: algorithmToken[] = [
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
            it(`deve retornar corretamente as opções do token para o algoritmo ${algoritmoToken}`, (): void => {
                expect(optionsHelper(algoritmoToken)).toEqual({algorithm: algoritmoToken});
            });
        });
    });

    describe('tokenErrorHelper()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve lançar "ExpiredJwtError" corretamente', async (): Promise<void> => {
            const error = new Error('Token expirado');
            error.name = 'TokenExpiredError';

            await expect(async () => tokenErrorHelper(error)).rejects.toThrow(ExpiredJwtError);
        });

        it('deve lançar "JsonWebTokenError" corretamente', async (): Promise<void> => {
            const error = new Error('JWT inválido');
            error.name = 'JsonWebTokenError';

            await expect(async () => tokenErrorHelper(error)).rejects.toThrow(JsonWebTokenError);
        });

        it('deve lançar "NotBeforeError" corretamente', async (): Promise<void> => {
            const error = new Error('Token não está ativo');
            error.name = 'NotBeforeError';

            await expect(async () => tokenErrorHelper(error)).rejects.toThrow(NotBeforeError);
        });

        it('deve lançar "ServerError" para outros tipos de erro', async (): Promise<void> => {
            const error = new Error('Erro desconhecido');
            error.name = 'OutroErro';

            await expect(async () => tokenErrorHelper(error)).rejects.toThrow(ServerError);
        });
    });

    describe('tokenValidationHelper()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve ocorrer um erro de autenticação se token não existir', async (): Promise<void> => {
            const headerInvalido: Header = {...header};
            headerInvalido['authorization'] = null;

            await expect(async () => tokenValidationHelper(headerInvalido, 'Class.function')).rejects.toThrow(AuthenticationError);
        });

        it('deve ocorrer um erro de autenticação se token for inválido', async (): Promise<void> => {
            const headerInvalido: Header = {...header};
            headerInvalido['authorization'] = 'token-invalido';

            await expect(async () => tokenValidationHelper(headerInvalido, 'Class.function')).rejects.toThrow(AuthenticationError);
        });

        it('deve validar o token corretamente', (): void => {
            expect(tokenValidationHelper(header, 'Class.function')).toBeUndefined();
        });
    });
});
