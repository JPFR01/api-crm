import {describe, it, beforeEach, jest, afterAll, expect} from '@jest/globals';

import {RetrievePersonalDataController} from './RetrievePersonalDataController';

import * as HttpResponseHelperModule from '@/v1/presentation/helpers/httpResponseHelper';
import {httpResponseHelper} from '@/v1/presentation/helpers/httpResponseHelper';
import * as HttpHelper from '@/v1/presentation/helpers/http-helper';

import {
    RetrievePersonalData,
    RetrievePersonalDataRequest,
    RetrievePersonalDataResponse,
} from '@/v1/domain/entities/cooperative-member/retrieve-personal-data/RetrievePersonalData';
import {Logger} from '@/v1/domain/repository/Logger';
import {InvalidParamError} from '@/v1/domain/shared/errors';

import {HttpRequest, HttpResponse} from '@/v1/presentation/protocols/Http';
import {HttpStatusCode} from 'axios';
import {Header} from '@/infrastructure/helpers/HeaderHelper';

jest.mock('@/main/factories/repository/logger/LoggerFactory', () => ({
    LoggerFactory: (): unknown => ({
        error: jest.fn(),
    }),
}));

const personalData = {
    validate: jest.fn(),
    retrieve: jest.fn(),
} as unknown as jest.Mocked<RetrievePersonalData>;

const logger = {
    info: jest.fn(),
} as unknown as jest.Mocked<Logger>;

describe('v1 presentation controllers cooperative-member', (): void => {
    describe('retrieve-personal-data RetrievePersonalDataController', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        describe('handle()', (): void => {
            let controller: RetrievePersonalDataController;

            const requestMock: HttpRequest = {
                body: {
                    cpfUsuario: '123.456.789-01',
                },
                headers: {
                    'device-id': 'fake-device-id',
                    'app-version': 'fake-app-version',
                    token: 'fake-token',
                    refreshToken: 'fake-refresh-token',
                },
            };

            const responseMock: RetrievePersonalDataResponse = {
                codigoMatricula: 123456,
                cpfUsuario: '123.456.789-01',
                nomeUsuario: 'user',
                fotoUsuario: 'fake-imagem',
                codigoLocalAcerto: 100,
                nomeLocalAcerto: 'fake-local-acerto',
                dataAdmissao: new Date(),
            };

            beforeEach((): void => {
                jest.clearAllMocks();
                controller = new RetrievePersonalDataController(personalData, logger);
            });

            afterAll((): void => {
                jest.clearAllMocks();
            });

            it('deve ocorrer erro ao buscar dados de cooperado', async (): Promise<void> => {
                const errorMock: HttpResponse = {
                    statusCode: HttpStatusCode.BadRequest,
                    body: {
                        error: 'Invalid param',
                    },
                };

                jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                jest.spyOn(controller['personalData'], 'validate').mockRejectedValueOnce(InvalidParamError);
                jest.spyOn(HttpResponseHelperModule, 'httpResponseHelper').mockReturnValueOnce(errorMock);

                const response = await controller.handle(requestMock);

                expect(response.statusCode).toBe(HttpStatusCode.BadRequest);
                expect(controller['logger'].info).toHaveBeenCalledWith(
                    expect.objectContaining({
                        origem: expect.any(String),
                        versao: expect.any(String),
                        destino: expect.any(String),
                        classe: expect.any(String),
                        headerLog: expect.any(Object),
                        body: {
                            cpfUsuario: requestMock.body.cpfUsuario,
                            header: expect.any(Object) as Header,
                        } as RetrievePersonalDataRequest,
                    }),
                );
                expect(personalData.validate).toHaveBeenCalledWith(expect.any(Object as unknown as RetrievePersonalDataRequest));
                expect(httpResponseHelper).toHaveBeenCalledTimes(1);
            });

            it('deve atualizar a edição de foto com sucesso', async (): Promise<void> => {
                jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                jest.spyOn(controller['personalData'], 'validate').mockResolvedValueOnce(null);
                jest.spyOn(controller['personalData'], 'retrieve').mockResolvedValueOnce(responseMock);
                jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                jest.spyOn(HttpHelper, 'noContent').mockReturnValueOnce({
                    statusCode: HttpStatusCode.Ok,
                    body: responseMock,
                });

                const response = await controller.handle(requestMock);

                expect(response.statusCode).toBe(HttpStatusCode.Ok);
                expect(response.body).toEqual({data: responseMock});
                expect(controller['logger'].info).toHaveBeenCalledWith(
                    expect.objectContaining({
                        origem: expect.any(String),
                        versao: expect.any(String),
                        destino: expect.any(String),
                        classe: expect.any(String),
                        headerLog: expect.any(Object),
                        body: {
                            cpfUsuario: requestMock.body.cpfUsuario,
                            header: expect.any(Object) as Header,
                        } as RetrievePersonalDataRequest,
                    }),
                );
                expect(personalData.validate).toHaveBeenCalledWith(expect.any(Object as unknown as RetrievePersonalDataRequest));
                expect(personalData.retrieve).toHaveBeenCalledWith(expect.any(Object as unknown as RetrievePersonalDataRequest));
                expect(controller['logger'].info).toHaveBeenCalledWith(
                    expect.objectContaining({
                        origem: expect.any(String),
                        versao: expect.any(String),
                        destino: expect.any(String),
                        classe: expect.any(String),
                        body: {
                            cpfUsuario: requestMock.body.cpfUsuario,
                            header: expect.any(Object) as Header,
                        } as RetrievePersonalDataRequest,
                        response: {
                            codigoMatricula: responseMock.codigoMatricula,
                            cpfUsuario: responseMock.cpfUsuario,
                            nomeUsuario: responseMock.nomeUsuario,
                            fotoUsuario: responseMock.fotoUsuario,
                            codigoLocalAcerto: responseMock.codigoLocalAcerto,
                            nomeLocalAcerto: responseMock.nomeLocalAcerto,
                            dataAdmissao: responseMock.dataAdmissao,
                        } as RetrievePersonalDataResponse,
                        status: expect.any(Number),
                    }),
                );
            });
        });
    });
});
