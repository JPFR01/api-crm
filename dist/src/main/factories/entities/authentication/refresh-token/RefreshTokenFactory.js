"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenFactory = void 0;
const KeycloakFactory_1 = require("../../../../../../main/factories/repository/keycloak/KeycloakFactory");
const RefreshToken_1 = require("../../../../../../v1/application/entities/authentication/refresh-token/RefreshToken");
const PermissionFactory_1 = require("../../permission/PermissionFactory");
const RefreshTokenFactory = () => {
    return new RefreshToken_1.RefreshToken((0, PermissionFactory_1.PermissionFactory)(), (0, KeycloakFactory_1.KeycloakFactory)());
};
exports.RefreshTokenFactory = RefreshTokenFactory;
