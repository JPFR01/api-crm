import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';
import {extractNumbers, extractUsername} from './FormatUtils';

describe('v1 application helpers FormatUtils', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('extractNumbers()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve extrair corretamente números de uma string', (): void => {
            expect(extractNumbers('123abc456')).toEqual('123456');
            expect(extractNumbers('1.2.3.4.5.6')).toEqual('123456');
            expect(extractNumbers('123.456.789-01')).toEqual('12345678901');
            expect(extractNumbers('123')).toEqual('123');
        });
    });

    describe('extractUsername()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve extrair corretamente o nome de usuário de um email', (): void => {
            expect(extractUsername('user@example.com')).toEqual('user');
            expect(extractUsername('admin123@example.com.br')).toEqual('admin123');
            expect(extractUsername('test.user.123@sub.domain.com')).toEqual('test.user.123');
        });

        it('deve extrair corretamente o nome de usuário', (): void => {
            expect(extractUsername('user')).toEqual('user');
            expect(extractUsername('admin')).toEqual('admin');
            expect(extractUsername('test.user')).toEqual('test.user');
        });
    });
});
