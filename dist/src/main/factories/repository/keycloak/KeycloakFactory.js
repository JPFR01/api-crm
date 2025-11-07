"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakFactory = void 0;
const Keycloak_1 = require("../../../../../infrastructure/repository/keycloak/Keycloak");
const HttpMethodFactory_1 = require("../http-methods/HttpMethodFactory");
const KeycloakFactory = () => {
    return new Keycloak_1.Keycloak((0, HttpMethodFactory_1.HttpMethodFactory)());
};
exports.KeycloakFactory = KeycloakFactory;
