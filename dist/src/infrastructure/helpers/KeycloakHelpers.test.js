"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const KeycloakHelpers_1 = require("./KeycloakHelpers");
(0, globals_1.describe)('helpers KeycloakHelpers', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('helpers KeycloakHelpers buildAuthParams', () => {
        const extraParamsLogin = {
            username: 'username',
            password: 'password',
        };
        const extraParamsRefreshToken = {
            refresh_token: 'mockRefreshToken',
        };
        const OLD_ENV = process.env;
        (0, globals_1.beforeEach)(() => {
            process.env = { ...OLD_ENV };
            process.env.KEYCLOAK_NAME_CLIENT = 'test-client';
            process.env.KEYCLOAK_CLIENT_KEY = 'test-secret';
        });
        (0, globals_1.afterEach)(() => {
            process.env = OLD_ENV;
        });
        (0, globals_1.it)('Deve construir parâmetros de autenticação para autenticação', () => {
            const params = (0, KeycloakHelpers_1.buildAuthParams)('password', extraParamsLogin);
            (0, globals_1.expect)(params.get('client_id')).toBe('test-client');
            (0, globals_1.expect)(params.get('client_secret')).toBe('test-secret');
            (0, globals_1.expect)(params.get('grant_type')).toBe('password');
            (0, globals_1.expect)(Array.from(params.keys())).toEqual(['client_id', 'client_secret', 'grant_type', 'username', 'password']);
        });
        (0, globals_1.it)('Deve construir parâmetros de autenticação para refresh_token', () => {
            const params = (0, KeycloakHelpers_1.buildAuthParams)('refresh_token', extraParamsRefreshToken);
            (0, globals_1.expect)(params.get('client_id')).toBe('test-client');
            (0, globals_1.expect)(params.get('client_secret')).toBe('test-secret');
            (0, globals_1.expect)(params.get('grant_type')).toBe('refresh_token');
            (0, globals_1.expect)(Array.from(params.keys())).toEqual(['client_id', 'client_secret', 'grant_type', 'refresh_token']);
        });
        (0, globals_1.it)('Deve lidar com parâmetros extras vazios', () => {
            const params = (0, KeycloakHelpers_1.buildAuthParams)('password', {});
            (0, globals_1.expect)(params.get('client_id')).toBe('test-client');
            (0, globals_1.expect)(params.get('client_secret')).toBe('test-secret');
            (0, globals_1.expect)(params.get('grant_type')).toBe('password');
            (0, globals_1.expect)(Array.from(params.keys())).toEqual(['client_id', 'client_secret', 'grant_type']);
        });
    });
    (0, globals_1.describe)('helpers KeycloakHelpers convertBase64ToPem', () => {
        (0, globals_1.it)('Deve converter uma string Base64 em um formato PEM', () => {
            const base64String = 'c29tZSBCYXNlNjQgc3RyaW5n';
            const pem = (0, KeycloakHelpers_1.convertBase64ToPem)(base64String);
            (0, globals_1.expect)(pem).toBe('-----BEGIN CERTIFICATE-----\n' + 'c29tZSBCYXNlNjQgc3RyaW5n\n' + '-----END CERTIFICATE-----');
        });
        (0, globals_1.it)('Deve dividir a string Base64 em linhas de até 64 caracteres', () => {
            const base64String = 'A'.repeat(64) + 'B'.repeat(6);
            const pem = (0, KeycloakHelpers_1.convertBase64ToPem)(base64String);
            (0, globals_1.expect)(pem).toBe('-----BEGIN CERTIFICATE-----\n' + 'A'.repeat(64) + '\n' + 'B'.repeat(6) + '\n' + '-----END CERTIFICATE-----');
        });
        (0, globals_1.it)('Deve retornar cabeçalhos PEM mesmo se string Base64 estiver vazia', () => {
            const base64String = '';
            const pem = (0, KeycloakHelpers_1.convertBase64ToPem)(base64String);
            (0, globals_1.expect)(pem).toBe('-----BEGIN CERTIFICATE-----\n' + 'undefined\n' + '-----END CERTIFICATE-----');
        });
    });
});
