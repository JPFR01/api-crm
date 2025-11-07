import {describe, it, beforeEach, jest, afterAll, expect} from '@jest/globals';

import {LoginController} from './LoginController';
import * as HttpResponseHelperModule from '@/v1/presentation/helpers/httpResponseHelper';
import {httpResponseHelper} from '@/v1/presentation/helpers/httpResponseHelper';

import {Login, LoginBody, LoginData, LoginResponse} from '@/v1/domain/entities/authentication/login/Login';
import {Logger} from '@/v1/domain/repository/Logger';
import {InvalidParamError} from '@/v1/domain/shared/errors';

import {HttpRequest, HttpResponse} from '@/v1/presentation/protocols/Http';
import {HttpStatusCode} from 'axios';

jest.mock('@/main/factories/repository/logger/LoggerFactory', () => ({
    LoggerFactory: (): unknown => ({
        error: jest.fn(),
    }),
}));

const login = {
    validate: jest.fn(),
    login: jest.fn(),
} as unknown as jest.Mocked<Login>;

const logger = {
    info: jest.fn(),
} as unknown as jest.Mocked<Logger>;

describe('V1 presentation controllers authentication', (): void => {
    describe('login LoginController', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        describe('handle()', (): void => {
            let controller: LoginController;

            const requestMock: HttpRequest = {
                body: {
                    usernameOrEmail: 'user@example.com',
                    password: 'password',
                },
            };
            const responseMock: LoginResponse = {
                accessToken: 'fake-token',
                expiresIn: 100,
                refreshExpiresIn: 200,
                refreshToken: 'fake-token',
                tokenType: 'Bearer fake-token',
                givenName: 'fake-given',
                familyName: 'fake-family',
            };

            beforeEach((): void => {
                jest.clearAllMocks();
                controller = new LoginController(login, logger);
            });

            afterAll((): void => {
                jest.clearAllMocks();
            });

            it('deve ocorrer erro ao fazer login', async (): Promise<void> => {
                const errorMock: HttpResponse = {
                    statusCode: 400,
                    body: {
                        error: 'Invalid param',
                    },
                };

                jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                jest.spyOn(controller['login'], 'validate').mockRejectedValueOnce(InvalidParamError);
                jest.spyOn(HttpResponseHelperModule, 'httpResponseHelper').mockReturnValueOnce(errorMock);

                const response = await controller.handle(requestMock);

                expect(response.statusCode).toBe(HttpStatusCode.BadRequest);
                expect(response.body).toEqual({error: 'Invalid param'});
                expect(controller['logger'].info).toHaveBeenCalledWith(
                    expect.objectContaining({
                        origem: expect.any(String),
                        versao: expect.any(String),
                        destino: expect.any(String),
                        classe: expect.any(String),
                        body: {
                            body: {
                                usernameOrEmail: requestMock.body.usernameOrEmail,
                                password: requestMock.body.password,
                            } as LoginBody,
                        } as LoginData,
                    }),
                );
                expect(login.validate).toHaveBeenCalledWith(expect.any(Object as unknown as LoginData));
                expect(httpResponseHelper).toHaveBeenCalledTimes(1);
            });

            it('deve chamar o Login com os valores corretos', async (): Promise<void> => {
                jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                jest.spyOn(controller['login'], 'validate').mockResolvedValueOnce(null);
                jest.spyOn(controller['login'], 'login').mockResolvedValueOnce(responseMock);
                jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);

                const response = await controller.handle(requestMock);

                expect(response.statusCode).toBe(HttpStatusCode.Ok);
                expect(response.body).toEqual({data: responseMock});
                expect(controller['logger'].info).toHaveBeenCalledWith(
                    expect.objectContaining({
                        origem: expect.any(String),
                        versao: expect.any(String),
                        destino: expect.any(String),
                        classe: expect.any(String),
                        body: {
                            body: {
                                usernameOrEmail: requestMock.body.usernameOrEmail,
                                password: requestMock.body.password,
                            } as LoginBody,
                        } as LoginData,
                    }),
                );
                expect(login.validate).toHaveBeenCalledWith(expect.any(Object as unknown as LoginData));
                expect(login.login).toHaveBeenCalledWith(expect.any(Object as unknown as LoginData));
                expect(controller['logger'].info).toHaveBeenCalledWith(
                    expect.objectContaining({
                        origem: expect.any(String),
                        versao: expect.any(String),
                        destino: expect.any(String),
                        classe: expect.any(String),
                        body: {
                            body: {
                                usernameOrEmail: requestMock.body.usernameOrEmail,
                                password: requestMock.body.password,
                            } as LoginBody,
                        } as LoginData,
                        response: {
                            accessToken: responseMock.accessToken,
                            expiresIn: responseMock.expiresIn,
                            refreshExpiresIn: responseMock.refreshExpiresIn,
                            refreshToken: responseMock.refreshToken,
                            tokenType: responseMock.tokenType,
                            givenName: responseMock.givenName,
                            familyName: responseMock.familyName,
                        } as LoginResponse,
                        status: expect.any(Number),
                    }),
                );
            });
        });
    });
});
