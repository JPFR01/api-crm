import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import * as UnifaceHelper from './UnifaceHelper';

import {filterNullUndefinedAttributes, unifaceBaseStructHelper, unifaceJsonToXmlHelper} from './UnifaceHelper';
import {UnifaceBaseStruct} from '@/v1/domain/repository/HttpMethod';
import {header} from '../../../../tests/mocks/data.mock';

interface JsonSimples {
    email: string;
    username: string;
    password?: string | null;
}

describe('v1 application helpers TokenHelper', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('filterNullUndefinedAttributes()', (): void => {
        const jsonValido: JsonSimples = {
            email: 'user@example.com',
            username: 'username',
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve remover atributos nulos corretamente', (): void => {
            const jsonNull: JsonSimples = {
                ...jsonValido,
                password: null,
            };
            expect(filterNullUndefinedAttributes(jsonNull)).toEqual(jsonValido);
        });

        it('deve remover atributos undefined corretamente', (): void => {
            const jsonUndefined: JsonSimples = {
                ...jsonValido,
                password: undefined,
            };
            expect(filterNullUndefinedAttributes(jsonUndefined)).toEqual(jsonValido);
        });
    });

    describe('unifaceBaseStructHelper()', (): void => {
        const baseStructUniface: UnifaceBaseStruct = {
            root: {
                sistema: 'PORTAL_APP',
                operationId: 'fake-operation',
                versao: 'v1',
                'X-Correlation-ID': 'corr-id-123',
                'alternative-url': 'https://fake-alt-url.com',
                'production-redirect': 'https://fake-prod-redirect.com',
                payload: 'payload',
            },
        };

        const unifaceOperation = {
            operationId: 'fake-operation',
            version: 'v1',
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve retornar a estrutura base correta', (): void => {
            jest.spyOn(UnifaceHelper, 'filterNullUndefinedAttributes').mockReturnValueOnce(baseStructUniface.root);

            expect(unifaceBaseStructHelper(unifaceOperation, 'payload', header)).toEqual(baseStructUniface);
        });
    });

    describe('unifaceJsonToXmlHelper()', (): void => {
        const baseStructUniface: UnifaceBaseStruct = {
            root: {
                sistema: 'PORTAL_APP',
                operationId: 'fake-operation',
                versao: 'v1',
                'X-Correlation-ID': 'corr-id-123',
                'alternative-url': 'https://fake-alt-url.com',
                'production-redirect': 'https://fake-prod-redirect.com',
                payload: 'payload',
            },
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve retornar uma string iniciando com "xml="', (): void => {
            const result = unifaceJsonToXmlHelper(baseStructUniface);
            expect(typeof result).toBe('string');
            expect(result.startsWith('xml=')).toBe(true);
        });
    });
});
