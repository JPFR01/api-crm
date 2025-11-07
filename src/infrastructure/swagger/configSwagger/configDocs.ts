import YAML from 'yamljs';
const path = require('path');

const healthCheck = YAML.load(path.resolve(__dirname, '../yaml/healthCheck.yaml'));
const login = YAML.load(path.resolve(__dirname, '../yaml/authentication/login.yaml'));
const refreshToken = YAML.load(path.resolve(__dirname, '../yaml/authentication/refreshToken.yaml'));
const retrievePersonalData = YAML.load(path.resolve(__dirname, '../yaml/cooperative-member/retrievePersonalData.yaml'));

export const publicPaths = {
    ...healthCheck,
    ...login,
    ...refreshToken,
};

export const privatePaths = {
    ...retrievePersonalData,
};

const securitySchemes = {
    bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    },
};

export const components = {
    securitySchemes,
};

function addSecurityToPaths(pathsObj: any) {
    const securedPaths: any = {};
    for (const [route, methods] of Object.entries(pathsObj)) {
        securedPaths[route] = {};
        for (const [method, spec] of Object.entries(methods as any)) {
            securedPaths[route][method] = {
                ...(typeof spec === 'object' && spec !== null ? spec : {}),
                security: [{bearerAuth: []}],
            };
        }
    }
    return securedPaths;
}

export const configDocs = {
    apis: ['./src/app/**/**.controller.ts'],
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'API Imagem NodeJS',
            version: '1.0.0',
            description: 'Especificação dos EndPoints de autenticação disponibilizados no middleware para comunicação com as APIs internas.',
        },
        servers: [
            {
                url: `http://localhost:${Number(process.env.PORT || 3000)}/v1`,
                description: 'Desenvolvimento',
            },
            {
                url: process.env.SWAGGER_URL_STG,
                description: 'Stage',
            },
            {
                url: process.env.SWAGGER_URL_PRD,
                description: 'Produção',
            },
        ],
        paths: {
            ...publicPaths,
            ...addSecurityToPaths(privatePaths),
        },
        components,
    },
};
