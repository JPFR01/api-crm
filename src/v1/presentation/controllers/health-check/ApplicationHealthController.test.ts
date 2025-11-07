import {describe, it, beforeEach, jest, afterAll, expect} from '@jest/globals';

import {HealthCheckController} from './ApplicationHealthController';

import * as HttpHelper from '@/v1/presentation/helpers/http-helper';

import {HealthCheck} from '@/v1/domain/entities/health-check/HealthCheck';
import {Logger} from '@/v1/domain/repository/Logger';

import {HttpResponse} from '@/v1/presentation/protocols/Http';
import {HttpStatusCode} from 'axios';

jest.mock('@/main/factories/repository/logger/LoggerFactory', () => ({
    LoggerFactory: (): unknown => ({
        error: jest.fn(),
    }),
}));

const healthCheck = {
    check: jest.fn(),
} as unknown as jest.Mocked<HealthCheck>;

const logger = {
    info: jest.fn(),
} as unknown as jest.Mocked<Logger>;

describe('v1 presentation controllers health-check', (): void => {
    describe('ApplicationHealthController', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        describe('handle()', (): void => {
            let controller: HealthCheckController;

            const responseMock: HttpResponse = {
                statusCode: HttpStatusCode.Ok,
                body: {
                    status: 'Ok',
                },
            };

            beforeEach((): void => {
                jest.clearAllMocks();
                controller = new HealthCheckController(healthCheck, logger);
            });

            afterAll((): void => {
                jest.clearAllMocks();
            });

            it('deve verificar a saúde da aplicação com sucesso', async (): Promise<void> => {
                jest.spyOn(controller['logger'], 'info').mockResolvedValueOnce(null);
                jest.spyOn(controller['healthCheck'], 'check').mockResolvedValueOnce('Ok');
                jest.spyOn(HttpHelper, 'ok').mockReturnValueOnce(responseMock);

                const response = await controller.handle();

                expect(response.statusCode).toBe(HttpStatusCode.Ok);
                expect(controller['logger'].info).toHaveBeenCalledWith(
                    expect.objectContaining({
                        origem: expect.any(String),
                        versao: expect.any(String),
                        destino: expect.any(String),
                        classe: expect.any(String),
                        headerLog: expect.any(Object),
                    }),
                );
                expect(healthCheck.check).toHaveBeenCalledTimes(1);
            });
        });
    });
});
