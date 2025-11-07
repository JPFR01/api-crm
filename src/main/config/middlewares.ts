import {Express, json} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

export default (app: Express): void => {
    app.use(cors());
    app.use(json({limit: '10mb'}));
    app.use(bodyParser.urlencoded({extended: true}));
};
