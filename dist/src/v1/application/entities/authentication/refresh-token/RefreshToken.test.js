"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const RefreshToken_1 = require("./RefreshToken");
const errors_1 = require("../../../../../../v1/domain/shared/errors");
const permission = {};
const keycloak = {
    refreshToken: globals_1.jest.fn(),
};
(0, globals_1.describe)('v1 application entitites authentication login Login', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('validate()', () => {
        let refreshToken;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            refreshToken = new RefreshToken_1.RefreshToken(permission, keycloak);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve ocorrer um erro de parâmetros inválidos', async () => {
            const requestMock = {
                refreshToken: '',
            };
            await (0, globals_1.expect)(refreshToken.validate(requestMock)).rejects.toThrow(errors_1.InvalidParamError);
        });
        (0, globals_1.it)('deve validar o refresh token corretamente', async () => {
            const requestMock = {
                refreshToken: 'fake-token',
            };
            const result = await refreshToken.validate(requestMock);
            (0, globals_1.expect)(result).toBeUndefined();
        });
    });
    (0, globals_1.describe)('refresh()', () => {
        let refreshToken;
        const requestMock = {
            refreshToken: 'fake-token',
        };
        const keycloakAuthResponse = {
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
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            refreshToken = new RefreshToken_1.RefreshToken(permission, keycloak);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve realizar o refresh token corretamente', async () => {
            globals_1.jest.spyOn(refreshToken['keycloak'], 'refreshToken').mockResolvedValueOnce(keycloakAuthResponse);
            const result = await refreshToken.refresh(requestMock);
            (0, globals_1.expect)(result).toEqual({
                accessToken: keycloakAuthResponse.access_token,
                expiresIn: keycloakAuthResponse.expires_in,
                refreshExpiresIn: keycloakAuthResponse.refresh_expires_in,
                refreshToken: keycloakAuthResponse.refresh_token,
                tokenType: keycloakAuthResponse.token_type,
                givenName: keycloakAuthResponse.given_name,
                familyName: keycloakAuthResponse.family_name,
            });
            (0, globals_1.expect)(refreshToken['keycloak'].refreshToken).toHaveBeenCalledWith({
                refreshToken: requestMock.refreshToken,
            });
        });
    });
});
