import {KeycloakFactory} from '@/main/factories/repository/keycloak/KeycloakFactory';
import {Login} from '@/v1/application/entities/authentication/login/Login';
import {Login as _Login} from '@/v1/domain/entities/authentication/login/Login';
import {PermissionFactory} from '../../permission/PermissionFactory';

export const LoginFactory = (): _Login => {
    return new Login(PermissionFactory(), KeycloakFactory());
};
