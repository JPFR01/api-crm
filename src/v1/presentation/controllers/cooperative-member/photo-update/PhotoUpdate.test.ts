import {describe, it, beforeEach, jest, afterAll, expect} from '@jest/globals';

import {PhotoUpdateController} from './PhotoUpdate';
import * as HttpResponseHelperModule from '@/v1/presentation/helpers/httpResponseHelper';
import {httpResponseHelper} from '@/v1/presentation/helpers/httpResponseHelper';
import * as HttpHelper from '@/v1/presentation/helpers/http-helper';

import {PhotoUpdate, PhotoUpdateBody, PhotoUpdateData} from '@/v1/domain/entities/cooperative-member/photo-update/PhotoUpdate';
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

const photoUpdate = {
    validate: jest.fn(),
    update: jest.fn(),
} as unknown as jest.Mocked<PhotoUpdate>;

const logger = {
    info: jest.fn(),
} as unknown as jest.Mocked<Logger>;

describe('V1 presentation controllers cooperative-member', (): void => {
    describe('photo-update PhotoUpdateController', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        describe('handle()', (): void => {
            let controller: PhotoUpdateController;

            const requestMock: HttpRequest = {
                body: {
                    cpfUsuario: '123.456.789-01',
                    imagemPerfil: 'fake-imagem',
                },
                headers: {
                    'device-id': 'fake-device-id',
                    'app-version': 'fake-app-version',
                    token: 'fake-token',
                    refreshToken: 'fake-refresh-token',
                },
            };

            const responseMock: HttpResponse = {
                statusCode: HttpStatusCode.NoContent,
                body: {},
            };

            beforeEach((): void => {
                jest.clearAllMocks();
                controller = new PhotoUpdateController(photoUpdate, logger);
            });

            afterAll((): void => {
                jest.clearAllMocks();
            });

            it('deve ocorrer erro ao atualizar foto', async (): Promise<void> => {
                const errorMock: HttpResponse = {
                    statusCode: HttpStatusCode.BadRequest,
                    body: {
                        error: 'Invalid param',
                    },
                };

                jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                jest.spyOn(controller['photoUpdate'], 'validate').mockRejectedValueOnce(InvalidParamError);
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
                        body: expect.any(Object as unknown as PhotoUpdateData),
                    }),
                );
                expect(photoUpdate.validate).toHaveBeenCalledWith(expect.any(Object as unknown as PhotoUpdateData));
                expect(httpResponseHelper).toHaveBeenCalledTimes(1);
            });

            it('deve atualizar a edição de foto com sucesso', async (): Promise<void> => {
                jest.spyOn(controller['logger'], 'info').mockResolvedValue(null);
                jest.spyOn(controller['photoUpdate'], 'validate').mockResolvedValueOnce(null);
                jest.spyOn(controller['photoUpdate'], 'update').mockResolvedValueOnce(null);
                jest.spyOn(HttpHelper, 'noContent').mockReturnValueOnce(responseMock);

                const response = await controller.handle(requestMock);

                expect(response.statusCode).toBe(HttpStatusCode.NoContent);
                expect(response.body).toEqual({});
                expect(controller['logger'].info).toHaveBeenCalledWith(
                    expect.objectContaining({
                        origem: expect.any(String),
                        versao: expect.any(String),
                        destino: expect.any(String),
                        classe: expect.any(String),
                        headerLog: expect.any(Object),
                        body: {
                            body: {
                                cpfUsuario: requestMock.body.cpfUsuario,
                                imagemPerfil: requestMock.body.imagemPerfil,
                            } as PhotoUpdateBody,
                            header: expect.any(Object) as Header,
                        } as PhotoUpdateData,
                    }),
                );
                expect(photoUpdate.validate).toHaveBeenCalledWith(expect.any(Object as unknown as PhotoUpdateData));
                expect(photoUpdate.update).toHaveBeenCalledWith(expect.any(Object as unknown as PhotoUpdateData));
                expect(controller['logger'].info).toHaveBeenCalledWith(
                    expect.objectContaining({
                        origem: expect.any(String),
                        versao: expect.any(String),
                        destino: expect.any(String),
                        classe: expect.any(String),
                        headerLog: expect.any(Object),
                        body: {
                            body: {
                                cpfUsuario: requestMock.body.cpfUsuario,
                                imagemPerfil: requestMock.body.imagemPerfil,
                            },
                            header: expect.any(Object) as Header,
                        } as PhotoUpdateData,
                        response: {},
                        status: expect.any(Number),
                    }),
                );
            });
        });
    });
});
