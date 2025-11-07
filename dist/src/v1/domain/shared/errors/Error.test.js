"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Error_1 = require("./Error");
const ServerError_1 = require("./ServerError");
const AuthenticationError_1 = require("./AuthenticationError");
const NotFoundError_1 = require("./NotFoundError");
const axios_1 = require("axios");
(0, globals_1.describe)('v1 presentation controllers health-check', () => {
    (0, globals_1.describe)('ApplicationHealthController', () => {
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.describe)('handle()', () => {
            (0, globals_1.beforeEach)(() => {
                globals_1.jest.clearAllMocks();
            });
            (0, globals_1.afterAll)(() => {
                globals_1.jest.clearAllMocks();
            });
            (0, globals_1.it)('deve criar uma instância de Error com dsErrorNegocio', () => {
                const stackError = {
                    dsErroNegocio: 'fake-error-negocio',
                    dsErroTecnico: 'fake-error-tecnico',
                    contexto: 'fake-contexto',
                };
                const error = new Error_1.Error(new ServerError_1.ServerError(JSON.stringify(stackError)));
                (0, globals_1.expect)(error).toBeInstanceOf(Error_1.Error);
                (0, globals_1.expect)(error.status).toBe(axios_1.HttpStatusCode.BadRequest);
                (0, globals_1.expect)(error.mensagem).toBe(stackError.dsErroNegocio);
            });
            (0, globals_1.it)('deve criar uma instância de Error com dsErrorNegocio e status', () => {
                const stackError = {
                    codigo: 500,
                    dsErroNegocio: 'fake-error-negocio',
                    dsErroTecnico: 'fake-error-tecnico',
                    contexto: 'fake-contexto',
                };
                const error = new Error_1.Error(new ServerError_1.ServerError(JSON.stringify(stackError)));
                (0, globals_1.expect)(error).toBeInstanceOf(Error_1.Error);
                (0, globals_1.expect)(error.status).toBe(axios_1.HttpStatusCode.InternalServerError);
                (0, globals_1.expect)(error.mensagem).toBe(stackError.dsErroNegocio);
            });
            (0, globals_1.it)('deve criar uma instância de Error com mensagem', () => {
                const error = new Error_1.Error(new AuthenticationError_1.AuthenticationError('fake-error'));
                error.mensagem = 'Função não encontrada';
                (0, globals_1.expect)(error).toBeInstanceOf(Error_1.Error);
                (0, globals_1.expect)(error.mensagem).toBe('Função não encontrada');
            });
            (0, globals_1.it)('deve criar uma instância de Error com mensagem', () => {
                const error = new Error_1.Error(new AuthenticationError_1.AuthenticationError('fake-error'));
                error.mensagem = 'Função não encontrada';
                (0, globals_1.expect)(error).toBeInstanceOf(Error_1.Error);
                (0, globals_1.expect)(error.mensagem).toBe('Função não encontrada');
            });
            (0, globals_1.it)('deve criar uma instância de Error com NotFoundError', () => {
                const error = new Error_1.Error(new NotFoundError_1.NotFoundError('Função não encontrada'));
                (0, globals_1.expect)(error).toBeInstanceOf(Error_1.Error);
                (0, globals_1.expect)(error.mensagem).toBe('Aguarde alguns instantes e tente novamente.');
            });
            (0, globals_1.it)('deve criar uma instância de Error com ServerError', () => {
                const error = new Error_1.Error(new ServerError_1.ServerError('Erro interno do servidor'));
                (0, globals_1.expect)(error).toBeInstanceOf(Error_1.Error);
                (0, globals_1.expect)(error.mensagem).toBe('Aguarde alguns instantes e tente novamente.');
            });
        });
    });
});
