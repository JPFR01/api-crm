"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginFactory = void 0;
const KeycloakFactory_1 = require("../../../../../../main/factories/repository/keycloak/KeycloakFactory");
const Login_1 = require("../../../../../../v1/application/entities/authentication/login/Login");
const PermissionFactory_1 = require("../../permission/PermissionFactory");
const LoginFactory = () => {
    return new Login_1.Login((0, PermissionFactory_1.PermissionFactory)(), (0, KeycloakFactory_1.KeycloakFactory)());
};
exports.LoginFactory = LoginFactory;
