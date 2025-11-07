import {Login as _Login, LoginData, LoginResponse} from '@/v1/domain/entities/authentication/login/Login';
import {Permission} from '@/v1/domain/repository/permission/Permission';
import {Keycloak, KeycloakAuthResponse} from '@/v1/domain/repository/keycloak/Keycloak';
import {InvalidParamError} from '@/v1/domain/shared/errors';

export class Login implements _Login {
    constructor(
        // @ts-expect-error: propriedade será usada futuramente
        private readonly permission: Permission,
        private readonly keycloak: Keycloak,
    ) {}

    async validate(data: LoginData): Promise<void> {
        if (!data.body.usernameOrEmail)
            throw new InvalidParamError('Method: Login.validate - Param usernameOrEmail', 'O nome de usuário ou email deve ser informado !');

        if (!data.body.password) throw new InvalidParamError('Method: Login.validate - Param password', 'A senha deve ser informada !');
    }

    async login(data: LoginData): Promise<LoginResponse> {
        const auth: KeycloakAuthResponse = await this.keycloak.authorize({
            username: data.body.usernameOrEmail,
            password: data.body.password,
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
