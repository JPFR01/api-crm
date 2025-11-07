"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const HttpMethod_1 = require("./HttpMethod");
const axios_1 = __importStar(require("axios"));
const axiosHelpers_1 = require("../../../../infrastructure/helpers/axiosHelpers");
const errors_1 = require("../../../../v1/domain/shared/errors");
const HttpMethodErrorHelpers = __importStar(require("../../../../infrastructure/helpers/HttpMethodErrorHelpers"));
const UnassignedError_1 = require("../../../../v1/domain/shared/errors/UnassignedError");
(0, globals_1.describe)('token Token', () => {
    const requestAxios = {
        params: {
            value: 'fake-value',
        },
    };
    const requestAxiosWithBody = {
        value: {
            key: 'fake-value',
        },
        body: {
            key: 'fake-value',
        },
    };
    const responseAxios = {
        data: {
            value: 'fake-value',
        },
        status: 200,
    };
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.afterAll)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('authentication()', () => {
        let httpMethod;
        const requestUnifaceBase = {
            root: {
                sistema: 'fakeSistema',
                operationId: 'fakeOperationId',
                versao: '1.0.0',
                'device-os': 'Android',
                'device-id': 'fakeDeviceId',
                'X-Correlation-ID': 'corr-id-123',
                'alternative-url': 'https://fake-alt-url.com',
                'production-redirect': 'https://fake-prod-redirect.com',
                payload: { key: 'value' },
                username: 'fakeUser',
            },
        };
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const logger = {
                info: globals_1.jest.fn(),
            };
            httpMethod = new HttpMethod_1.HttpMethod(logger);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve executar unifacePost sem sucesso', () => {
            globals_1.jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            globals_1.jest.spyOn(axios_1.default, 'post').mockRejectedValueOnce(new Error('Erro ao executar unifacePost'));
            globals_1.jest.spyOn(httpMethod, 'errorHandler').mockRejectedValueOnce(new Error('Erro ao executar unifacePost'));
            const result = httpMethod.unifacePost('urlInvalida', requestUnifaceBase, 'fakeCaller');
            (0, globals_1.expect)(result).rejects.toThrow(Error);
        });
        (0, globals_1.it)('deve executar unifacePost com sucesso e retornar a resposta esperada', () => {
            globals_1.jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            globals_1.jest.spyOn(axios_1.default, 'post').mockResolvedValueOnce({});
            const result = httpMethod.unifacePost('urlValida', requestUnifaceBase, 'fakeCaller');
            (0, globals_1.expect)(result).toEqual(globals_1.expect.any((Promise)));
            (0, globals_1.expect)(httpMethod['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                origem: globals_1.expect.any(String),
                versao: globals_1.expect.any(String),
                destino: requestUnifaceBase.root.operationId,
                classe: globals_1.expect.any(String),
                body: requestUnifaceBase.root.payload,
                payload: globals_1.expect.any(String),
            }));
        });
    });
    (0, globals_1.describe)('post()', () => {
        let httpMethod;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const logger = {
                info: globals_1.jest.fn(),
            };
            httpMethod = new HttpMethod_1.HttpMethod(logger);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve executar post sem sucesso', () => {
            const error = new errors_1.ServerError('', 'Erro ao executar post');
            globals_1.jest.spyOn(axios_1.default, 'post').mockRejectedValueOnce(error);
            globals_1.jest.spyOn(httpMethod, 'errorHandler').mockRejectedValueOnce(error);
            const result = httpMethod.post('urlInvalida', requestAxios, axiosHelpers_1.keycloakHeader, 'fake-caller');
            (0, globals_1.expect)(result).rejects.toThrow(error);
        });
        (0, globals_1.it)('deve executar post com sucesso, tratada e retornar a resposta esperada 01', async () => {
            const requestIncompleta = 'fake-value';
            globals_1.jest.spyOn(axios_1.default, 'post').mockResolvedValueOnce(responseAxios);
            globals_1.jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            const result = await httpMethod.post('urlValida', requestIncompleta, axiosHelpers_1.keycloakHeader, 'fake-caller');
            (0, globals_1.expect)(result).toEqual(responseAxios);
        });
        (0, globals_1.it)('deve executar post com sucesso, tratada e retornar a resposta esperada 02', async () => {
            const requestIncompleta = '';
            globals_1.jest.spyOn(axios_1.default, 'post').mockResolvedValueOnce(responseAxios);
            globals_1.jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            const result = await httpMethod.post('urlValida', requestIncompleta, axiosHelpers_1.keycloakHeader, 'fake-caller');
            (0, globals_1.expect)(result).toEqual(responseAxios);
        });
        (0, globals_1.it)('deve executar post com sucesso, tratada e retornar a resposta esperada 03', async () => {
            globals_1.jest.spyOn(axios_1.default, 'post').mockResolvedValueOnce(responseAxios);
            globals_1.jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            const result = await httpMethod.post('urlValida', requestAxiosWithBody, axiosHelpers_1.keycloakHeader, 'fake-caller');
            (0, globals_1.expect)(result).toEqual(responseAxios);
        });
        (0, globals_1.it)('deve executar post com sucesso e retornar a resposta esperada', async () => {
            globals_1.jest.spyOn(axios_1.default, 'post').mockResolvedValueOnce(responseAxios);
            globals_1.jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            const result = await httpMethod.post('urlValida', requestAxios, axiosHelpers_1.keycloakHeader, 'fake-caller');
            (0, globals_1.expect)(result).toEqual(responseAxios);
            (0, globals_1.expect)(httpMethod['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                origem: globals_1.expect.any(String),
                versao: globals_1.expect.any(String),
                destino: globals_1.expect.any(String),
                classe: globals_1.expect.any(String),
                body: globals_1.expect.anything(),
                response: responseAxios.data,
                status: responseAxios.status,
            }));
        });
    });
    (0, globals_1.describe)('get()', () => {
        let httpMethod;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const logger = {
                info: globals_1.jest.fn(),
            };
            httpMethod = new HttpMethod_1.HttpMethod(logger);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve executar get sem sucesso', () => {
            const error = new errors_1.ServerError('', 'Erro ao executar get');
            globals_1.jest.spyOn(axios_1.default, 'get').mockRejectedValueOnce(error);
            globals_1.jest.spyOn(httpMethod, 'errorHandler').mockRejectedValueOnce(error);
            const result = httpMethod.get('urlInvalida', requestAxios, 'fake-caller');
            (0, globals_1.expect)(result).rejects.toThrow(error);
        });
        (0, globals_1.it)('deve executar get com sucesso e retornar a resposta esperada', async () => {
            globals_1.jest.spyOn(axios_1.default, 'get').mockResolvedValueOnce(responseAxios);
            globals_1.jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            const result = await httpMethod.get('urlValida', requestAxios, 'fake-caller');
            (0, globals_1.expect)(result).toEqual(responseAxios.data);
            (0, globals_1.expect)(httpMethod['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                origem: globals_1.expect.any(String),
                versao: globals_1.expect.any(String),
                destino: globals_1.expect.any(String),
                classe: globals_1.expect.any(String),
                response: responseAxios.data,
                status: responseAxios.status,
            }));
        });
    });
    (0, globals_1.describe)('delete()', () => {
        let httpMethod;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const logger = {
                info: globals_1.jest.fn(),
            };
            httpMethod = new HttpMethod_1.HttpMethod(logger);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve executar delete sem sucesso', () => {
            const error = new errors_1.ServerError('', 'Erro ao executar delete');
            globals_1.jest.spyOn(axios_1.default, 'delete').mockRejectedValueOnce(error);
            globals_1.jest.spyOn(httpMethod, 'errorHandler').mockRejectedValueOnce(error);
            const result = httpMethod.delete('urlInvalida', requestAxios, 'fake-caller');
            (0, globals_1.expect)(result).rejects.toThrow(error);
        });
        (0, globals_1.it)('deve executar delete com sucesso e retornar a resposta esperada', async () => {
            globals_1.jest.spyOn(axios_1.default, 'delete').mockResolvedValueOnce(responseAxios);
            globals_1.jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            const result = await httpMethod.delete('urlValida', requestAxios, 'fake-caller');
            (0, globals_1.expect)(result).toEqual(responseAxios.data);
            (0, globals_1.expect)(httpMethod['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                origem: globals_1.expect.any(String),
                versao: globals_1.expect.any(String),
                destino: globals_1.expect.any(String),
                classe: globals_1.expect.any(String),
                response: responseAxios.data,
                status: responseAxios.status,
            }));
        });
    });
    (0, globals_1.describe)('put()', () => {
        let httpMethod;
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const logger = {
                info: globals_1.jest.fn(),
            };
            httpMethod = new HttpMethod_1.HttpMethod(logger);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve executar put sem sucesso', () => {
            const error = new errors_1.ServerError('', 'Erro ao executar put');
            globals_1.jest.spyOn(axios_1.default, 'put').mockRejectedValueOnce(error);
            globals_1.jest.spyOn(httpMethod, 'errorHandler').mockRejectedValueOnce(error);
            const result = httpMethod.put('urlInvalida', requestAxiosWithBody, axiosHelpers_1.keycloakHeader, 'fake-caller');
            (0, globals_1.expect)(result).rejects.toThrow(error);
        });
        (0, globals_1.it)('deve executar put com sucesso, tratada e retornar a resposta esperada 01', async () => {
            const requestIncompleta = 'fake-value';
            globals_1.jest.spyOn(axios_1.default, 'put').mockResolvedValueOnce(responseAxios);
            globals_1.jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            const result = await httpMethod.put('urlValida', requestIncompleta, axiosHelpers_1.keycloakHeader, 'fake-caller');
            (0, globals_1.expect)(result).toEqual(responseAxios.data);
        });
        (0, globals_1.it)('deve executar put com sucesso, tratada e retornar a resposta esperada 02', async () => {
            const requestIncompleta = '';
            globals_1.jest.spyOn(axios_1.default, 'put').mockResolvedValueOnce(responseAxios);
            globals_1.jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            const result = await httpMethod.put('urlValida', requestIncompleta, axiosHelpers_1.keycloakHeader, 'fake-caller');
            (0, globals_1.expect)(result).toEqual(responseAxios.data);
        });
        (0, globals_1.it)('deve executar put com sucesso, tratada e retornar a resposta esperada 03', async () => {
            globals_1.jest.spyOn(axios_1.default, 'put').mockResolvedValueOnce(responseAxios);
            globals_1.jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            const result = await httpMethod.put('urlValida', requestAxiosWithBody, axiosHelpers_1.keycloakHeader, 'fake-caller');
            (0, globals_1.expect)(result).toEqual(responseAxios.data);
            (0, globals_1.expect)(httpMethod['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                origem: globals_1.expect.any(String),
                versao: globals_1.expect.any(String),
                destino: globals_1.expect.any(String),
                classe: globals_1.expect.any(String),
                body: requestAxiosWithBody.body,
                response: responseAxios.data,
                status: responseAxios.status,
            }));
        });
        (0, globals_1.it)('deve executar put com sucesso e retornar a resposta esperada', async () => {
            globals_1.jest.spyOn(axios_1.default, 'put').mockResolvedValueOnce(responseAxios);
            globals_1.jest.spyOn(httpMethod['logger'], 'info').mockResolvedValueOnce(null);
            const result = await httpMethod.put('urlValida', requestAxios, axiosHelpers_1.keycloakHeader, 'fake-caller');
            (0, globals_1.expect)(result).toEqual(responseAxios.data);
            (0, globals_1.expect)(httpMethod['logger'].info).toHaveBeenCalledWith(globals_1.expect.objectContaining({
                origem: globals_1.expect.any(String),
                versao: globals_1.expect.any(String),
                destino: globals_1.expect.any(String),
                classe: globals_1.expect.any(String),
                body: requestAxios,
                response: responseAxios.data,
                status: responseAxios.status,
            }));
        });
    });
    (0, globals_1.describe)('errorHandler()', () => {
        let httpMethod;
        const responseData = 'fake-error';
        (0, globals_1.beforeEach)(() => {
            globals_1.jest.clearAllMocks();
            const logger = {
                info: globals_1.jest.fn(),
            };
            httpMethod = new HttpMethod_1.HttpMethod(logger);
        });
        (0, globals_1.afterAll)(() => {
            globals_1.jest.clearAllMocks();
        });
        (0, globals_1.it)('deve tratar erro do unifacePost - Com código e com status', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: { value: 'fake-value', codigo: 500 }, status: 500 };
            const result = await httpMethod.errorHandler(error, 'unifacePost');
            (0, globals_1.expect)(result).toEqual(new errors_1.ServerError(JSON.stringify(responseData)));
        });
        (0, globals_1.it)('deve tratar erro do unifacePost - Sem código e com status', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: {}, status: 500 };
            const result = await httpMethod.errorHandler(error, 'unifacePost');
            (0, globals_1.expect)(result).toEqual(new errors_1.ServerError(JSON.stringify(responseData)));
        });
        (0, globals_1.it)('deve tratar erro do unifacePost - Sem código e sem status', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: { value: 'fake-value' } };
            const result = await httpMethod.errorHandler(error, 'unifacePost');
            (0, globals_1.expect)(result).toEqual(new errors_1.ServerError(JSON.stringify(responseData)));
        });
        (0, globals_1.it)('deve tratar erro do unifacePost com sucesso', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: { value: 'fake-value', codigo: 500 } };
            const result = await httpMethod.errorHandler(error, 'unifacePost');
            (0, globals_1.expect)(result).toEqual(new errors_1.ServerError(JSON.stringify(responseData)));
        });
        (0, globals_1.it)('deve tratar erro genérico - Com status', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: 'fake-value', status: 500 };
            const result = await httpMethod.errorHandler(error, 'http-method');
            (0, globals_1.expect)(result).toEqual(new UnassignedError_1.UnassignedError(JSON.stringify(responseData), '500'));
        });
        (0, globals_1.it)('deve tratar erro genérico - Com responseStatus', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: { value: 'fake-value', codigo: 500 } };
            const result = await httpMethod.errorHandler(error, 'http-method');
            (0, globals_1.expect)(result).toEqual(new UnassignedError_1.UnassignedError(JSON.stringify(responseData), '500'));
        });
        (0, globals_1.it)('deve tratar erro genérico - Sem status', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: 'fake-value' };
            const result = await httpMethod.errorHandler(error, 'http-method');
            (0, globals_1.expect)(result).toEqual(new UnassignedError_1.UnassignedError(JSON.stringify(responseData), '500'));
        });
        (0, globals_1.it)('deve tratar erro 452', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: 'fake-value', status: 452 };
            const result = await httpMethod.errorHandler(error, 'http-method');
            (0, globals_1.expect)(result).toEqual(new UnassignedError_1.UnassignedError(JSON.stringify(responseData), '452'));
        });
        (0, globals_1.it)('deve tratar erro 453', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: 'fake-value', status: 453 };
            const result = await httpMethod.errorHandler(error, 'http-method');
            (0, globals_1.expect)(result).toEqual(new UnassignedError_1.UnassignedError(JSON.stringify(responseData), '453'));
        });
        (0, globals_1.it)('deve tratar erro 454', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: 'fake-value', status: 454 };
            const result = await httpMethod.errorHandler(error, 'http-method');
            (0, globals_1.expect)(result).toEqual(new UnassignedError_1.UnassignedError(JSON.stringify(responseData), '454'));
        });
        (0, globals_1.it)('deve tratar erro 401', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: 'fake-value', status: 401 };
            globals_1.jest.spyOn(HttpMethodErrorHelpers, 'getAuthErrorMessage').mockReturnValueOnce('Usuário ou senha inválido!');
            const result = await httpMethod.errorHandler(error, 'http-method');
            (0, globals_1.expect)(result).toEqual(new errors_1.AuthenticationError(JSON.stringify(responseData), 'Usuário ou senha inválido!'));
        });
        (0, globals_1.it)('deve tratar erro 400 sem token expirado', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: 'fake-value', status: 400 };
            globals_1.jest.spyOn(HttpMethodErrorHelpers, 'isExpiredTokenError').mockReturnValue(false);
            const result = await httpMethod.errorHandler(error, 'http-method');
            (0, globals_1.expect)(result).toEqual(new errors_1.InvalidParamError(JSON.stringify(responseData)));
        });
        (0, globals_1.it)('deve tratar erro 422 com token expirado', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: 'fake-value', status: 422 };
            globals_1.jest.spyOn(HttpMethodErrorHelpers, 'isExpiredTokenError').mockReturnValue(true);
            const result = await httpMethod.errorHandler(error, 'http-method');
            (0, globals_1.expect)(result).toEqual(new errors_1.AuthenticationError(JSON.stringify(responseData), 'Token informado é inválido !'));
        });
        (0, globals_1.it)('deve tratar erro 404', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: 'fake-value', status: 404 };
            error.message = 'fake-message';
            const result = await httpMethod.errorHandler(error, 'http-method');
            (0, globals_1.expect)(result).toEqual(new errors_1.NotFoundError(JSON.stringify(error), error.message));
        });
        (0, globals_1.it)('deve tratar erro 501', async () => {
            const error = new axios_1.AxiosError(responseData);
            error.response = { data: 'fake-value', status: 501 };
            const result = await httpMethod.errorHandler(error, 'http-method');
            (0, globals_1.expect)(result).toEqual(new errors_1.NotImplementedError(responseData));
        });
        (0, globals_1.it)('deve tratar erro genérico (1000)', async () => {
            const responseData = 'Erro ao executar delete';
            const error = new axios_1.AxiosError(responseData);
            error.response = { status: 1000 };
            const result = await httpMethod.errorHandler(error, 'http-method');
            (0, globals_1.expect)(result).toEqual(new errors_1.ServerError(responseData));
        });
    });
});
