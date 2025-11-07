"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenControllerFactory = void 0;
const RefreshTokenFactory_1 = require("../../../../../../main/factories/entities/authentication/refresh-token/RefreshTokenFactory");
const LoggerFactory_1 = require("../../../../../../main/factories/repository/logger/LoggerFactory");
const RefreshTokenController_1 = require("../../../../../../v1/presentation/controllers/authentication/refresh-token/RefreshTokenController");
const RefreshTokenControllerFactory = () => {
    return new RefreshTokenController_1.RefreshTokenController((0, RefreshTokenFactory_1.RefreshTokenFactory)(), (0, LoggerFactory_1.LoggerFactory)());
};
exports.RefreshTokenControllerFactory = RefreshTokenControllerFactory;
