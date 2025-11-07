import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import {Keycloak} from './Keycloak';
import {HttpMethod} from '../http-methods/HttpMethod';

import {KeycloakData, KeycloakRefreshTokenData, keycloakValidateInput} from '@/v1/domain/repository/keycloak/Keycloak';
import {
    AuthenticationError,
    InvalidParamError,
    JsonWebTokenError,
    KeycloakKeyError,
    KeycloakTokenError,
    NotImplementedError,
} from '@/v1/domain/shared/errors';
import {JwkCache} from '@/infrastructure/helpers/JwkCacheHelper';

import * as keycloakHelpers from '@/infrastructure/helpers/KeycloakHelpers';
import * as tokenHelpers from '@/v1/application/helpers/TokenHelper';

import jwt, {TokenExpiredError} from 'jsonwebtoken';
import {Error} from '@/v1/domain/shared/errors/Error';
import {Logger} from '../logger/Logger';

jest.mock('@/infrastructure/helpers/KeycloakHelpers', () => ({
    buildAuthParams: jest.fn(),
    convertBase64ToPem: jest.fn(),
}));

describe('repository Keycloak', (): void => {
    const usuarioKeycloakValido = {
        username: 'mockUsername',
        password: 'mockPassword',
    };

    const usuarioValido = {
        given_name: 'mockGivenName',
        family_name: 'mockFamilyName',
    };

    const tokenValido = {
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
    };

    const refreshTokenValido = {
        refreshToken: 'mockRefreshToken',
    };

    const headerKeycloakToken = {
        header: {
            alg: 'RS256',
            typ: 'JWT',
            kid: 'kid',
        },
        payload: {
            realm_access: {
                roles: ['mockRole'],
            },
        },
    };

    const jwtKeys = [
        {
            alg: 'RS256',
            kid: 'kid',
            kty: 'kty',
            use: 'use',
            x5c: ['x5c'],
            x5t: 'x5t',
        },
        {
            alg: 'RS256',
            kid: 'kidDiferente',
            kty: 'kty',
            use: 'use',
            x5c: ['x5c'],
            x5t: 'x5t',
        },
    ];

    describe('validate()', (): void => {
        let keycloak: Keycloak;

        beforeEach((): void => {
            jest.clearAllMocks();
            const httpMethodsMock: HttpMethod = {
                post: jest.fn(),
            } as unknown as HttpMethod;
            keycloak = new Keycloak(httpMethodsMock);
        });

        it('Deve retornar um erro se método não for informado ou inválido', async (): Promise<void> => {
            const inputKeycloak: unknown = {
                method: 'invalidMethod',
            };

            expect(keycloak.validate(inputKeycloak as keycloakValidateInput)).rejects.toThrowError(NotImplementedError);
        });

        describe('validate authorize', (): void => {
            it('Deve validar se o input está correto', async (): Promise<void> => {
                const inputKeycloak: keycloakValidateInput = {
                    method: 'authorize',
                    data: {
                        username: 'username',
                        password: 'password',
                    },
                };

                expect(keycloak.validate(inputKeycloak)).resolves.toBeUndefined();
            });

            it('Deve retornar um erro se o username não for informado', async (): Promise<void> => {
                const inputKeycloak: unknown = {
                    method: 'authorize',
                    data: {
                        otherParam: 'otherValue',
                        password: 'password',
                    },
                };

                expect(keycloak.validate(inputKeycloak as keycloakValidateInput)).rejects.toThrowError(InvalidParamError);
            });

            it('Deve retornar um erro se o password não for informado', async (): Promise<void> => {
                const inputKeycloak: unknown = {
                    method: 'authorize',
                    data: {
                        username: 'username',
                        otherParam: 'otherValue',
                    },
                };

                expect(keycloak.validate(inputKeycloak as keycloakValidateInput)).rejects.toThrowError(InvalidParamError);
            });
        });

        describe('validate refreshToken', (): void => {
            it('Deve validar se o input está correto', async (): Promise<void> => {
                const inputKeycloak: keycloakValidateInput = {
                    method: 'refreshToken',
                    data: {
                        refreshToken: 'mockRefreshToken',
                    },
                };

                expect(keycloak.validate(inputKeycloak)).resolves.toBeUndefined();
            });

            it('Deve retornar um erro se o refreshToken não for informado', async (): Promise<void> => {
                const usuarioKeycloakKeycloak: unknown = {
                    method: 'refreshToken',
                    data: {
                        otherParam: 'otherValue',
                    },
                };

                expect(keycloak.validate(usuarioKeycloakKeycloak as keycloakValidateInput)).rejects.toThrowError(InvalidParamError);
            });
        });
    });

    describe('authorize()', (): void => {
        let keycloak: Keycloak;

        beforeEach((): void => {
            jest.clearAllMocks();
            const httpMethodsMock: HttpMethod = {
                post: jest.fn(),
                get: jest.fn(),
            } as unknown as HttpMethod;
            keycloak = new Keycloak(httpMethodsMock);
        });

        it('deve ocorrer um erro ao validar parâmetro incorreto', async (): Promise<void> => {
            const usuarioIncompletoKeycloak: unknown = {
                username: 'username',
            };

            expect(keycloak.authorize(usuarioIncompletoKeycloak as KeycloakData)).rejects.toThrowError(InvalidParamError);
        });

        it('deve ocorrer um erro caso token não seja encontrado', async (): Promise<void> => {
            jest.spyOn(keycloakHelpers, 'buildAuthParams').mockImplementationOnce((): URLSearchParams => {
                return new URLSearchParams();
            });
            jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValue({
                data: {refresh_token: 'mockRefreshToken'},
            });

            expect(keycloak.authorize(usuarioKeycloakValido as KeycloakData)).rejects.toThrowError(KeycloakTokenError);
        });

        it('deve ocorrer um erro caso não haja token', async (): Promise<void> => {
            jest.spyOn(keycloakHelpers, 'buildAuthParams').mockImplementationOnce((): URLSearchParams => {
                return new URLSearchParams();
            });
            jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValue({});

            expect(keycloak.authorize(usuarioKeycloakValido as KeycloakData)).rejects.toThrowError(KeycloakTokenError);
        });

        it('deve ocorrer um erro caso não haja token', async (): Promise<void> => {
            jest.spyOn(keycloakHelpers, 'buildAuthParams').mockImplementationOnce((): URLSearchParams => {
                return new URLSearchParams();
            });
            jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValue(null);

            expect(keycloak.authorize(usuarioKeycloakValido as KeycloakData)).rejects.toThrowError(KeycloakTokenError);
        });

        it('deve ocorrer um erro caso token seja inválido', async (): Promise<void> => {
            jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(new URLSearchParams());
            jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValueOnce({
                data: tokenValido,
            });
            jest.spyOn(jwt, 'decode').mockReturnValueOnce({});
            jest.spyOn(tokenHelpers, 'tokenErrorHelper').mockReturnValueOnce();

            expect(keycloak.authorize(usuarioKeycloakValido as KeycloakData)).rejects.toThrowError(JsonWebTokenError);
        });

        it('deve ocorrer um erro caso chave não seja encontrada', async (): Promise<void> => {
            jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(new URLSearchParams());
            jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValueOnce({
                data: tokenValido,
            });
            jest.spyOn(jwt, 'decode').mockReturnValueOnce(headerKeycloakToken);

            jest.spyOn(JwkCache, 'get').mockReturnValueOnce(null);
            jest.spyOn(keycloak['httpMethods'], 'get').mockResolvedValue({
                keys: [],
            });
            jest.spyOn(jwt, 'verify').mockImplementationOnce((): unknown => usuarioValido);

            expect(keycloak.authorize(usuarioKeycloakValido as KeycloakData)).rejects.toThrow(KeycloakKeyError);
        });

        it('deve retornar um token válido caso chave não esteja em cache', async (): Promise<void> => {
            jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(new URLSearchParams());
            jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValueOnce({
                data: tokenValido,
            });
            jest.spyOn(jwt, 'decode').mockReturnValueOnce(headerKeycloakToken);

            jest.spyOn(JwkCache, 'get').mockReturnValueOnce(null);
            jest.spyOn(keycloak['httpMethods'], 'get').mockResolvedValue({
                keys: [jwtKeys[1]],
            });
            jest.spyOn(JwkCache, 'set').mockReturnValueOnce(null);
            jest.spyOn(jwt, 'verify').mockImplementationOnce((): unknown => usuarioValido);

            expect(keycloak.authorize(usuarioKeycloakValido as KeycloakData)).rejects.toThrow(KeycloakKeyError);
        });

        it('deve retornar um token válido caso chave não esteja em cache', async (): Promise<void> => {
            jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(new URLSearchParams());
            jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValueOnce({
                data: tokenValido,
            });
            jest.spyOn(jwt, 'decode').mockReturnValueOnce(headerKeycloakToken);

            jest.spyOn(JwkCache, 'get').mockReturnValueOnce(null);
            jest.spyOn(keycloak['httpMethods'], 'get').mockResolvedValue({
                keys: [jwtKeys[0]],
            });
            jest.spyOn(JwkCache, 'set').mockReturnValueOnce(null);
            jest.spyOn(keycloakHelpers, 'convertBase64ToPem').mockReturnValueOnce('mockPem');
            jest.spyOn(jwt, 'verify').mockImplementationOnce((): unknown => usuarioValido);

            expect(keycloak.authorize(usuarioKeycloakValido as KeycloakData)).resolves.toEqual({
                ...tokenValido,
                ...usuarioValido,
            });
        });

        it('deve retornar um token válido', async (): Promise<void> => {
            jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(new URLSearchParams());
            jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValueOnce({
                data: tokenValido,
            });
            jest.spyOn(jwt, 'decode').mockReturnValueOnce(headerKeycloakToken);

            jest.spyOn(JwkCache, 'get').mockReturnValueOnce(jwtKeys);
            jest.spyOn(keycloakHelpers, 'convertBase64ToPem').mockReturnValueOnce('mockPem');
            jest.spyOn(jwt, 'verify').mockImplementationOnce((): unknown => usuarioValido);

            expect(keycloak.authorize(usuarioKeycloakValido as KeycloakData)).resolves.toEqual({
                ...tokenValido,
                ...usuarioValido,
            });
        });
    });

    describe('refreshToken()', (): void => {
        let keycloak: Keycloak;

        beforeEach((): void => {
            jest.clearAllMocks();
            const httpMethodsMock: HttpMethod = {
                post: jest.fn(),
                get: jest.fn(),
            } as unknown as HttpMethod;
            keycloak = new Keycloak(httpMethodsMock);
        });

        it('deve ocorrer um erro ao validar parâmetro incorreto', async (): Promise<void> => {
            const refreshTokenIncompleto: unknown = {};

            expect(keycloak.refreshToken(refreshTokenIncompleto as KeycloakRefreshTokenData)).rejects.toThrowError(InvalidParamError);
        });

        it('deve ocorrer um erro caso token de acesso não seja encontrado', async (): Promise<void> => {
            jest.spyOn(keycloakHelpers, 'buildAuthParams').mockImplementationOnce((): URLSearchParams => {
                return new URLSearchParams();
            });
            jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValue({
                data: {refresh_token: 'mockAccessToken'},
            });

            expect(keycloak.refreshToken(refreshTokenValido as KeycloakRefreshTokenData)).rejects.toThrowError(KeycloakTokenError);
        });

        it('deve retornar um token válido', async (): Promise<void> => {
            jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(new URLSearchParams());
            jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValueOnce({
                data: tokenValido,
            });
            jest.spyOn(jwt, 'decode').mockReturnValueOnce(headerKeycloakToken);

            jest.spyOn(JwkCache, 'get').mockReturnValueOnce(jwtKeys);
            jest.spyOn(keycloakHelpers, 'convertBase64ToPem').mockReturnValueOnce('mockPem');
            jest.spyOn(jwt, 'verify').mockImplementationOnce((): unknown => usuarioValido);

            expect(keycloak.refreshToken(refreshTokenValido as KeycloakRefreshTokenData)).resolves.toEqual({
                ...tokenValido,
                ...usuarioValido,
            });
        });
    });

    describe('getKey()', (): void => {
        let keycloak: Keycloak;

        beforeEach((): void => {
            jest.clearAllMocks();
            const httpMethodsMock: HttpMethod = {
                post: jest.fn(),
                get: jest.fn(),
            } as unknown as HttpMethod;
            keycloak = new Keycloak(httpMethodsMock);
        });

        it('deve retornar um certificado PEM válido ', async (): Promise<void> => {
            jest.spyOn(JwkCache, 'get').mockReturnValueOnce(null);
            jest.spyOn(keycloak['httpMethods'], 'get').mockResolvedValue({
                keys: [jwtKeys[0]],
            });
            jest.spyOn(JwkCache, 'set').mockReturnValueOnce(null);
            jest.spyOn(keycloakHelpers, 'convertBase64ToPem').mockReturnValueOnce('mockPEM');

            const resultado: string = await keycloak.getKey(headerKeycloakToken.header);

            expect(JwkCache.get).toHaveBeenCalled();
            expect(keycloak['httpMethods'].get).toHaveBeenCalledWith(expect.any(String), null, expect.any(String));
            expect(JwkCache.set).toHaveBeenCalledWith(expect.any(Array));
            expect(keycloakHelpers.convertBase64ToPem).toHaveBeenCalledWith(expect.any(String));
            expect(resultado).toEqual('mockPEM');
        });

        it('deve retornar um certificado PEM válido através da cache', async (): Promise<void> => {
            jest.spyOn(JwkCache, 'get').mockReturnValueOnce(jwtKeys);
            jest.spyOn(keycloakHelpers, 'convertBase64ToPem').mockReturnValueOnce('mockPEM');

            const resultado: string = await keycloak.getKey(headerKeycloakToken.header);

            expect(JwkCache.get).toHaveBeenCalled();
            expect(keycloakHelpers.convertBase64ToPem).toHaveBeenCalledWith(expect.any(String));
            expect(resultado).toEqual('mockPEM');
        });
    });

    describe('validateToken()', (): void => {
        let keycloak: Keycloak;

        beforeEach((): void => {
            jest.clearAllMocks();
            const httpMethodsMock: HttpMethod = {
                post: jest.fn(),
                get: jest.fn(),
            } as unknown as HttpMethod;
            keycloak = new Keycloak(httpMethodsMock);
        });

        it('deve validar um token como Unauthorized', async (): Promise<void> => {
            const token: string = 'tokenInvalido';

            jest.spyOn(jwt, 'decode').mockReturnValueOnce({});

            const resultado: string = await keycloak.validateToken(token);

            expect(jwt.decode).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
            expect(resultado).toEqual('Unauthorized');
        });

        it('deve validar um token como Expired', async (): Promise<void> => {
            const token: string = 'tokenExpirado';

            jest.spyOn(jwt, 'decode').mockImplementationOnce((): Error => {
                throw new TokenExpiredError('stack', new Date());
            });

            const resultado: string = await keycloak.validateToken(token);

            expect(resultado).toEqual('Expired');
        });

        it('deve validar um token como Unauthorized (error)', async (): Promise<void> => {
            const token: string = 'tokenInvalido';

            jest.spyOn(jwt, 'decode').mockImplementationOnce((): Error => {
                throw new KeycloakKeyError('stack', 'mensagem');
            });

            const resultado: string = await keycloak.validateToken(token);

            expect(resultado).toEqual('Unauthorized');
        });

        it('deve validar um token como Active', async (): Promise<void> => {
            const token: string = 'tokenAtivo';

            jest.spyOn(jwt, 'decode').mockReturnValueOnce(headerKeycloakToken);
            jest.spyOn(keycloak, 'getKey').mockResolvedValueOnce('mockKey');
            jest.spyOn(jwt, 'verify').mockReturnValueOnce(null);

            const resultado: string = await keycloak.validateToken(token);

            expect(jwt.decode).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
            expect(keycloak.getKey).toHaveBeenCalledWith(expect.any(Object));
            expect(jwt.verify).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.any(Object));
            expect(resultado).toEqual('Active');
        });
    });

    describe('Teste de integração - refreshToken()', (): void => {
        let keycloak: Keycloak;
        const oldEnv = process.env;
        const tokenInvalido: KeycloakRefreshTokenData = {
            refreshToken:
                // eslint-disable-next-line max-len
                'eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyOTBlYjJhNC02NmFlLTRhMzgtYmMzZC01MDM5ZTg3M2IxMGQifQ.eyJleHAiOjE3NTY0NjcxMzYsImlhdCI6MTc1NjQ2NTMzNiwianRpIjoiOTI5NmU0OGUtMDI2Ni00NjMyLTg1NWQtNDQzNjlkNTYzNTMzIiwiaXNzIjoiaHR0cHM6Ly9pYW0uc3RnLmNvYW1vLmNvbS5ici9yZWFsbXMvcGRjb29wIiwiYXVkIjoiaHR0cHM6Ly9pYW0uc3RnLmNvYW1vLmNvbS5ici9yZWFsbXMvcGRjb29wIiwic3ViIjoiM2VhNDVhNTQtZDZmYS00MzI3LTgwN2UtM2NjYjU0M2ExZTQxIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6ImFwaS1jb2Ftb2VzaWduIiwic2lkIjoiY2RhZjdmYWYtNDEwZC00ZWNjLTllYWEtMjJhZmY0YjM2ZTAyIiwic2NvcGUiOiJvcGVuaWQgYWNyIGJhc2ljIHJvbGVzIGVtYWlsIHdlYi1vcmlnaW5zIHByb2ZpbGUifQ.gi3KhzSr8NW2ieEsMxwRVdn2_F1OIsp1hwLY_xrfGL8Rd8CUePSuwR6Ro9BsbNe_cj-IRLlT4o6vgTGDyJ29uA',
        };

        beforeEach((): void => {
            jest.clearAllMocks();
            process.env.NODE_ENV = 'development';
            process.env.APPINSIGHTS_CONNECTION_STRING = '';
            keycloak = new Keycloak(new HttpMethod(new Logger()));
        });

        afterAll((): void => {
            jest.clearAllMocks();
            process.env = oldEnv;
        });

        it('deve retornar AuthenticationError', async (): Promise<void> => {
            const urlSearch: URLSearchParams = new URLSearchParams();
            urlSearch.append('client_id', process.env.KEYCLOAK_NAME_CLIENT!);
            urlSearch.append('client_secret', process.env.KEYCLOAK_CLIENT_KEY!);
            urlSearch.append('grant_type', 'refresh_token');
            urlSearch.append('refresh_token', tokenInvalido.refreshToken);

            jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(urlSearch);

            expect(keycloak.refreshToken(tokenInvalido)).rejects.toThrow(AuthenticationError);
        });
    });
});
