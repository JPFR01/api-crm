import {expect, describe, it, beforeEach, jest, afterAll} from '@jest/globals';

import * as HttpHelper from './http-helper';
import * as FormatUtils from '../../application/helpers/FormatUtils';

import {HttpResponse} from '../protocols/Http';
import {httpResponseHelper} from './httpResponseHelper';
import {
    AuthenticationError,
    ExpiredJwtError,
    InvalidAppVersionError,
    InvalidHeaderError,
    InvalidParamError,
    InvalidRefreshTokenError,
    JsonWebTokenError,
    KeycloakTokenError,
    NotFoundError,
    NotImplementedError,
    PermissionError,
    ServerError,
    TimeoutConnectError,
} from '@/v1/domain/shared/errors';
import {UnassignedError} from '@/v1/domain/shared/errors/UnassignedError';

jest.mock('@/main/factories/repository/logger/LoggerFactory', (): any => ({
    LoggerFactory: (): any => ({
        error: jest.fn(),
    }),
}));

jest.mock('@/v1/domain/shared/errors/Error', (): any => ({
    Error: jest.fn(),
}));

describe('v1 presentation helpers httpResponseHelper', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    afterAll((): void => {
        jest.clearAllMocks();
    });

    describe('errorValidator()', (): void => {
        const errorHttp: HttpResponse = {
            body: {
                error: '',
            },
        };

        beforeEach((): void => {
            jest.clearAllMocks();
        });

        afterAll((): void => {
            jest.clearAllMocks();
        });

        it('deve validar corretamente um erro HTTP "Unauthorized"', (): void => {
            const errorUnauthorized: HttpResponse = {
                ...errorHttp,
                statusCode: 401,
            };
            const jsonWebTokenError: Error = new JsonWebTokenError();
            const authenticationError: Error = new AuthenticationError();
            const expiredJwtError: Error = new ExpiredJwtError();
            const permissionError: Error = new PermissionError();
            const keycloakTokenError: Error = new KeycloakTokenError();

            jest.spyOn(HttpHelper, 'unauthorized').mockReturnValue(errorUnauthorized);

            expect(httpResponseHelper(jsonWebTokenError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorUnauthorized);
            expect(httpResponseHelper(authenticationError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorUnauthorized);
            expect(httpResponseHelper(expiredJwtError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorUnauthorized);
            expect(httpResponseHelper(permissionError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorUnauthorized);
            expect(httpResponseHelper(keycloakTokenError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorUnauthorized);
        });

        it('deve validar corretamente um erro HTTP "Bad Request"', (): void => {
            const errorBadRequest: HttpResponse = {
                ...errorHttp,
                statusCode: 400,
            };
            const invalidAppVersionError: Error = new InvalidAppVersionError();
            const invalidParamError: Error = new InvalidParamError();

            jest.spyOn(HttpHelper, 'badRequest').mockReturnValue(errorBadRequest);

            expect(httpResponseHelper(invalidAppVersionError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorBadRequest);
            expect(httpResponseHelper(invalidParamError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorBadRequest);
        });

        it('deve validar corretamente um erro HTTP "Timeout"', (): void => {
            const errorTimeout: HttpResponse = {
                ...errorHttp,
                statusCode: 408,
            };
            const timeoutConnectError: Error = new TimeoutConnectError();

            jest.spyOn(HttpHelper, 'requestTimeout').mockReturnValue(errorTimeout);

            expect(httpResponseHelper(timeoutConnectError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorTimeout);
        });

        it('deve validar corretamente um erro HTTP "Precondition Failed"', (): void => {
            const errorPreconditionFailed: HttpResponse = {
                ...errorHttp,
                statusCode: 412,
            };
            const invalidRefreshTokenError: Error = new InvalidRefreshTokenError();
            const invalidHeaderError: Error = new InvalidHeaderError();

            jest.spyOn(HttpHelper, 'preconditionFailed').mockReturnValue(errorPreconditionFailed);

            expect(httpResponseHelper(invalidRefreshTokenError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(
                errorPreconditionFailed,
            );
            expect(httpResponseHelper(invalidHeaderError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorPreconditionFailed);
        });

        it('deve validar corretamente um erro HTTP "Unassigned"', (): void => {
            const errorUnassigned: HttpResponse = {
                ...errorHttp,
                statusCode: 430,
            };
            const unassignedError: Error = new UnassignedError('fake-stack', '430', 'Unassigned Error');

            jest.spyOn(FormatUtils, 'extractNumbers').mockReturnValue('430');
            jest.spyOn(HttpHelper, 'unassigned').mockReturnValue(errorUnassigned);

            expect(httpResponseHelper(unassignedError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorUnassigned);
        });

        it('deve validar corretamente um erro HTTP "Not Found"', (): void => {
            const errorNotFound: HttpResponse = {
                ...errorHttp,
                statusCode: 404,
            };
            const notFoundError: Error = new NotFoundError();

            jest.spyOn(HttpHelper, 'notFound').mockReturnValue(errorNotFound);

            expect(httpResponseHelper(notFoundError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorNotFound);
        });

        it('deve validar corretamente um erro HTTP "Not Implemented"', (): void => {
            const errorNotImplemented: HttpResponse = {
                ...errorHttp,
                statusCode: 501,
            };
            const notImplementedError: Error = new NotImplementedError();

            jest.spyOn(HttpHelper, 'notImplemented').mockReturnValue(errorNotImplemented);

            expect(httpResponseHelper(notImplementedError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorNotImplemented);
        });

        it('deve validar corretamente um erro HTTP "Server Error"', (): void => {
            const errorServerError: HttpResponse = {
                ...errorHttp,
                statusCode: 500,
            };
            const serverError: Error = new ServerError();

            jest.spyOn(HttpHelper, 'serverError').mockReturnValue(errorServerError);

            expect(httpResponseHelper(serverError, null, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorServerError);
        });

        it('deve validar corretamente um erro HTTP "Server Error" com log', (): void => {
            const dadosSimples = 'fake-value';
            const dadosBody = {
                body: 'fake-body',
            };
            const dadosData = {
                data: 'fake-data',
            };
            const errorServerError: HttpResponse = {
                ...errorHttp,
                statusCode: 500,
            };
            const serverError: Error = new ServerError();

            jest.spyOn(HttpHelper, 'serverError').mockReturnValue(errorServerError);

            expect(httpResponseHelper(serverError, dadosSimples, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorServerError);
            expect(httpResponseHelper(serverError, dadosBody, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorServerError);
            expect(httpResponseHelper(serverError, dadosData, 'fake-origem', 'fake-destino', 'Class.function')).toEqual(errorServerError);
        });
    });
});
