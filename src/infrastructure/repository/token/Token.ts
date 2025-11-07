import {Token as _Token, tokenStatus, PayLoadToken} from '@/v1/domain/repository/token/Token';
import {Keycloak} from '@/v1/domain/repository/keycloak/Keycloak';
import {InvalidParamError} from '@/v1/domain/shared/errors';

export class Token implements _Token {
    constructor(private readonly keycloak: Keycloak) {}

    async authentication(token: string): Promise<tokenStatus> {
        if (!token) {
            throw new InvalidParamError('Method: Token.authentication - Param token', 'O parâmetro de token deve ser informado !');
        }

        return await this.keycloak.validateToken(token);
    }

    async open(token: string): Promise<PayLoadToken> {
        if (!token) {
            throw new InvalidParamError('Method: Token.open - Param token', 'O parâmetro de token deve ser informado !');
        }

        return await this.keycloak.openToken(token);
    }
}
