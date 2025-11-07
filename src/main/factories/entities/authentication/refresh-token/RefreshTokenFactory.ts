import {KeycloakFactory} from '@/main/factories/repository/keycloak/KeycloakFactory';
import {RefreshToken} from '@/v1/application/entities/authentication/refresh-token/RefreshToken';
import {RefreshToken as _RefreshToken} from '@/v1/domain/entities/authentication/refresh-token/RefreshToken';
import {PermissionFactory} from '../../permission/PermissionFactory';

export const RefreshTokenFactory = (): _RefreshToken => {
    return new RefreshToken(PermissionFactory(), KeycloakFactory());
};
