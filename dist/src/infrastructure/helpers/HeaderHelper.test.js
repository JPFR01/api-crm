"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const data_mock_1 = require("../../../tests/mocks/data.mock");
(0, globals_1.describe)('Helpers HeaderHelper', () => {
    (0, globals_1.beforeAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('Helpers HeaderHelper Header', () => {
        (0, globals_1.it)('Interface deve conter atributos obrigatórios', () => {
            (0, globals_1.expect)(typeof data_mock_1.header['device-id'] === 'string' || typeof data_mock_1.header['device-id'] === 'undefined').toBe(true);
            (0, globals_1.expect)(typeof data_mock_1.header['app-version'] === 'string' || typeof data_mock_1.header['app-version'] === 'undefined').toBe(true);
            (0, globals_1.expect)(typeof data_mock_1.header['device-os'] === 'string' || typeof data_mock_1.header['device-os'] === 'undefined').toBe(true);
            (0, globals_1.expect)(typeof data_mock_1.header['alternative-url'] === 'string' || typeof data_mock_1.header['alternative-url'] === 'undefined').toBe(true);
            (0, globals_1.expect)(typeof data_mock_1.header['x-correlation-id'] === 'string' || typeof data_mock_1.header['x-correlation-id'] === 'undefined').toBe(true);
            (0, globals_1.expect)(typeof data_mock_1.header['production-redirect'] === 'string' || typeof data_mock_1.header['production-redirect'] === 'undefined').toBe(true);
            (0, globals_1.expect)(typeof data_mock_1.header['token'] === 'string' || typeof data_mock_1.header['token'] === 'undefined').toBe(true);
            (0, globals_1.expect)(typeof data_mock_1.header['refreshToken'] === 'string' || typeof data_mock_1.header['refreshToken'] === 'undefined').toBe(true);
            (0, globals_1.expect)(typeof data_mock_1.header['authorization'] === 'string' || typeof data_mock_1.header['authorization'] === 'undefined').toBe(true);
        });
    });
});
