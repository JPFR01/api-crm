"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const errors_1 = require("../../../../v1/domain/shared/errors");
class Token {
    constructor(keycloak) {
        this.keycloak = keycloak;
    }
    async authentication(token) {
        if (!token) {
            throw new errors_1.InvalidParamError('Method: Token.authentication - Param token', 'O parâmetro de token deve ser informado !');
        }
        return await this.keycloak.validateToken(token);
    }
    async open(token) {
        if (!token) {
            throw new errors_1.InvalidParamError('Method: Token.open - Param token', 'O parâmetro de token deve ser informado !');
        }
        return await this.keycloak.openToken(token);
    }
}
exports.Token = Token;
