"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Login_1 = require("./Login");
const errors_1 = require("../../../../../../v1/domain/shared/errors");
const permission = {};
const keycloak = {
    authorize: globals_1.jest.fn(),
};
(0, globals_1.describe)('v1 application entitites authentication login Login', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('validate()', () => {
        let login;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            login = new Login_1.Login(permission, keycloak);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve ocorrer um erro de parâmetros inválidos', async () => {
            const requestMock = {
                body: {
                    password: '102030',
                },
            };
            await (0, globals_1.expect)(login.validate(requestMock)).rejects.toThrow(errors_1.InvalidParamError);
        });
        (0, globals_1.it)('deve ocorrer um erro de parâmetros inválidos', async () => {
            const requestMock = {
                body: {
                    usernameOrEmail: 'user@example.com',
                },
            };
            await (0, globals_1.expect)(login.validate(requestMock)).rejects.toThrow(errors_1.InvalidParamError);
        });
        (0, globals_1.it)('deve validar o login corretamente', async () => {
            const requestMock = {
                body: {
                    usernameOrEmail: 'user@example.com',
                    password: '102030',
                },
            };
            const result = await login.validate(requestMock);
            (0, globals_1.expect)(result).toBeUndefined();
        });
    });
    (0, globals_1.describe)('login()', () => {
        let login;
        const requestMock = {
            body: {
                usernameOrEmail: 'user@example.com',
                password: '102030',
            },
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
            login = new Login_1.Login(permission, keycloak);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve realizar o login corretamente', async () => {
            globals_1.jest.spyOn(login['keycloak'], 'authorize').mockResolvedValueOnce(keycloakAuthResponse);
            const result = await login.login(requestMock);
            (0, globals_1.expect)(result).toEqual({
                accessToken: keycloakAuthResponse.access_token,
                expiresIn: keycloakAuthResponse.expires_in,
                refreshExpiresIn: keycloakAuthResponse.refresh_expires_in,
                refreshToken: keycloakAuthResponse.refresh_token,
                tokenType: keycloakAuthResponse.token_type,
                givenName: keycloakAuthResponse.given_name,
                familyName: keycloakAuthResponse.family_name,
            });
            (0, globals_1.expect)(login['keycloak'].authorize).toHaveBeenCalledWith({
                username: requestMock.body.usernameOrEmail,
                password: requestMock.body.password,
            });
        });
    });
});
