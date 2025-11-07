import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import {Login} from './Login';

import {Keycloak, KeycloakAuthResponse} from '@/v1/domain/repository/keycloak/Keycloak';

import {Permission} from '@/v1/domain/repository/permission/Permission';
import {LoginBody, LoginData} from '@/v1/domain/entities/authentication/login/Login';
import {InvalidParamError} from '@/v1/domain/shared/errors';

const permission = {} as unknown as jest.Mocked<Permission>;

const keycloak = {
    authorize: jest.fn(),
} as unknown as jest.Mocked<Keycloak>;

describe('v1 application entitites authentication login Login', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('validate()', (): void => {
        let login: Login;

        beforeEach((): void => {
            jest.clearAllMocks();
            login = new Login(permission, keycloak);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve ocorrer um erro de parâmetros inválidos', async (): Promise<void> => {
            const requestMock: LoginData = {
                body: {
                    password: '102030',
                } as LoginBody,
            };

            await expect(login.validate(requestMock)).rejects.toThrow(InvalidParamError);
        });

        it('deve ocorrer um erro de parâmetros inválidos', async (): Promise<void> => {
            const requestMock: LoginData = {
                body: {
                    usernameOrEmail: 'user@example.com',
                } as LoginBody,
            };

            await expect(login.validate(requestMock)).rejects.toThrow(InvalidParamError);
        });

        it('deve validar o login corretamente', async (): Promise<void> => {
            const requestMock: LoginData = {
                body: {
                    usernameOrEmail: 'user@example.com',
                    password: '102030',
                } as LoginBody,
            };

            const result = await login.validate(requestMock);
            expect(result).toBeUndefined();
        });
    });

    describe('login()', (): void => {
        let login: Login;

        const requestMock: LoginData = {
            body: {
                usernameOrEmail: 'user@example.com',
                password: '102030',
            } as LoginBody,
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
            login = new Login(permission, keycloak);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve realizar o login corretamente', async (): Promise<void> => {
            jest.spyOn(login['keycloak'], 'authorize').mockResolvedValueOnce(keycloakAuthResponse);

            const result = await login.login(requestMock);

            expect(result).toEqual({
                accessToken: keycloakAuthResponse.access_token,
                expiresIn: keycloakAuthResponse.expires_in,
                refreshExpiresIn: keycloakAuthResponse.refresh_expires_in,
                refreshToken: keycloakAuthResponse.refresh_token,
                tokenType: keycloakAuthResponse.token_type,
                givenName: keycloakAuthResponse.given_name,
                familyName: keycloakAuthResponse.family_name,
            });
            expect(login['keycloak'].authorize).toHaveBeenCalledWith({
                username: requestMock.body.usernameOrEmail,
                password: requestMock.body.password,
            });
        });
    });
});
