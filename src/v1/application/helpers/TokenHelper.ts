import {Header} from '@/infrastructure/helpers/HeaderHelper';
import {OptionsToken, PayLoadToken, algorithmToken} from '@/v1/domain/repository/token/Token';
import {ExpiredJwtError, ServerError, JsonWebTokenError, NotBeforeError, AuthenticationError} from '@/v1/domain/shared/errors';
import {patternMessage} from '@/v1/domain/shared/errors/Error';

export function payLoaderHelper(payloadConfig: PayLoadToken): string {
    return JSON.stringify(payloadConfig);
}

export function optionsHelper(algorithm?: algorithmToken): OptionsToken {
    return {
        algorithm: algorithm,
    };
}

export function tokenErrorHelper(error: Error): void {
    switch (error.name) {
        case 'TokenExpiredError':
            throw new ExpiredJwtError(`${error.message} - ${error}`, 'Token de acesso expirado, favor realizar o login novamente!');
        case 'JsonWebTokenError':
            throw new JsonWebTokenError(`${error.message} - ${error}`, 'Problemas ao validar o token de acesso, favor realizar o login novamente!');
        case 'NotBeforeError':
            throw new NotBeforeError(`${error.message} - ${error}`, patternMessage);
        default:
            throw new ServerError(`${error.message} - ${error}`, patternMessage);
    }
}

export function tokenValidationHelper(header: Header, controller: string): void {
    if (!header.authorization || !header.authorization.trim().toLowerCase().startsWith('bearer '))
        throw new AuthenticationError(
            `Controller: ${controller} - Error: Authentication Bearer token não informado`,
            'Authentication Bearer token não informado',
        );
}
