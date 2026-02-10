import {LoggerFactory} from '@/main/factories/repository/logger/LoggerFactory';
import {extractNumbers} from '@/v1/application/helpers/FormatUtils';
import {Logger} from '@/v1/domain/repository/Logger';
import {
    AuthenticationError,
    ExpiredJwtError,
    InvalidAppVersionError,
    InvalidParamError,
    InvalidRefreshTokenError,
    KeycloakTokenError,
    NotFoundError,
    NotImplementedError,
    PermissionError,
    TimeoutConnectError,
} from '@/v1/domain/shared/errors';
import {Error} from '@/v1/domain/shared/errors/Error';
import {InvalidHeaderError} from '@/v1/domain/shared/errors/InvalidHeaderError';
import {JsonWebTokenError} from '@/v1/domain/shared/errors/JsonWebTokenError';
import {UnassignedError} from '@/v1/domain/shared/errors/UnassignedError';
import {
    unauthorized,
    badRequest,
    preconditionFailed,
    requestTimeout,
    serverError,
    unassigned,
    notFound,
    notImplemented,
} from '@/v1/presentation/helpers/http-helper';
import {HttpResponse} from '@/v1/presentation/protocols/Http';

const logger: Logger = LoggerFactory();

export function httpResponseHelper(error: any, data: any, origin: string, destiny: string, controller: string): HttpResponse {
    const treatedError: Error = new Error(error);

    console.log(treatedError)

    const httpResponse: HttpResponse = errorValidator(error, treatedError);

    if (data)
        logger.error({
            origem: origin,
            versao: 'v1',
            destino: destiny,
            classe: controller,
            body: data.data ?? data.body ?? data,
            erro: error.stack,
            status: httpResponse.statusCode,
        });

    return httpResponse;
}

function errorValidator(error: any, treatedError: Error): HttpResponse {
    switch (error.constructor) {
        case JsonWebTokenError:
        case AuthenticationError:
        case ExpiredJwtError:
        case PermissionError:
        case KeycloakTokenError:
            return unauthorized(treatedError);
        case InvalidAppVersionError:
        case InvalidParamError:
            return badRequest(treatedError);
        case TimeoutConnectError:
            return requestTimeout(treatedError);
        case InvalidRefreshTokenError:
        case InvalidHeaderError:
            return preconditionFailed(treatedError);
        case UnassignedError:
            return unassigned(treatedError, parseInt(extractNumbers(error.name)));
        case NotFoundError:
            return notFound(treatedError);
        case NotImplementedError:
            return notImplemented(treatedError);
        default:
            return serverError(treatedError);
    }
}
