import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import {RefreshToken} from './RefreshToken';

import {Keycloak, KeycloakAuthResponse} from '@/v1/domain/repository/keycloak/Keycloak';

import {RefreshTokenData} from '@/v1/domain/entities/authentication/refresh-token/RefreshToken';
import {Permission} from '@/v1/domain/repository/permission/Permission';
import {InvalidParamError} from '@/v1/domain/shared/errors';

const permission = {} as unknown as jest.Mocked<Permission>;

const keycloak = {
    refreshToken: jest.fn(),
} as unknown as jest.Mocked<Keycloak>;

describe('v1 application entitites authentication login Login', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('validate()', (): void => {
        let refreshToken: RefreshToken;

        beforeEach((): void => {
            jest.clearAllMocks();
            refreshToken = new RefreshToken(permission, keycloak);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve ocorrer um erro de parâmetros inválidos', async (): Promise<void> => {
            const requestMock: RefreshTokenData = {
                refreshToken: '',
            };

            await expect(refreshToken.validate(requestMock)).rejects.toThrow(InvalidParamError);
        });

        it('deve validar o refresh token corretamente', async (): Promise<void> => {
            const requestMock: RefreshTokenData = {
                refreshToken: 'fake-token',
            };

            const result = await refreshToken.validate(requestMock);
            expect(result).toBeUndefined();
        });
    });

    describe('refresh()', (): void => {
        let refreshToken: RefreshToken;

        const requestMock: RefreshTokenData = {
            refreshToken: 'fake-token',
        };

        const keycloakAuthResponse: KeycloakAuthResponse = {
            access_token: 'fake-token',
            expires_in: 100,
            refresh_expires_in: 200,
            refresh_token: 'fake-token',
            token_type: 'Bearer',
            id_token: 'fake-id-token',
            session_state: 'fake-session-state',
            scope: 'fake-scope',
            given_name: 'Bulba',
            family_name: 'Sauro',
        };

        beforeEach((): void => {
            jest.clearAllMocks();
            refreshToken = new RefreshToken(permission, keycloak);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve realizar o refresh token corretamente', async (): Promise<void> => {
            jest.spyOn(refreshToken['keycloak'], 'refreshToken').mockResolvedValueOnce(keycloakAuthResponse);

            const result = await refreshToken.refresh(requestMock);

            expect(result).toEqual({
                accessToken: keycloakAuthResponse.access_token,
                expiresIn: keycloakAuthResponse.expires_in,
                refreshExpiresIn: keycloakAuthResponse.refresh_expires_in,
                refreshToken: keycloakAuthResponse.refresh_token,
                tokenType: keycloakAuthResponse.token_type,
                givenName: keycloakAuthResponse.given_name,
                familyName: keycloakAuthResponse.family_name,
            });
            expect(refreshToken['keycloak'].refreshToken).toHaveBeenCalledWith({
                refreshToken: requestMock.refreshToken,
            });
        });
    });
});
