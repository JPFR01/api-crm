"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressRouteAdapter_1 = require("../../../main/adapter/express/expressRouteAdapter");
const HealthCheckControllerFactory_1 = require("../../../main/factories/controllers/health-check/HealthCheckControllerFactory");
const ApplicationDocsSwaggerFactory_1 = require("../../../main/factories/controllers/swagger/docs/ApplicationDocsSwaggerFactory");
/* import {ConfigSwagger} from '../../../infrastructure/swagger/configSwagger/ConfigSwagger'; */
exports.default = (router) => {
    router.get('/v1/health-check', (0, expressRouteAdapter_1.adaptRoute)((0, HealthCheckControllerFactory_1.HealthCheckControllerFactory)()));
    if (process.env.NODE_ENV !== 'production') {
        /* router.use('/v1/api-docs', ConfigSwagger.serve, ConfigSwagger.setup); */
        router.get('/v1/swagger.json', (0, expressRouteAdapter_1.adaptRoute)((0, ApplicationDocsSwaggerFactory_1.ApplicationDocsSwaggerFactory)()));
    }
};
