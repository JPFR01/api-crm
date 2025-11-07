"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenFactory = void 0;
const Token_1 = require("../../../../../infrastructure/repository/token/Token");
const KeycloakFactory_1 = require("../keycloak/KeycloakFactory");
const TokenFactory = () => {
    return new Token_1.Token((0, KeycloakFactory_1.KeycloakFactory)());
};
exports.TokenFactory = TokenFactory;
