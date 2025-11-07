import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import {HttpMethod} from './HttpMethod';
import {UnifaceBaseStruct} from '@/v1/domain/repository/HttpMethod';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {keycloakHeader} from '@/infrastructure/helpers/axiosHelpers';
import {AuthenticationError, InvalidParamError, NotFoundError, NotImplementedError, ServerError} from '@/v1/domain/shared/errors';

import * as HttpMethodErrorHelpers from '@/infrastructure/helpers/HttpMethodErrorHelpers';
import {UnassignedError} from '@/v1/domain/shared/errors/UnassignedError';
import {Logger} from '@/v1/domain/repository/Logger';

describe('token Token', (): void => {
    const requestAxios = {
        params: {
            value: 'fake-value',
        },
    };
    const requestAxiosWithBody = {
        value: {
            key: 'fake-value',
        },
        body: {
            key: 'fake-value',
        },
    };
    const responseAxios = {
        data: {
            value: 'fake-value',
        },
        status: 200,
    };

    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('authentication()', (): void => {
        let httpMethod: HttpMethod;
        const requestUnifaceBase: UnifaceBaseStruct = {
            root: {
                sistema: 'fakeSistema',
                operationId: 'fakeOperationId',
                versao: '1.0.0',
                'device-os': 'Android',
                'device-id': 'fakeDeviceId',
                'X-Correlation-ID': 'corr-id-123',
                'alternative-url': 'https://fake-alt-url.com',
                'production-redirect': 'https://fake-prod-redirect.com',
                payload: {key: 'value'},
                username: 'fakeUser',
            },
        };

        beforeEach((): void => {
            jest.clearAllMocks();
            const logger: Logger = {
                info: jest.fn(),
            } as unknown as Logger;
            httpMethod = new HttpMethod(logger);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve executar unifacePost sem sucesso', (): void => {
            jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Erro ao executar unifacePost'));
            jest.spyOn(httpMethod, 'errorHandler').mockRejectedValueOnce(new Error('Erro ao executar unifacePost'));

            const result = httpMethod.unifacePost('urlInvalida', requestUnifaceBase, 'fakeCaller');

            expect(result).rejects.toThrow(Error);
        });

        it('deve executar unifacePost com sucesso e retornar a resposta esperada', (): void => {
            jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            jest.spyOn(axios, 'post').mockResolvedValueOnce({} as AxiosResponse);

            const result = httpMethod.unifacePost('urlValida', requestUnifaceBase, 'fakeCaller');

            expect(result).toEqual(expect.any(Promise<AxiosResponse>));
            expect(httpMethod['logger'].info).toHaveBeenCalledWith(
                expect.objectContaining({
                    origem: expect.any(String),
                    versao: expect.any(String),
                    destino: requestUnifaceBase.root.operationId,
                    classe: expect.any(String),
                    body: requestUnifaceBase.root.payload,
                    payload: expect.any(String),
                }),
            );
        });
    });

    describe('post()', (): void => {
        let httpMethod: HttpMethod;

        beforeEach((): void => {
            jest.clearAllMocks();
            const logger: Logger = {
                info: jest.fn(),
            } as unknown as Logger;
            httpMethod = new HttpMethod(logger);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve executar post sem sucesso', (): void => {
            const error: ServerError = new ServerError('', 'Erro ao executar post');

            jest.spyOn(axios, 'post').mockRejectedValueOnce(error);
            jest.spyOn(httpMethod, 'errorHandler').mockRejectedValueOnce(error);

            const result = httpMethod.post('urlInvalida', requestAxios, keycloakHeader, 'fake-caller');

            expect(result).rejects.toThrow(error);
        });

        it('deve executar post com sucesso, tratada e retornar a resposta esperada 01', async (): Promise<void> => {
            const requestIncompleta = 'fake-value';

            jest.spyOn(axios, 'post').mockResolvedValueOnce(responseAxios);
            jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);

            const result = await httpMethod.post('urlValida', requestIncompleta, keycloakHeader, 'fake-caller');

            expect(result).toEqual(responseAxios);
        });

        it('deve executar post com sucesso, tratada e retornar a resposta esperada 02', async (): Promise<void> => {
            const requestIncompleta = '';

            jest.spyOn(axios, 'post').mockResolvedValueOnce(responseAxios);
            jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);

            const result = await httpMethod.post('urlValida', requestIncompleta, keycloakHeader, 'fake-caller');

            expect(result).toEqual(responseAxios);
        });

        it('deve executar post com sucesso, tratada e retornar a resposta esperada 03', async (): Promise<void> => {
            jest.spyOn(axios, 'post').mockResolvedValueOnce(responseAxios);
            jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);

            const result = await httpMethod.post('urlValida', requestAxiosWithBody, keycloakHeader, 'fake-caller');

            expect(result).toEqual(responseAxios);
        });

        it('deve executar post com sucesso e retornar a resposta esperada', async (): Promise<void> => {
            jest.spyOn(axios, 'post').mockResolvedValueOnce(responseAxios);
            jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);

            const result = await httpMethod.post('urlValida', requestAxios, keycloakHeader, 'fake-caller');

            expect(result).toEqual(responseAxios);
            expect(httpMethod['logger'].info).toHaveBeenCalledWith(
                expect.objectContaining({
                    origem: expect.any(String),
                    versao: expect.any(String),
                    destino: expect.any(String),
                    classe: expect.any(String),
                    body: expect.anything(),
                    response: responseAxios.data,
                    status: responseAxios.status,
                }),
            );
        });
    });

    describe('get()', (): void => {
        let httpMethod: HttpMethod;

        beforeEach((): void => {
            jest.clearAllMocks();
            const logger: Logger = {
                info: jest.fn(),
            } as unknown as Logger;
            httpMethod = new HttpMethod(logger);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve executar get sem sucesso', (): void => {
            const error: ServerError = new ServerError('', 'Erro ao executar get');

            jest.spyOn(axios, 'get').mockRejectedValueOnce(error);
            jest.spyOn(httpMethod, 'errorHandler').mockRejectedValueOnce(error);

            const result = httpMethod.get('urlInvalida', requestAxios, 'fake-caller');

            expect(result).rejects.toThrow(error);
        });

        it('deve executar get com sucesso e retornar a resposta esperada', async (): Promise<void> => {
            jest.spyOn(axios, 'get').mockResolvedValueOnce(responseAxios);
            jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);

            const result = await httpMethod.get('urlValida', requestAxios, 'fake-caller');

            expect(result).toEqual(responseAxios.data);
            expect(httpMethod['logger'].info).toHaveBeenCalledWith(
                expect.objectContaining({
                    origem: expect.any(String),
                    versao: expect.any(String),
                    destino: expect.any(String),
                    classe: expect.any(String),
                    response: responseAxios.data,
                    status: responseAxios.status,
                }),
            );
        });
    });

    describe('delete()', (): void => {
        let httpMethod: HttpMethod;

        beforeEach((): void => {
            jest.clearAllMocks();
            const logger: Logger = {
                info: jest.fn(),
            } as unknown as Logger;
            httpMethod = new HttpMethod(logger);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve executar delete sem sucesso', (): void => {
            const error: ServerError = new ServerError('', 'Erro ao executar delete');

            jest.spyOn(axios, 'delete').mockRejectedValueOnce(error);
            jest.spyOn(httpMethod, 'errorHandler').mockRejectedValueOnce(error);

            const result = httpMethod.delete('urlInvalida', requestAxios, 'fake-caller');

            expect(result).rejects.toThrow(error);
        });

        it('deve executar delete com sucesso e retornar a resposta esperada', async (): Promise<void> => {
            jest.spyOn(axios, 'delete').mockResolvedValueOnce(responseAxios);
            jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);

            const result = await httpMethod.delete('urlValida', requestAxios, 'fake-caller');

            expect(result).toEqual(responseAxios.data);
            expect(httpMethod['logger'].info).toHaveBeenCalledWith(
                expect.objectContaining({
                    origem: expect.any(String),
                    versao: expect.any(String),
                    destino: expect.any(String),
                    classe: expect.any(String),
                    response: responseAxios.data,
                    status: responseAxios.status,
                }),
            );
        });
    });

    describe('put()', (): void => {
        let httpMethod: HttpMethod;

        beforeEach((): void => {
            jest.clearAllMocks();
            const logger: Logger = {
                info: jest.fn(),
            } as unknown as Logger;
            httpMethod = new HttpMethod(logger);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve executar put sem sucesso', (): void => {
            const error: ServerError = new ServerError('', 'Erro ao executar put');

            jest.spyOn(axios, 'put').mockRejectedValueOnce(error);
            jest.spyOn(httpMethod, 'errorHandler').mockRejectedValueOnce(error);

            const result = httpMethod.put('urlInvalida', requestAxiosWithBody, keycloakHeader, 'fake-caller');

            expect(result).rejects.toThrow(error);
        });

        it('deve executar put com sucesso, tratada e retornar a resposta esperada 01', async (): Promise<void> => {
            const requestIncompleta = 'fake-value';

            jest.spyOn(axios, 'put').mockResolvedValueOnce(responseAxios);
            jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);

            const result = await httpMethod.put('urlValida', requestIncompleta, keycloakHeader, 'fake-caller');

            expect(result).toEqual(responseAxios.data);
        });

        it('deve executar put com sucesso, tratada e retornar a resposta esperada 02', async (): Promise<void> => {
            const requestIncompleta = '';

            jest.spyOn(axios, 'put').mockResolvedValueOnce(responseAxios);
            jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);

            const result = await httpMethod.put('urlValida', requestIncompleta, keycloakHeader, 'fake-caller');

            expect(result).toEqual(responseAxios.data);
        });

        it('deve executar put com sucesso, tratada e retornar a resposta esperada 03', async (): Promise<void> => {
            jest.spyOn(axios, 'put').mockResolvedValueOnce(responseAxios);
            jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);

            const result = await httpMethod.put('urlValida', requestAxiosWithBody, keycloakHeader, 'fake-caller');

            expect(result).toEqual(responseAxios.data);
            expect(httpMethod['logger'].info).toHaveBeenCalledWith(
                expect.objectContaining({
                    origem: expect.any(String),
                    versao: expect.any(String),
                    destino: expect.any(String),
                    classe: expect.any(String),
                    body: requestAxiosWithBody.body,
                    response: responseAxios.data,
                    status: responseAxios.status,
                }),
            );
        });

        it('deve executar put com sucesso e retornar a resposta esperada', async (): Promise<void> => {
            jest.spyOn(axios, 'put').mockResolvedValueOnce(responseAxios);
            jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);

            const result = await httpMethod.put('urlValida', requestAxios, keycloakHeader, 'fake-caller');

            expect(result).toEqual(responseAxios.data);
            expect(httpMethod['logger'].info).toHaveBeenCalledWith(
                expect.objectContaining({
                    origem: expect.any(String),
                    versao: expect.any(String),
                    destino: expect.any(String),
                    classe: expect.any(String),
                    body: requestAxios,
                    response: responseAxios.data,
                    status: responseAxios.status,
                }),
            );
        });
    });

    describe('errorHandler()', (): void => {
        let httpMethod: HttpMethod;
        const responseData: string = 'fake-error';

        beforeEach((): void => {
            jest.clearAllMocks();
            const logger: Logger = {
                info: jest.fn(),
            } as unknown as Logger;
            httpMethod = new HttpMethod(logger);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve tratar erro do unifacePost - Com código e com status', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: {value: 'fake-value', codigo: 500}, status: 500} as AxiosResponse;

            const result = await httpMethod.errorHandler(error, 'unifacePost');

            expect(result).toEqual(new ServerError(JSON.stringify(responseData)));
        });

        it('deve tratar erro do unifacePost - Sem código e com status', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: {}, status: 500} as AxiosResponse;

            const result = await httpMethod.errorHandler(error, 'unifacePost');

            expect(result).toEqual(new ServerError(JSON.stringify(responseData)));
        });

        it('deve tratar erro do unifacePost - Sem código e sem status', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: {value: 'fake-value'}} as AxiosResponse;

            const result = await httpMethod.errorHandler(error, 'unifacePost');

            expect(result).toEqual(new ServerError(JSON.stringify(responseData)));
        });

        it('deve tratar erro do unifacePost com sucesso', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: {value: 'fake-value', codigo: 500}} as AxiosResponse;

            const result = await httpMethod.errorHandler(error, 'unifacePost');

            expect(result).toEqual(new ServerError(JSON.stringify(responseData)));
        });

        it('deve tratar erro genérico - Com status', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: 'fake-value', status: 500} as AxiosResponse;

            const result = await httpMethod.errorHandler(error, 'http-method');

            expect(result).toEqual(new UnassignedError(JSON.stringify(responseData), '500'));
        });

        it('deve tratar erro genérico - Com responseStatus', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: {value: 'fake-value', codigo: 500}} as AxiosResponse;

            const result = await httpMethod.errorHandler(error, 'http-method');

            expect(result).toEqual(new UnassignedError(JSON.stringify(responseData), '500'));
        });

        it('deve tratar erro genérico - Sem status', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: 'fake-value'} as AxiosResponse;

            const result = await httpMethod.errorHandler(error, 'http-method');

            expect(result).toEqual(new UnassignedError(JSON.stringify(responseData), '500'));
        });

        it('deve tratar erro 452', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: 'fake-value', status: 452} as AxiosResponse;

            const result = await httpMethod.errorHandler(error, 'http-method');

            expect(result).toEqual(new UnassignedError(JSON.stringify(responseData), '452'));
        });

        it('deve tratar erro 453', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: 'fake-value', status: 453} as AxiosResponse;

            const result = await httpMethod.errorHandler(error, 'http-method');

            expect(result).toEqual(new UnassignedError(JSON.stringify(responseData), '453'));
        });

        it('deve tratar erro 454', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: 'fake-value', status: 454} as AxiosResponse;

            const result = await httpMethod.errorHandler(error, 'http-method');

            expect(result).toEqual(new UnassignedError(JSON.stringify(responseData), '454'));
        });

        it('deve tratar erro 401', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: 'fake-value', status: 401} as AxiosResponse;

            jest.spyOn(HttpMethodErrorHelpers, 'getAuthErrorMessage').mockReturnValueOnce('Usuário ou senha inválido!');

            const result = await httpMethod.errorHandler(error, 'http-method');

            expect(result).toEqual(new AuthenticationError(JSON.stringify(responseData), 'Usuário ou senha inválido!'));
        });

        it('deve tratar erro 400 sem token expirado', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: 'fake-value', status: 400} as AxiosResponse;

            jest.spyOn(HttpMethodErrorHelpers, 'isExpiredTokenError').mockReturnValue(false);

            const result = await httpMethod.errorHandler(error, 'http-method');

            expect(result).toEqual(new InvalidParamError(JSON.stringify(responseData)));
        });

        it('deve tratar erro 422 com token expirado', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: 'fake-value', status: 422} as AxiosResponse;

            jest.spyOn(HttpMethodErrorHelpers, 'isExpiredTokenError').mockReturnValue(true);

            const result = await httpMethod.errorHandler(error, 'http-method');

            expect(result).toEqual(new AuthenticationError(JSON.stringify(responseData), 'Token informado é inválido !'));
        });

        it('deve tratar erro 404', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: 'fake-value', status: 404} as AxiosResponse;
            error.message = 'fake-message';

            const result = await httpMethod.errorHandler(error, 'http-method');

            expect(result).toEqual(new NotFoundError(JSON.stringify(error), error.message));
        });

        it('deve tratar erro 501', async (): Promise<void> => {
            const error = new AxiosError(responseData);
            error.response = {data: 'fake-value', status: 501} as AxiosResponse;

            const result = await httpMethod.errorHandler(error, 'http-method');

            expect(result).toEqual(new NotImplementedError(responseData));
        });

        it('deve tratar erro genérico (1000)', async (): Promise<void> => {
            const responseData = 'Erro ao executar delete';
            const error = new AxiosError(responseData);
            error.response = {status: 1000} as AxiosResponse;

            const result = await httpMethod.errorHandler(error, 'http-method');

            expect(result).toEqual(new ServerError(responseData));
        });
    });
});
