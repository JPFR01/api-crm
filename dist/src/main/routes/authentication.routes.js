"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressRouteAdapter_1 = require("../../../main/adapter/express/expressRouteAdapter");
const LoginControllerFactory_1 = require("../factories/controllers/authentication/login/LoginControllerFactory");
const RefreshTokenControllerFactory_1 = require("../factories/controllers/authentication/refresh-token/RefreshTokenControllerFactory");
exports.default = (router) => {
    router.post('/v1/login', (0, expressRouteAdapter_1.adaptRoute)((0, LoginControllerFactory_1.LoginControllerFactory)()));
    router.post('/v1/refreshToken', (0, expressRouteAdapter_1.adaptRoute)((0, RefreshTokenControllerFactory_1.RefreshTokenControllerFactory)()));
};
