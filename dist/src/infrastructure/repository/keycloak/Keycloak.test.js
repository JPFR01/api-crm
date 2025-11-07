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
const Keycloak_1 = require("./Keycloak");
const HttpMethod_1 = require("../http-methods/HttpMethod");
const errors_1 = require("../../../../v1/domain/shared/errors");
const JwkCacheHelper_1 = require("../../../../infrastructure/helpers/JwkCacheHelper");
const keycloakHelpers = __importStar(require("../../../../infrastructure/helpers/KeycloakHelpers"));
const tokenHelpers = __importStar(require("../../../../v1/application/helpers/TokenHelper"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const Logger_1 = require("../logger/Logger");
globals_1.jest.mock('@/infrastructure/helpers/KeycloakHelpers', () => ({
    buildAuthParams: globals_1.jest.fn(),
    convertBase64ToPem: globals_1.jest.fn(),
}));
(0, globals_1.describe)('repository Keycloak', () => {
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
    (0, globals_1.describe)('validate()', () => {
        let keycloak;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const httpMethodsMock = {
                post: globals_1.jest.fn(),
            };
            keycloak = new Keycloak_1.Keycloak(httpMethodsMock);
        });
        (0, globals_1.it)('Deve retornar um erro se método não for informado ou inválido', async () => {
            const inputKeycloak = {
                method: 'invalidMethod',
            };
            (0, globals_1.expect)(keycloak.validate(inputKeycloak)).rejects.toThrowError(errors_1.NotImplementedError);
        });
        (0, globals_1.describe)('validate authorize', () => {
            (0, globals_1.it)('Deve validar se o input está correto', async () => {
                const inputKeycloak = {
                    method: 'authorize',
                    data: {
                        username: 'username',
                        password: 'password',
                    },
                };
                (0, globals_1.expect)(keycloak.validate(inputKeycloak)).resolves.toBeUndefined();
            });
            (0, globals_1.it)('Deve retornar um erro se o username não for informado', async () => {
                const inputKeycloak = {
                    method: 'authorize',
                    data: {
                        otherParam: 'otherValue',
                        password: 'password',
                    },
                };
                (0, globals_1.expect)(keycloak.validate(inputKeycloak)).rejects.toThrowError(errors_1.InvalidParamError);
            });
            (0, globals_1.it)('Deve retornar um erro se o password não for informado', async () => {
                const inputKeycloak = {
                    method: 'authorize',
                    data: {
                        username: 'username',
                        otherParam: 'otherValue',
                    },
                };
                (0, globals_1.expect)(keycloak.validate(inputKeycloak)).rejects.toThrowError(errors_1.InvalidParamError);
            });
        });
        (0, globals_1.describe)('validate refreshToken', () => {
            (0, globals_1.it)('Deve validar se o input está correto', async () => {
                const inputKeycloak = {
                    method: 'refreshToken',
                    data: {
                        refreshToken: 'mockRefreshToken',
                    },
                };
                (0, globals_1.expect)(keycloak.validate(inputKeycloak)).resolves.toBeUndefined();
            });
            (0, globals_1.it)('Deve retornar um erro se o refreshToken não for informado', async () => {
                const usuarioKeycloakKeycloak = {
                    method: 'refreshToken',
                    data: {
                        otherParam: 'otherValue',
                    },
                };
                (0, globals_1.expect)(keycloak.validate(usuarioKeycloakKeycloak)).rejects.toThrowError(errors_1.InvalidParamError);
            });
        });
    });
    (0, globals_1.describe)('authorize()', () => {
        let keycloak;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const httpMethodsMock = {
                post: globals_1.jest.fn(),
                get: globals_1.jest.fn(),
            };
            keycloak = new Keycloak_1.Keycloak(httpMethodsMock);
        });
        (0, globals_1.it)('deve ocorrer um erro ao validar parâmetro incorreto', async () => {
            const usuarioIncompletoKeycloak = {
                username: 'username',
            };
            (0, globals_1.expect)(keycloak.authorize(usuarioIncompletoKeycloak)).rejects.toThrowError(errors_1.InvalidParamError);
        });
        (0, globals_1.it)('deve ocorrer um erro caso token não seja encontrado', async () => {
            globals_1.jest.spyOn(keycloakHelpers, 'buildAuthParams').mockImplementationOnce(() => {
                return new URLSearchParams();
            });
            globals_1.jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValue({
                data: { refresh_token: 'mockRefreshToken' },
            });
            (0, globals_1.expect)(keycloak.authorize(usuarioKeycloakValido)).rejects.toThrowError(errors_1.KeycloakTokenError);
        });
        (0, globals_1.it)('deve ocorrer um erro caso não haja token', async () => {
            globals_1.jest.spyOn(keycloakHelpers, 'buildAuthParams').mockImplementationOnce(() => {
                return new URLSearchParams();
            });
            globals_1.jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValue({});
            (0, globals_1.expect)(keycloak.authorize(usuarioKeycloakValido)).rejects.toThrowError(errors_1.KeycloakTokenError);
        });
        (0, globals_1.it)('deve ocorrer um erro caso não haja token', async () => {
            globals_1.jest.spyOn(keycloakHelpers, 'buildAuthParams').mockImplementationOnce(() => {
                return new URLSearchParams();
            });
            globals_1.jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValue(null);
            (0, globals_1.expect)(keycloak.authorize(usuarioKeycloakValido)).rejects.toThrowError(errors_1.KeycloakTokenError);
        });
        (0, globals_1.it)('deve ocorrer um erro caso token seja inválido', async () => {
            globals_1.jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(new URLSearchParams());
            globals_1.jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValueOnce({
                data: tokenValido,
            });
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'decode').mockReturnValueOnce({});
            globals_1.jest.spyOn(tokenHelpers, 'tokenErrorHelper').mockReturnValueOnce();
            (0, globals_1.expect)(keycloak.authorize(usuarioKeycloakValido)).rejects.toThrowError(errors_1.JsonWebTokenError);
        });
        (0, globals_1.it)('deve ocorrer um erro caso chave não seja encontrada', async () => {
            globals_1.jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(new URLSearchParams());
            globals_1.jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValueOnce({
                data: tokenValido,
            });
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'decode').mockReturnValueOnce(headerKeycloakToken);
            globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'get').mockReturnValueOnce(null);
            globals_1.jest.spyOn(keycloak['httpMethods'], 'get').mockResolvedValue({
                keys: [],
            });
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'verify').mockImplementationOnce(() => usuarioValido);
            (0, globals_1.expect)(keycloak.authorize(usuarioKeycloakValido)).rejects.toThrow(errors_1.KeycloakKeyError);
        });
        (0, globals_1.it)('deve retornar um token válido caso chave não esteja em cache', async () => {
            globals_1.jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(new URLSearchParams());
            globals_1.jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValueOnce({
                data: tokenValido,
            });
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'decode').mockReturnValueOnce(headerKeycloakToken);
            globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'get').mockReturnValueOnce(null);
            globals_1.jest.spyOn(keycloak['httpMethods'], 'get').mockResolvedValue({
                keys: [jwtKeys[1]],
            });
            globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'set').mockReturnValueOnce(null);
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'verify').mockImplementationOnce(() => usuarioValido);
            (0, globals_1.expect)(keycloak.authorize(usuarioKeycloakValido)).rejects.toThrow(errors_1.KeycloakKeyError);
        });
        (0, globals_1.it)('deve retornar um token válido caso chave não esteja em cache', async () => {
            globals_1.jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(new URLSearchParams());
            globals_1.jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValueOnce({
                data: tokenValido,
            });
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'decode').mockReturnValueOnce(headerKeycloakToken);
            globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'get').mockReturnValueOnce(null);
            globals_1.jest.spyOn(keycloak['httpMethods'], 'get').mockResolvedValue({
                keys: [jwtKeys[0]],
            });
            globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'set').mockReturnValueOnce(null);
            globals_1.jest.spyOn(keycloakHelpers, 'convertBase64ToPem').mockReturnValueOnce('mockPem');
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'verify').mockImplementationOnce(() => usuarioValido);
            (0, globals_1.expect)(keycloak.authorize(usuarioKeycloakValido)).resolves.toEqual({
                ...tokenValido,
                ...usuarioValido,
            });
        });
        (0, globals_1.it)('deve retornar um token válido', async () => {
            globals_1.jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(new URLSearchParams());
            globals_1.jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValueOnce({
                data: tokenValido,
            });
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'decode').mockReturnValueOnce(headerKeycloakToken);
            globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'get').mockReturnValueOnce(jwtKeys);
            globals_1.jest.spyOn(keycloakHelpers, 'convertBase64ToPem').mockReturnValueOnce('mockPem');
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'verify').mockImplementationOnce(() => usuarioValido);
            (0, globals_1.expect)(keycloak.authorize(usuarioKeycloakValido)).resolves.toEqual({
                ...tokenValido,
                ...usuarioValido,
            });
        });
    });
    (0, globals_1.describe)('refreshToken()', () => {
        let keycloak;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const httpMethodsMock = {
                post: globals_1.jest.fn(),
                get: globals_1.jest.fn(),
            };
            keycloak = new Keycloak_1.Keycloak(httpMethodsMock);
        });
        (0, globals_1.it)('deve ocorrer um erro ao validar parâmetro incorreto', async () => {
            const refreshTokenIncompleto = {};
            (0, globals_1.expect)(keycloak.refreshToken(refreshTokenIncompleto)).rejects.toThrowError(errors_1.InvalidParamError);
        });
        (0, globals_1.it)('deve ocorrer um erro caso token de acesso não seja encontrado', async () => {
            globals_1.jest.spyOn(keycloakHelpers, 'buildAuthParams').mockImplementationOnce(() => {
                return new URLSearchParams();
            });
            globals_1.jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValue({
                data: { refresh_token: 'mockAccessToken' },
            });
            (0, globals_1.expect)(keycloak.refreshToken(refreshTokenValido)).rejects.toThrowError(errors_1.KeycloakTokenError);
        });
        (0, globals_1.it)('deve retornar um token válido', async () => {
            globals_1.jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(new URLSearchParams());
            globals_1.jest.spyOn(keycloak['httpMethods'], 'post').mockResolvedValueOnce({
                data: tokenValido,
            });
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'decode').mockReturnValueOnce(headerKeycloakToken);
            globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'get').mockReturnValueOnce(jwtKeys);
            globals_1.jest.spyOn(keycloakHelpers, 'convertBase64ToPem').mockReturnValueOnce('mockPem');
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'verify').mockImplementationOnce(() => usuarioValido);
            (0, globals_1.expect)(keycloak.refreshToken(refreshTokenValido)).resolves.toEqual({
                ...tokenValido,
                ...usuarioValido,
            });
        });
    });
    (0, globals_1.describe)('getKey()', () => {
        let keycloak;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const httpMethodsMock = {
                post: globals_1.jest.fn(),
                get: globals_1.jest.fn(),
            };
            keycloak = new Keycloak_1.Keycloak(httpMethodsMock);
        });
        (0, globals_1.it)('deve retornar um certificado PEM válido ', async () => {
            globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'get').mockReturnValueOnce(null);
            globals_1.jest.spyOn(keycloak['httpMethods'], 'get').mockResolvedValue({
                keys: [jwtKeys[0]],
            });
            globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'set').mockReturnValueOnce(null);
            globals_1.jest.spyOn(keycloakHelpers, 'convertBase64ToPem').mockReturnValueOnce('mockPEM');
            const resultado = await keycloak.getKey(headerKeycloakToken.header);
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache.get).toHaveBeenCalled();
            (0, globals_1.expect)(keycloak['httpMethods'].get).toHaveBeenCalledWith(globals_1.expect.any(String), null, globals_1.expect.any(String));
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache.set).toHaveBeenCalledWith(globals_1.expect.any(Array));
            (0, globals_1.expect)(keycloakHelpers.convertBase64ToPem).toHaveBeenCalledWith(globals_1.expect.any(String));
            (0, globals_1.expect)(resultado).toEqual('mockPEM');
        });
        (0, globals_1.it)('deve retornar um certificado PEM válido através da cache', async () => {
            globals_1.jest.spyOn(JwkCacheHelper_1.JwkCache, 'get').mockReturnValueOnce(jwtKeys);
            globals_1.jest.spyOn(keycloakHelpers, 'convertBase64ToPem').mockReturnValueOnce('mockPEM');
            const resultado = await keycloak.getKey(headerKeycloakToken.header);
            (0, globals_1.expect)(JwkCacheHelper_1.JwkCache.get).toHaveBeenCalled();
            (0, globals_1.expect)(keycloakHelpers.convertBase64ToPem).toHaveBeenCalledWith(globals_1.expect.any(String));
            (0, globals_1.expect)(resultado).toEqual('mockPEM');
        });
    });
    (0, globals_1.describe)('validateToken()', () => {
        let keycloak;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const httpMethodsMock = {
                post: globals_1.jest.fn(),
                get: globals_1.jest.fn(),
            };
            keycloak = new Keycloak_1.Keycloak(httpMethodsMock);
        });
        (0, globals_1.it)('deve validar um token como Unauthorized', async () => {
            const token = 'tokenInvalido';
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'decode').mockReturnValueOnce({});
            const resultado = await keycloak.validateToken(token);
            (0, globals_1.expect)(jsonwebtoken_1.default.decode).toHaveBeenCalledWith(globals_1.expect.any(String), globals_1.expect.any(Object));
            (0, globals_1.expect)(resultado).toEqual('Unauthorized');
        });
        (0, globals_1.it)('deve validar um token como Expired', async () => {
            const token = 'tokenExpirado';
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'decode').mockImplementationOnce(() => {
                throw new jsonwebtoken_1.TokenExpiredError('stack', new Date());
            });
            const resultado = await keycloak.validateToken(token);
            (0, globals_1.expect)(resultado).toEqual('Expired');
        });
        (0, globals_1.it)('deve validar um token como Unauthorized (error)', async () => {
            const token = 'tokenInvalido';
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'decode').mockImplementationOnce(() => {
                throw new errors_1.KeycloakKeyError('stack', 'mensagem');
            });
            const resultado = await keycloak.validateToken(token);
            (0, globals_1.expect)(resultado).toEqual('Unauthorized');
        });
        (0, globals_1.it)('deve validar um token como Active', async () => {
            const token = 'tokenAtivo';
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'decode').mockReturnValueOnce(headerKeycloakToken);
            globals_1.jest.spyOn(keycloak, 'getKey').mockResolvedValueOnce('mockKey');
            globals_1.jest.spyOn(jsonwebtoken_1.default, 'verify').mockReturnValueOnce(null);
            const resultado = await keycloak.validateToken(token);
            (0, globals_1.expect)(jsonwebtoken_1.default.decode).toHaveBeenCalledWith(globals_1.expect.any(String), globals_1.expect.any(Object));
            (0, globals_1.expect)(keycloak.getKey).toHaveBeenCalledWith(globals_1.expect.any(Object));
            (0, globals_1.expect)(jsonwebtoken_1.default.verify).toHaveBeenCalledWith(globals_1.expect.any(String), globals_1.expect.any(String), globals_1.expect.any(Object));
            (0, globals_1.expect)(resultado).toEqual('Active');
        });
    });
    (0, globals_1.describe)('Teste de integração - refreshToken()', () => {
        let keycloak;
        const oldEnv = process.env;
        const tokenInvalido = {
            refreshToken: 
            // eslint-disable-next-line max-len
            'eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyOTBlYjJhNC02NmFlLTRhMzgtYmMzZC01MDM5ZTg3M2IxMGQifQ.eyJleHAiOjE3NTY0NjcxMzYsImlhdCI6MTc1NjQ2NTMzNiwianRpIjoiOTI5NmU0OGUtMDI2Ni00NjMyLTg1NWQtNDQzNjlkNTYzNTMzIiwiaXNzIjoiaHR0cHM6Ly9pYW0uc3RnLmNvYW1vLmNvbS5ici9yZWFsbXMvcGRjb29wIiwiYXVkIjoiaHR0cHM6Ly9pYW0uc3RnLmNvYW1vLmNvbS5ici9yZWFsbXMvcGRjb29wIiwic3ViIjoiM2VhNDVhNTQtZDZmYS00MzI3LTgwN2UtM2NjYjU0M2ExZTQxIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6ImFwaS1jb2Ftb2VzaWduIiwic2lkIjoiY2RhZjdmYWYtNDEwZC00ZWNjLTllYWEtMjJhZmY0YjM2ZTAyIiwic2NvcGUiOiJvcGVuaWQgYWNyIGJhc2ljIHJvbGVzIGVtYWlsIHdlYi1vcmlnaW5zIHByb2ZpbGUifQ.gi3KhzSr8NW2ieEsMxwRVdn2_F1OIsp1hwLY_xrfGL8Rd8CUePSuwR6Ro9BsbNe_cj-IRLlT4o6vgTGDyJ29uA',
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            process.env.NODE_ENV = 'development';
            process.env.APPINSIGHTS_CONNECTION_STRING = '';
            keycloak = new Keycloak_1.Keycloak(new HttpMethod_1.HttpMethod(new Logger_1.Logger()));
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
            process.env = oldEnv;
        });
        (0, globals_1.it)('deve retornar AuthenticationError', async () => {
            const urlSearch = new URLSearchParams();
            urlSearch.append('client_id', process.env.KEYCLOAK_NAME_CLIENT);
            urlSearch.append('client_secret', process.env.KEYCLOAK_CLIENT_KEY);
            urlSearch.append('grant_type', 'refresh_token');
            urlSearch.append('refresh_token', tokenInvalido.refreshToken);
            globals_1.jest.spyOn(keycloakHelpers, 'buildAuthParams').mockReturnValueOnce(urlSearch);
            (0, globals_1.expect)(keycloak.refreshToken(tokenInvalido)).rejects.toThrow(errors_1.AuthenticationError);
        });
    });
});
