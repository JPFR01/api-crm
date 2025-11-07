"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Permission_1 = require("./Permission");
const errors_1 = require("../../../../v1/domain/shared/errors");
(0, globals_1.describe)('permission Permission', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('validate()', () => {
        let permission;
        const permissionData = {
            usernameOrEmail: 'user@example.com',
        };
        const httpResponse = {
            statusCode: 200,
            body: {},
            data: {},
            keys: {},
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const httpMethodsMock = {
                get: globals_1.jest.fn(),
            };
            permission = new Permission_1.Permission(httpMethodsMock);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve ocorrer um erro caso nome de usuário ou email não seja fornecido', () => {
            const result = permission.validate({
                usernameOrEmail: '',
            });
            (0, globals_1.expect)(result).rejects.toThrow(errors_1.InvalidParamError);
        });
        (0, globals_1.it)('deve ocorrer um erro caso usuário não possua permissão', () => {
            httpResponse.data = {
                hasPermission: false,
            };
            globals_1.jest.spyOn(permission['httpMethods'], 'get').mockResolvedValue(httpResponse);
            const result = permission.validate(permissionData);
            (0, globals_1.expect)(result).rejects.toThrow(errors_1.PermissionError);
        });
        (0, globals_1.it)('deve validar os dados de permissão do usuário', () => {
            httpResponse.data = {
                hasPermission: true,
            };
            globals_1.jest.spyOn(permission['httpMethods'], 'get').mockResolvedValue(httpResponse);
            const result = permission.validate(permissionData);
            (0, globals_1.expect)(result).resolves.toBeUndefined();
        });
    });
});
