import {expect, describe, it, jest, beforeEach, afterEach} from '@jest/globals';

import {buildAuthParams, convertBase64ToPem} from './KeycloakHelpers';

describe('helpers KeycloakHelpers', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    describe('helpers KeycloakHelpers buildAuthParams', (): void => {
        const extraParamsLogin: Record<string, string> = {
            username: 'username',
            password: 'password',
        };

        const extraParamsRefreshToken: Record<string, string> = {
            refresh_token: 'mockRefreshToken',
        };

        const OLD_ENV: NodeJS.ProcessEnv = process.env;

        beforeEach((): void => {
            process.env = {...OLD_ENV};
            process.env.KEYCLOAK_NAME_CLIENT = 'test-client';
            process.env.KEYCLOAK_CLIENT_KEY = 'test-secret';
        });

        afterEach((): void => {
            process.env = OLD_ENV;
        });

        it('Deve construir parâmetros de autenticação para autenticação', () => {
            const params: URLSearchParams = buildAuthParams('password', extraParamsLogin);

            expect(params.get('client_id')).toBe('test-client');
            expect(params.get('client_secret')).toBe('test-secret');
            expect(params.get('grant_type')).toBe('password');
            expect(Array.from(params.keys())).toEqual(['client_id', 'client_secret', 'grant_type', 'username', 'password']);
        });

        it('Deve construir parâmetros de autenticação para refresh_token', () => {
            const params: URLSearchParams = buildAuthParams('refresh_token', extraParamsRefreshToken);

            expect(params.get('client_id')).toBe('test-client');
            expect(params.get('client_secret')).toBe('test-secret');
            expect(params.get('grant_type')).toBe('refresh_token');
            expect(Array.from(params.keys())).toEqual(['client_id', 'client_secret', 'grant_type', 'refresh_token']);
        });

        it('Deve lidar com parâmetros extras vazios', () => {
            const params: URLSearchParams = buildAuthParams('password', {});

            expect(params.get('client_id')).toBe('test-client');
            expect(params.get('client_secret')).toBe('test-secret');
            expect(params.get('grant_type')).toBe('password');
            expect(Array.from(params.keys())).toEqual(['client_id', 'client_secret', 'grant_type']);
        });
    });

    describe('helpers KeycloakHelpers convertBase64ToPem', () => {
        it('Deve converter uma string Base64 em um formato PEM', () => {
            const base64String: string = 'c29tZSBCYXNlNjQgc3RyaW5n';
            const pem: string = convertBase64ToPem(base64String);
            expect(pem).toBe('-----BEGIN CERTIFICATE-----\n' + 'c29tZSBCYXNlNjQgc3RyaW5n\n' + '-----END CERTIFICATE-----');
        });

        it('Deve dividir a string Base64 em linhas de até 64 caracteres', () => {
            const base64String: string = 'A'.repeat(64) + 'B'.repeat(6);
            const pem: string = convertBase64ToPem(base64String);
            expect(pem).toBe('-----BEGIN CERTIFICATE-----\n' + 'A'.repeat(64) + '\n' + 'B'.repeat(6) + '\n' + '-----END CERTIFICATE-----');
        });

        it('Deve retornar cabeçalhos PEM mesmo se string Base64 estiver vazia', () => {
            const base64String: string = '';
            const pem: string = convertBase64ToPem(base64String);
            expect(pem).toBe('-----BEGIN CERTIFICATE-----\n' + 'undefined\n' + '-----END CERTIFICATE-----');
        });
    });
});
