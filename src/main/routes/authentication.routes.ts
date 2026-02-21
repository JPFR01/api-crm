import {Router} from 'express';
import {adaptRoute} from '@/main/adapter/express/expressRouteAdapter';
import {LoginControllerFactory} from '../factories/controllers/authentication/login/LoginControllerFactory';
import {RefreshTokenControllerFactory} from '../factories/controllers/authentication/refresh-token/RefreshTokenControllerFactory';

export default (router: Router): void => {
    router.post('/v1/login', adaptRoute(LoginControllerFactory()));
    router.post('/v1/refreshToken', adaptRoute(RefreshTokenControllerFactory()));
};
