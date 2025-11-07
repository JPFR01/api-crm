"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const axiosHelpers_1 = require("./axiosHelpers");
(0, globals_1.describe)('Helpers axiosHelpers', () => {
    const tokenValido = 'tokenValido';
    (0, globals_1.beforeAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('Helpers axiosHelpers headers', () => {
        (0, globals_1.it)('Deve retornar AxiosRequestConfig com headers e timeout', () => {
            const config = (0, axiosHelpers_1.headers)(tokenValido);
            (0, globals_1.expect)(config).toHaveProperty('headers', {
                authorization: `Bearer ${tokenValido}`,
            });
            (0, globals_1.expect)(config).toHaveProperty('timeout', 15000);
        });
    });
    (0, globals_1.describe)('Helpers axiosHelpers unifaceHeader', () => {
        (0, globals_1.it)('Deve retornar AxiosRequestConfig com headers e timeout', () => {
            const config = axiosHelpers_1.unifaceHeader;
            (0, globals_1.expect)(config).toHaveProperty('headers', {
                'Content-Type': 'text/plain',
            });
            (0, globals_1.expect)(config).toHaveProperty('timeout', 15000);
        });
    });
    (0, globals_1.describe)('Helpers axiosHelpers keycloakHeader', () => {
        (0, globals_1.it)('Deve retornar AxiosRequestConfig com headers e timeout', () => {
            const config = axiosHelpers_1.keycloakHeader;
            (0, globals_1.expect)(config).toHaveProperty('headers', {
                'Content-Type': 'application/x-www-form-urlencoded',
            });
            (0, globals_1.expect)(config).toHaveProperty('timeout', 15000);
        });
    });
});
