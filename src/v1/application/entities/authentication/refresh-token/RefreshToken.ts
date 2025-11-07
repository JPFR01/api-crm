import {LoginResponse} from '@/v1/domain/entities/authentication/login/Login';
import {RefreshToken as _RefreshToken, RefreshTokenData} from '@/v1/domain/entities/authentication/refresh-token/RefreshToken';
import {Keycloak, KeycloakAuthResponse} from '@/v1/domain/repository/keycloak/Keycloak';
import {Permission} from '@/v1/domain/repository/permission/Permission';
import {InvalidParamError} from '@/v1/domain/shared/errors';

export class RefreshToken implements _RefreshToken {
    constructor(
        // @ts-expect-error: propriedade será usada futuramente
        private readonly permission: Permission,
        private readonly keycloak: Keycloak,
    ) {}

    async validate(data: RefreshTokenData): Promise<void> {
        if (!data.refreshToken)
            throw new InvalidParamError('Method: RefreshToken.validate - Param refreshToken', 'O RefreshToken deve ser informado !');
    }

    async refresh(data: RefreshTokenData): Promise<LoginResponse> {
        const auth: KeycloakAuthResponse = await this.keycloak.refreshToken({
            refreshToken: data.refreshToken,
        });

        /* 
        ESTE TRECHO FICARÁ COMENTADO ATÉ A IMPLEMENTAÇÃO DAS PERMISSÕES NA API DO PORTAL APP
        await this.permission.validate({
            usernameOrEmail: data.body.usernameOrEmail,
            });
        */

        return {
            accessToken: auth.access_token,
            refreshToken: auth.refresh_token,
            expiresIn: auth.expires_in,
            refreshExpiresIn: auth.refresh_expires_in,
            tokenType: auth.token_type,
            givenName: auth.given_name,
            familyName: auth.family_name,
        };
    }
}
