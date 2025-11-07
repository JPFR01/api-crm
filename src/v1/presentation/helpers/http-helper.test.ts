import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import {
    badRequest,
    created,
    forbidden,
    noContent,
    notFound,
    notImplemented,
    ok,
    preconditionFailed,
    requestTimeout,
    serverError,
    unassigned,
    unauthorized,
} from './http-helper';
import {
    InvalidAppVersionError,
    InvalidRefreshTokenError,
    KeycloakTokenError,
    NotFoundError,
    NotImplementedError,
    ServerError,
    TimeoutConnectError,
} from '@/v1/domain/shared/errors';
import {HttpResponse} from '../protocols/Http';
import {Error} from '@/v1/domain/shared/errors/Error';
import {UnassignedError} from '@/v1/domain/shared/errors/UnassignedError';

jest.mock('@/v1/domain/shared/errors/Error', (): any => ({
    Error: jest.fn(),
}));

describe('v1 presentation helpers httpHelper', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('serverError()', (): void => {
        const errorResponse: HttpResponse = {
            statusCode: 500,
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente um erro HTTP "Unauthorized" com código padrão', (): void => {
            const error: Error = new Error(ServerError);
            error.status = null;
            errorResponse.body = error;

            expect(serverError(error)).toEqual(errorResponse);
        });

        it('deve validar corretamente um erro HTTP "Unauthorized" com código padrão', (): void => {
            const error: Error = new Error(ServerError);
            error.status = 500;
            errorResponse.body = error;

            expect(serverError(error)).toEqual(errorResponse);
        });
    });

    describe('notImplemented()', (): void => {
        const errorResponse: HttpResponse = {
            statusCode: 501,
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente um erro HTTP "Not Implemented" com código padrão', (): void => {
            const error: Error = new Error(NotImplementedError);
            error.status = null;
            errorResponse.body = error;

            expect(notImplemented(error)).toEqual(errorResponse);
        });
    });

    describe('badRequest()', (): void => {
        const errorResponse: HttpResponse = {
            statusCode: 400,
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente um erro HTTP "Bad Request" com código padrão', (): void => {
            const error: Error = new Error(InvalidAppVersionError);
            error.status = null;
            errorResponse.body = error;

            expect(badRequest(error)).toEqual(errorResponse);
        });
    });

    describe('preconditionFailed()', (): void => {
        const errorResponse: HttpResponse = {
            statusCode: 412,
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente um erro HTTP "Precondition" com código padrão', (): void => {
            const error: Error = new Error(InvalidRefreshTokenError);
            error.status = null;
            errorResponse.body = error;

            expect(preconditionFailed(error)).toEqual(errorResponse);
        });
    });

    describe('unauthorized()', (): void => {
        const errorResponse: HttpResponse = {
            statusCode: 401,
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente um erro HTTP "Unauthorized" com código padrão', (): void => {
            const error: Error = new Error(KeycloakTokenError);
            error.status = null;
            errorResponse.body = error;

            expect(unauthorized(error)).toEqual(errorResponse);
        });
    });

    describe('notFound()', (): void => {
        const errorResponse: HttpResponse = {
            statusCode: 404,
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente um erro HTTP "Not Found" com código padrão', (): void => {
            const error: Error = new Error(NotFoundError);
            error.status = null;
            errorResponse.body = error;

            expect(notFound(error)).toEqual(errorResponse);
        });
    });

    describe('requestTimeout()', (): void => {
        const errorResponse: HttpResponse = {
            statusCode: 408,
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente um erro HTTP "Request Timeout" com código padrão', (): void => {
            const error: Error = new Error(TimeoutConnectError);
            error.status = null;
            errorResponse.body = error;

            expect(requestTimeout(error)).toEqual(errorResponse);
        });
    });

    describe('forbidden()', (): void => {
        const errorResponse: HttpResponse = {
            statusCode: 403,
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente um erro HTTP "Forbidden" com código padrão', (): void => {
            const error: Error = new Error(Error);
            error.status = null;
            errorResponse.body = error;

            expect(forbidden(error)).toEqual(errorResponse);
        });
    });

    describe('unassigned()', (): void => {
        const errorResponse: HttpResponse = {
            statusCode: 430,
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente um erro HTTP "Unassigned" com código padrão', (): void => {
            const error: Error = new Error(UnassignedError);
            error.status = null;
            errorResponse.body = error;

            expect(unassigned(error, 430)).toEqual(errorResponse);
        });

        it('deve validar corretamente um erro HTTP "Unassigned" sem código padrão', (): void => {
            const error: Error = new Error(UnassignedError);
            error.status = 430;
            errorResponse.body = error;

            expect(unassigned(error, 430)).toEqual(errorResponse);
        });
    });

    describe('noContent()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente uma resposta HTTP "No Content" com mensagem', (): void => {
            const request = 'fake-message';
            const response = {
                statusCode: 204,
                body: {
                    mensagem: request,
                },
            };

            const result = noContent(request);
            expect(result).toEqual(response);
            expect(result).toEqual(
                expect.objectContaining({
                    statusCode: expect.any(Number),
                    body: expect.any(Object),
                }),
            );
        });

        it('deve validar corretamente uma resposta HTTP "No Content" com mensagem', (): void => {
            const response = {
                statusCode: 204,
                body: {},
            };

            const result = noContent();
            expect(result).toEqual(response);
            expect(result).toEqual(
                expect.objectContaining({
                    statusCode: expect.any(Number),
                    body: expect.any(Object),
                }),
            );
        });
    });

    describe('created()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente uma resposta HTTP "Created" com mensagem', (): void => {
            const request = 'fake-message';
            const response = {
                statusCode: 201,
                body: {data: request},
            };

            const result = created(request);
            expect(result).toEqual(response);
            expect(result).toEqual(
                expect.objectContaining({
                    statusCode: expect.any(Number),
                    body: expect.any(Object),
                }),
            );
        });

        it('deve validar corretamente uma resposta HTTP "Created" sem mensagem', (): void => {
            const response = {
                statusCode: 201,
            };

            const result = created();
            expect(result).toEqual(response);
            expect(result).toEqual(
                expect.objectContaining({
                    statusCode: expect.any(Number),
                }),
            );
        });
    });

    describe('ok()', (): void => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente uma resposta HTTP "Ok" com mensagem', (): void => {
            const request = 'fake-message';
            const response = {
                statusCode: 200,
                body: {data: request},
            };

            const result = ok(request);
            expect(result).toEqual(response);
            expect(result).toEqual(
                expect.objectContaining({
                    statusCode: expect.any(Number),
                    body: expect.any(Object),
                }),
            );
        });

        it('deve validar corretamente uma resposta HTTP "Ok" sem mensagem', (): void => {
            const request = '';
            const response = {
                statusCode: 200,
                body: {},
            };

            const result = ok(request);
            expect(result).toEqual(response);
            expect(result).toEqual(
                expect.objectContaining({
                    statusCode: expect.any(Number),
                    body: expect.any(Object),
                }),
            );
        });
    });
});
