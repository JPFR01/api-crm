/* eslint-disable no-console */
import * as fs from 'fs';
import {Express, Router} from 'express';
import path from 'path';
import listEndpoints from 'express-list-endpoints';

export default async (app: Express): Promise<void> => {
    const router: Router = Router();
    app.use(router);

    fs.readdirSync(path.join(__dirname, '../routes')).forEach(async (file) => {
        (await import(`../routes/${file}`)).default(router);
    });

    setTimeout(() => {
        console.log('Registered routes:', listEndpoints(app));
    }, 1000);
};
