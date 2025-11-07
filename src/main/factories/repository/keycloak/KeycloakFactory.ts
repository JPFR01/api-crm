import {Keycloak} from '@/infrastructure/repository/keycloak/Keycloak';
import {Keycloak as _Keycloak} from '@/v1/domain/repository/keycloak/Keycloak';
import {HttpMethodFactory} from '../http-methods/HttpMethodFactory';

export const KeycloakFactory = (): _Keycloak => {
    return new Keycloak(HttpMethodFactory());
};
