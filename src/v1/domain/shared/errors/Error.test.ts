import {describe, it, beforeEach, jest, afterAll, expect} from '@jest/globals';

import {Error} from './Error';
import {ServerError} from './ServerError';
import {AuthenticationError} from './AuthenticationError';
import {NotFoundError} from './NotFoundError';
import {HttpStatusCode} from 'axios';

describe('v1 presentation controllers health-check', (): void => {
    describe('ApplicationHealthController', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        describe('handle()', (): void => {
            beforeEach((): void => {
                jest.clearAllMocks();
            });

            afterAll((): void => {
                jest.clearAllMocks();
            });

            it('deve criar uma instância de Error com dsErrorNegocio', (): void => {
                const stackError = {
                    dsErroNegocio: 'fake-error-negocio',
                    dsErroTecnico: 'fake-error-tecnico',
                    contexto: 'fake-contexto',
                };

                const error: Error = new Error(new ServerError(JSON.stringify(stackError)));

                expect(error).toBeInstanceOf(Error);
                expect(error.status).toBe(HttpStatusCode.BadRequest);
                expect(error.mensagem).toBe(stackError.dsErroNegocio);
            });

            it('deve criar uma instância de Error com dsErrorNegocio e status', (): void => {
                const stackError = {
                    codigo: 500,
                    dsErroNegocio: 'fake-error-negocio',
                    dsErroTecnico: 'fake-error-tecnico',
                    contexto: 'fake-contexto',
                };

                const error: Error = new Error(new ServerError(JSON.stringify(stackError)));

                expect(error).toBeInstanceOf(Error);
                expect(error.status).toBe(HttpStatusCode.InternalServerError);
                expect(error.mensagem).toBe(stackError.dsErroNegocio);
            });

            it('deve criar uma instância de Error com mensagem', (): void => {
                const error: Error = new Error(new AuthenticationError('fake-error'));
                error.mensagem = 'Função não encontrada';

                expect(error).toBeInstanceOf(Error);
                expect(error.mensagem).toBe('Função não encontrada');
            });

            it('deve criar uma instância de Error com mensagem', (): void => {
                const error: Error = new Error(new AuthenticationError('fake-error'));
                error.mensagem = 'Função não encontrada';

                expect(error).toBeInstanceOf(Error);
                expect(error.mensagem).toBe('Função não encontrada');
            });

            it('deve criar uma instância de Error com NotFoundError', (): void => {
                const error: Error = new Error(new NotFoundError('Função não encontrada'));
                expect(error).toBeInstanceOf(Error);
                expect(error.mensagem).toBe('Aguarde alguns instantes e tente novamente.');
            });

            it('deve criar uma instância de Error com ServerError', (): void => {
                const error: Error = new Error(new ServerError('Erro interno do servidor'));
                expect(error).toBeInstanceOf(Error);
                expect(error.mensagem).toBe('Aguarde alguns instantes e tente novamente.');
            });
        });
    });
});
