import {Token} from '@/infrastructure/repository/token/Token';
import {Token as _Token} from '@/v1/domain/repository/token/Token';
import {KeycloakFactory} from '../keycloak/KeycloakFactory';

export const TokenFactory = (): _Token => {
    return new Token(KeycloakFactory());
};
