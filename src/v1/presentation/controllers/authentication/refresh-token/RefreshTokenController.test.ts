import {describe, it, beforeEach, jest, afterAll, expect} from '@jest/globals';

import {RefreshTokenController} from './RefreshTokenController';
import * as HttpResponseHelperModule from '@/v1/presentation/helpers/httpResponseHelper';
import {httpResponseHelper} from '@/v1/presentation/helpers/httpResponseHelper';

import {RefreshToken, RefreshTokenData} from '@/v1/domain/entities/authentication/refresh-token/RefreshToken';
import {Logger} from '@/v1/domain/repository/Logger';
import {InvalidParamError} from '@/v1/domain/shared/errors';
import {LoginResponse} from '@/v1/domain/entities/authentication/login/Login';

import {HttpRequest, HttpResponse} from '@/v1/presentation/protocols/Http';
import {HttpStatusCode} from 'axios';

jest.mock('@/main/factories/repository/logger/LoggerFactory', () => ({
    LoggerFactory: (): unknown => ({
        error: jest.fn(),
    }),
}));

const refreshToken = {
    validate: jest.fn(),
    refresh: jest.fn(),
} as unknown as jest.Mocked<RefreshToken>;

const logger = {
    info: jest.fn(),
} as unknown as jest.Mocked<Logger>;

describe('V1 presentation controllers refresh-token RefreshTokenController', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('handle()', (): void => {
        let controller: RefreshTokenController;

        const requestMock: HttpRequest = {
            body: {
                refreshToken: 'fake-token',
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
            controller = new RefreshTokenController(refreshToken, logger);
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve ocorrer erro ao fazer login', async (): Promise<void> => {
            const errorMock: HttpResponse = {
                statusCode: HttpStatusCode.BadRequest,
                body: {
                    error: 'Invalid param',
                },
            };

            jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
            jest.spyOn(controller['refreshToken'], 'validate').mockRejectedValueOnce(InvalidParamError);
            jest.spyOn(HttpResponseHelperModule, 'httpResponseHelper').mockReturnValueOnce(errorMock);

            const response = await controller.handle(requestMock);

            expect(response.statusCode).toBe(HttpStatusCode.BadRequest);
            expect(response.body).toEqual(errorMock.body);
            expect(controller['logger'].info).toHaveBeenCalledWith(
                expect.objectContaining({
                    origem: expect.any(String),
                    versao: expect.any(String),
                    destino: expect.any(String),
                    classe: expect.any(String),
                    body: {
                        refreshToken: requestMock.body.refreshToken,
                    } as RefreshTokenData,
                }),
            );
            expect(refreshToken.validate).toHaveBeenCalledWith(expect.any(Object as unknown as RefreshTokenData));
            expect(httpResponseHelper).toHaveBeenCalledTimes(1);
        });

        it('deve chamar o Login com os valores corretos', async (): Promise<void> => {
            jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
            jest.spyOn(controller['refreshToken'], 'validate').mockResolvedValueOnce(null);
            jest.spyOn(controller['refreshToken'], 'refresh').mockResolvedValueOnce(responseMock);
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
                        refreshToken: requestMock.body.refreshToken,
                    } as RefreshTokenData,
                }),
            );
            expect(refreshToken.validate).toHaveBeenCalledWith(expect.any(Object as unknown as RefreshTokenData));
            expect(refreshToken.refresh).toHaveBeenCalledWith(expect.any(Object as unknown as RefreshTokenData));
            expect(controller['logger'].info).toHaveBeenCalledWith(
                expect.objectContaining({
                    origem: expect.any(String),
                    versao: expect.any(String),
                    destino: expect.any(String),
                    classe: expect.any(String),
                    body: {
                        refreshToken: requestMock.body.refreshToken,
                    } as RefreshTokenData,
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
