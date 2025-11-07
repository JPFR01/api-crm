import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import {Permission} from './Permission';

import {HttpMethod} from '@/v1/domain/repository/HttpMethod';
import {PermissionData} from '@/v1/domain/repository/permission/Permission';
import {InvalidParamError, PermissionError} from '@/v1/domain/shared/errors';

import {HttpResponse} from '@/v1/presentation/protocols/Http';

describe('permission Permission', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('validate()', (): void => {
        let permission: Permission;
        const permissionData: PermissionData = {
            usernameOrEmail: 'user@example.com',
        };
        const httpResponse: HttpResponse = {
            statusCode: 200,
            body: {},
            data: {},
            keys: {},
        };

        beforeEach((): void => {
            jest.clearAllMocks();
            const httpMethodsMock: HttpMethod = {
                get: jest.fn(),
            } as unknown as HttpMethod;
            permission = new Permission(httpMethodsMock);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve ocorrer um erro caso nome de usuário ou email não seja fornecido', (): void => {
            const result = permission.validate({
                usernameOrEmail: '',
            });

            expect(result).rejects.toThrow(InvalidParamError);
        });

        it('deve ocorrer um erro caso usuário não possua permissão', (): void => {
            httpResponse.data = {
                hasPermission: false,
            };

            jest.spyOn(permission['httpMethods'], 'get').mockResolvedValue(httpResponse);

            const result = permission.validate(permissionData);

            expect(result).rejects.toThrow(PermissionError);
        });

        it('deve validar os dados de permissão do usuário', (): void => {
            httpResponse.data = {
                hasPermission: true,
            };

            jest.spyOn(permission['httpMethods'], 'get').mockResolvedValue(httpResponse);

            const result = permission.validate(permissionData);

            expect(result).resolves.toBeUndefined();
        });
    });
});
