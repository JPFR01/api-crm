import {Express, json, Request} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

export default (app: Express): void => {
    app.use(cors());
    app.use(json({
        limit: '10mb',
        verify: (req: Request & { rawBody?: string }, _res, buf) => {
            if (req.originalUrl.startsWith('/v1/webhook/whatsapp-meta')) {
                req.rawBody = buf.toString('utf8');
            }
        }
    }));
    app.use(bodyParser.urlencoded({extended: true}));
};
