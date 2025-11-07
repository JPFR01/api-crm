import {Router} from 'express';
import {adaptRoute} from '@/main/adapter/express/expressRouteAdapter';
import {HealthCheckControllerFactory} from '@/main/factories/controllers/health-check/HealthCheckControllerFactory';
import {ApplicationDocsSwaggerFactory} from '@/main/factories/controllers/swagger/docs/ApplicationDocsSwaggerFactory';
/* import {ConfigSwagger} from '@/infrastructure/swagger/configSwagger/ConfigSwagger'; */

export default (router: Router): void => {
    router.get('/v1/health-check', adaptRoute(HealthCheckControllerFactory()));

    if (process.env.NODE_ENV !== 'production') {
        /* router.use('/v1/api-docs', ConfigSwagger.serve, ConfigSwagger.setup); */
        router.get('/v1/swagger.json', adaptRoute(ApplicationDocsSwaggerFactory()));
    }
};
