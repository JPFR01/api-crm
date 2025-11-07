"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const errors_1 = require("../../../../../../v1/domain/shared/errors");
class Login {
    constructor(
    // @ts-expect-error: propriedade será usada futuramente
    permission, keycloak) {
        this.permission = permission;
        this.keycloak = keycloak;
    }
    async validate(data) {
        if (!data.body.usernameOrEmail)
            throw new errors_1.InvalidParamError('Method: Login.validate - Param usernameOrEmail', 'O nome de usuário ou email deve ser informado !');
        if (!data.body.password)
            throw new errors_1.InvalidParamError('Method: Login.validate - Param password', 'A senha deve ser informada !');
    }
    async login(data) {
        const auth = await this.keycloak.authorize({
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
exports.Login = Login;
