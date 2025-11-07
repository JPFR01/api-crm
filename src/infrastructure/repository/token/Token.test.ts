import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import {Token} from './Token';

import {Keycloak} from '@/v1/domain/repository/keycloak/Keycloak';
import {PayLoadToken, tokenStatus} from '@/v1/domain/repository/token/Token';
import {InvalidParamError} from '@/v1/domain/shared/errors';

import {payloadTokenResponse} from '../../../../tests/mocks/data.mock';

describe('token Token', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('authentication()', (): void => {
        let token: Token;

        beforeEach((): void => {
            jest.clearAllMocks();
            const httpMethodsMock: Keycloak = {
                openToken: jest.fn(),
                validateToken: jest.fn(),
            } as unknown as Keycloak;
            token = new Token(httpMethodsMock);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve ocorrer erro caso token estiver vazio', (): void => {
            const result: Promise<tokenStatus> = token.authentication(null);

            expect(result).rejects.toThrow(InvalidParamError);
            expect(token['keycloak'].validateToken).not.toHaveBeenCalled();
        });

        it('deve retornar "Unauthorized" como status do token', (): void => {
            jest.spyOn(token['keycloak'], 'validateToken').mockResolvedValueOnce('Unauthorized');

            const result: Promise<tokenStatus> = token.authentication('invalid_token');

            expect(result).resolves.toEqual('Unauthorized');
        });

        it('deve retornar "Expired" como status do token', (): void => {
            jest.spyOn(token['keycloak'], 'validateToken').mockResolvedValueOnce('Expired');

            const result: Promise<tokenStatus> = token.authentication('expired_token');

            expect(result).resolves.toEqual('Expired');
        });

        it('deve retornar "Active" como status do token', (): void => {
            jest.spyOn(token['keycloak'], 'validateToken').mockResolvedValueOnce('Active');

            const result: Promise<tokenStatus> = token.authentication('valid_token');

            expect(result).resolves.toEqual('Active');
        });
    });

    describe('open()', (): void => {
        let token: Token;

        beforeEach((): void => {
            jest.clearAllMocks();
            const httpMethodsMock: Keycloak = {
                openToken: jest.fn(),
                validateToken: jest.fn(),
            } as unknown as Keycloak;
            token = new Token(httpMethodsMock);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve ocorrer um erro caso token estiver vazio', (): void => {
            const result: Promise<PayLoadToken> = token.open('');

            expect(result).rejects.toThrow(InvalidParamError);
        });

        it('deve ocorrer um erro ao abrir o token', (): void => {
            jest.spyOn(token['keycloak'], 'openToken').mockRejectedValueOnce(new Error('Token inválido'));

            const result: Promise<PayLoadToken> = token.open('invalid_token');

            expect(result).rejects.toThrow(Error);
        });

        it('deve abrir o token corretamente', (): void => {
            jest.spyOn(token['keycloak'], 'openToken').mockResolvedValueOnce(payloadTokenResponse);

            const result: Promise<PayLoadToken> = token.open('valid_token');

            expect(result).resolves.toEqual(payloadTokenResponse);
        });
    });
});
