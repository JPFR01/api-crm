import {Router, Request, Response} from 'express';
import {adaptRoute} from '@/main/adapter/express/expressRouteAdapter';
import {LoginControllerFactory} from '../factories/controllers/authentication/login/LoginControllerFactory';
import {RefreshTokenControllerFactory} from '../factories/controllers/authentication/refresh-token/RefreshTokenControllerFactory';

export default (router: Router): void => {
    router.post('/v1/login', adaptRoute(LoginControllerFactory()));
    router.post('/v1/refreshToken', adaptRoute(RefreshTokenControllerFactory()));

    router.post('/v1/webhook/meta/verify', (req: Request, res: Response) => {
        const hubVerifyToken = req.body['hub.verify_token'];
        const hubVerifyTokenMeta = process.env.HUB_VERIFY_TOKEN_META;

        if (hubVerifyToken === hubVerifyTokenMeta) {
            return res.status(204).send();
        }

        return res.status(400).json({ error: 'Parâmetros inválidos' });
    });
};
