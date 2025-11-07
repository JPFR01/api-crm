"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const FormatUtils_1 = require("./FormatUtils");
(0, globals_1.describe)('v1 application helpers FormatUtils', () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('extractNumbers()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve extrair corretamente números de uma string', () => {
            (0, globals_1.expect)((0, FormatUtils_1.extractNumbers)('123abc456')).toEqual('123456');
            (0, globals_1.expect)((0, FormatUtils_1.extractNumbers)('1.2.3.4.5.6')).toEqual('123456');
            (0, globals_1.expect)((0, FormatUtils_1.extractNumbers)('123.456.789-01')).toEqual('12345678901');
            (0, globals_1.expect)((0, FormatUtils_1.extractNumbers)('123')).toEqual('123');
        });
    });
    (0, globals_1.describe)('extractUsername()', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve extrair corretamente o nome de usuário de um email', () => {
            (0, globals_1.expect)((0, FormatUtils_1.extractUsername)('user@example.com')).toEqual('user');
            (0, globals_1.expect)((0, FormatUtils_1.extractUsername)('admin123@example.com.br')).toEqual('admin123');
            (0, globals_1.expect)((0, FormatUtils_1.extractUsername)('test.user.123@sub.domain.com')).toEqual('test.user.123');
        });
        (0, globals_1.it)('deve extrair corretamente o nome de usuário', () => {
            (0, globals_1.expect)((0, FormatUtils_1.extractUsername)('user')).toEqual('user');
            (0, globals_1.expect)((0, FormatUtils_1.extractUsername)('admin')).toEqual('admin');
            (0, globals_1.expect)((0, FormatUtils_1.extractUsername)('test.user')).toEqual('test.user');
        });
    });
});
