import {expect, describe, it, beforeEach, jest} from '@jest/globals';

import * as LoggerHelper from './LoggerHelper';

describe('helpers LoggerHelper', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    describe('helpers LoggerHelper', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        describe('helpers LoggerHelper maskFieldsHelper', (): void => {
            beforeEach((): void => {
                jest.clearAllMocks();
            });

            it('Deve retornar undefined se parâmetro for falsy', (): void => {
                expect(LoggerHelper.maskFieldsHelper(undefined)).toBeUndefined();
                expect(LoggerHelper.maskFieldsHelper(null)).toBeUndefined();
                expect(LoggerHelper.maskFieldsHelper('')).toBeUndefined();
            });

            it('Deve retornar undefined se parâmetro não for objeto válido', (): void => {
                expect(LoggerHelper.maskFieldsHelper('not-json')).toBeUndefined();
            });

            it('Deve retornar um objeto com dados não sensíveis', (): void => {
                const mockJson: unknown = {usernameOrEmail: 'user'};

                const result: unknown = LoggerHelper.maskFieldsHelper(mockJson);
                expect(result).toEqual(mockJson);
            });

            it('Deve retornar um objeto com objetos aninhados', (): void => {
                const mockJson: unknown = {
                    body: {
                        header: {
                            connection: 'keep-alive',
                        },
                    },
                };

                const result: unknown = LoggerHelper.maskFieldsHelper(mockJson);
                expect(result).toEqual(mockJson);
            });

            it('Deve retornar um objeto se parâmetro for objeto na string', (): void => {
                const result: unknown = LoggerHelper.maskFieldsHelper('{"value": "not-json-valid"}');
                expect(result).toBeDefined();
            });

            it('Deve retornar undefined se parâmetro não for um objeto válido', (): void => {
                const result: unknown = LoggerHelper.maskFieldsHelper([1, 2, 3]);
                expect(result).toBeUndefined();
            });

            it('Deve retornar um objeto com atributo sensível', (): void => {
                const mockJson: unknown = {
                    password: '102030',
                };

                const result: unknown = LoggerHelper.maskFieldsHelper(mockJson);
                expect(result).toHaveProperty('password', '*');
            });

            it('Deve retornar um objeto com token mascarado', (): void => {
                const mockJson: unknown = {authorization: 'Bearer mockTokenValido'};

                const result: unknown = LoggerHelper.maskFieldsHelper(mockJson);
                expect(result).toHaveProperty('authorization', 'Bearer *');
            });
        });

        describe('helpers LoggerHelper maskXmlFieldsHelper', (): void => {
            beforeEach((): void => {
                jest.clearAllMocks();
            });

            it('Deve retornar undefined se data for falsy', (): void => {
                expect(LoggerHelper.maskXmlFieldsHelper('')).toBeUndefined();
            });

            it('Deve retornar XML mascarado', (): void => {
                const mockXml: string = '<root><element>value</element></root>';
                const result: string = LoggerHelper.maskXmlFieldsHelper(mockXml);

                expect(result).toBe(mockXml);
            });

            it('Deve retornar erro se XML for inválido', (): void => {
                const mockXml: string = '<root><element';
                expect(() => LoggerHelper.maskXmlFieldsHelper(mockXml)).toThrow();
            });
        });
    });
});
