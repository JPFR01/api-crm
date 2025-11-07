"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const HealthCheck_1 = require("./HealthCheck");
(0, globals_1.describe)('v1 application entitites health-check HealthCheck', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('check()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve retornar "Ok" quando o sistema estiver saudável', async () => {
            const healthCheck = new HealthCheck_1.HealthCheck();
            (0, globals_1.expect)(healthCheck.check()).resolves.toEqual('Ok');
        });
    });
});
