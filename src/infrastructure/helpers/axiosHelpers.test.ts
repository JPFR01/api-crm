import {expect, describe, it, beforeAll, jest} from '@jest/globals';
import {headers, keycloakHeader, unifaceHeader} from './axiosHelpers';
import {AxiosRequestConfig} from 'axios';

describe('Helpers axiosHelpers', (): void => {
    const tokenValido: string = 'tokenValido';

    beforeAll((): void => {
        jest.clearAllMocks();
    });

    describe('Helpers axiosHelpers headers', (): void => {
        it('Deve retornar AxiosRequestConfig com headers e timeout', (): void => {
            const config: AxiosRequestConfig = headers(tokenValido);

            expect(config).toHaveProperty('headers', {
                authorization: `Bearer ${tokenValido}`,
            });
            expect(config).toHaveProperty('timeout', 15000);
        });
    });

    describe('Helpers axiosHelpers unifaceHeader', (): void => {
        it('Deve retornar AxiosRequestConfig com headers e timeout', (): void => {
            const config: AxiosRequestConfig = unifaceHeader;
            expect(config).toHaveProperty('headers', {
                'Content-Type': 'text/plain',
            });
            expect(config).toHaveProperty('timeout', 15000);
        });
    });

    describe('Helpers axiosHelpers keycloakHeader', (): void => {
        it('Deve retornar AxiosRequestConfig com headers e timeout', (): void => {
            const config: AxiosRequestConfig = keycloakHeader;
            expect(config).toHaveProperty('headers', {
                'Content-Type': 'application/x-www-form-urlencoded',
            });
            expect(config).toHaveProperty('timeout', 15000);
        });
    });
});
