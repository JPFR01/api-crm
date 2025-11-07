"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const errors_1 = require("../../../../../../v1/domain/shared/errors");
class RefreshToken {
    constructor(
    // @ts-expect-error: propriedade será usada futuramente
    permission, keycloak) {
        this.permission = permission;
        this.keycloak = keycloak;
    }
    async validate(data) {
        if (!data.refreshToken)
            throw new errors_1.InvalidParamError('Method: RefreshToken.validate - Param refreshToken', 'O RefreshToken deve ser informado !');
    }
    async refresh(data) {
        const auth = await this.keycloak.refreshToken({
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
exports.RefreshToken = RefreshToken;
