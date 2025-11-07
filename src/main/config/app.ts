import express from 'express';
import setupRoutes from '@/main/config/routes';
import setupMiddlewares from '@/main/config/middlewares';

const app = express();

setupMiddlewares(app);

const setup = async (): Promise<void> => {
    await setupRoutes(app);
};
setup();

export default app;
