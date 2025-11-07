"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginControllerFactory = void 0;
const LoggerFactory_1 = require("../../../../../../main/factories/repository/logger/LoggerFactory");
const LoginFactory_1 = require("../../../../../../main/factories/entities/authentication/login/LoginFactory");
const LoginController_1 = require("../../../../../../v1/presentation/controllers/authentication/login/LoginController");
const LoginControllerFactory = () => {
    return new LoginController_1.LoginController((0, LoginFactory_1.LoginFactory)(), (0, LoggerFactory_1.LoggerFactory)());
};
exports.LoginControllerFactory = LoginControllerFactory;
