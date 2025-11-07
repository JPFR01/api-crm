import swaggerJSDoc from 'swagger-jsdoc';
import {configDocs} from '@/infrastructure/swagger/configSwagger/configDocs';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJSDoc.OAS3Options = configDocs;
const configPreview: object = swaggerJSDoc(options);
const ConfigSwagger = {
    configPreview: configPreview,
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(configPreview),
};

export {ConfigSwagger};
