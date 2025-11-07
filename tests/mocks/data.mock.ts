import {Header} from '@/infrastructure/helpers/HeaderHelper';
import {PayLoadToken} from '@/v1/domain/repository/token/Token';

export const payloadTokenResponse: PayLoadToken = {
    foo: 'bar',
    iat: 1718000000,
    data: 'some-data',
    exp: 1718003600,
    sub: '1234567890',
    scope: 'openid profile email',
    email_verified: true,
    email: 'user@example.com',
    name: 'Bulba da Silva Sauro',
    preferred_username: 'bulbassauro',
    given_name: 'Bulba',
    family_name: 'Sauro',
};

export const header: Header = {
    'device-id': 'fake-device-id',
    'app-version': 'application/json',
    'device-os': 'android',
    'alternative-url': 'https://fake-alt-url.com',
    'x-correlation-id': 'corr-id-123',
    'production-redirect': 'https://fake-prod-redirect.com',
    token: 'Bearer tokenValido',
    refreshToken: 'Bearer refreshTokenValido',
    authorization: 'Bearer tokenValido',
};
