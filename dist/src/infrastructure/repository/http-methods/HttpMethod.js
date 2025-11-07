"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethod = void 0;
const errors_1 = require("../../../../v1/domain/shared/errors");
const axios_1 = __importDefault(require("axios"));
const UnifaceHelper_1 = require("../../../../v1/application/helpers/UnifaceHelper");
const UnassignedError_1 = require("../../../../v1/domain/shared/errors/UnassignedError");
const axiosHelpers_1 = require("../../../../infrastructure/helpers/axiosHelpers");
const HttpMethodErrorHelpers_1 = require("../../../../infrastructure/helpers/HttpMethodErrorHelpers");
class HttpMethod {
    constructor(logger) {
        this.logger = logger;
    }
    async unifacePost(url, request, caller) {
        try {
            await this.logger.info({
                origem: `Request-${request.root.operationId}`,
                versao: 'v1',
                destino: request.root.operationId,
                classe: `HttpMethod.unifacePost.${caller}`,
                body: request.root.payload,
                payload: (0, UnifaceHelper_1.unifaceJsonToXmlHelper)(request),
            });
            return await axios_1.default.post(url, (0, UnifaceHelper_1.unifaceJsonToXmlHelper)(request), axiosHelpers_1.unifaceHeader);
        }
        catch (error) {
            throw await this.errorHandler(error, 'unifacePost');
        }
    }
    async post(url, data, config, caller) {
        try {
            const response = await axios_1.default.post(url, data, config);
            const bodyToLog = typeof data === 'object' && data !== null && 'body' in data ? data.body : data;
            await this.logger.info({
                origem: `Response-Post-${caller}`,
                versao: 'v1',
                destino: url,
                classe: `HttpMethod.post.${caller}`,
                body: bodyToLog,
                response: response.data,
                status: response.status,
            });
            return response;
        }
        catch (error) {
            throw await this.errorHandler(error, 'post');
        }
    }
    async get(url, config, caller) {
        try {
            const response = await axios_1.default.get(url, config);
            await this.logger.info({
                origem: `Response-Get-${caller}`,
                versao: 'v1',
                destino: url,
                classe: `HttpMethod.get.${caller}`,
                response: response.data,
                status: response.status,
            });
            return response.data;
        }
        catch (error) {
            throw await this.errorHandler(error, 'get');
        }
    }
    async delete(url, config, caller) {
        try {
            const response = await axios_1.default.delete(url, config);
            await this.logger.info({
                origem: `Response-Delete-${caller}`,
                versao: 'v1',
                destino: url,
                classe: `HttpMethod.delete.${caller}`,
                response: response.data,
                status: response.status,
            });
            return response.data;
        }
        catch (error) {
            throw await this.errorHandler(error, 'delete');
        }
    }
    async put(url, data, config, caller) {
        try {
            const response = await axios_1.default.put(url, data, config);
            const bodyToLog = typeof data === 'object' && data !== null && 'body' in data ? data.body : data;
            await this.logger.info({
                origem: `Response-Put-${caller}`,
                versao: 'v1',
                destino: url,
                classe: `HttpMethod.put.${caller}`,
                body: bodyToLog,
                response: response.data,
                status: response.status,
            });
            return response.data;
        }
        catch (error) {
            throw await this.errorHandler(error, 'put');
        }
    }
    async errorHandler(error, method) {
        var _a, _b, _c, _d, _e;
        const responseData = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
        const responseStatus = (_b = error.response) === null || _b === void 0 ? void 0 : _b.status;
        let status = (_d = (_c = error.status) !== null && _c !== void 0 ? _c : responseStatus) !== null && _d !== void 0 ? _d : 500;
        if (method === 'unifacePost') {
            const codigo = typeof responseData === 'object' && responseData !== null ? responseData['codigo'] : undefined;
            status = (_e = codigo !== null && codigo !== void 0 ? codigo : responseStatus) !== null && _e !== void 0 ? _e : 500;
        }
        switch (status) {
            case 452:
            case 453:
            case 454:
                return new UnassignedError_1.UnassignedError(JSON.stringify(responseData), String(status));
            case 401:
                return new errors_1.AuthenticationError(JSON.stringify(responseData), (0, HttpMethodErrorHelpers_1.getAuthErrorMessage)(responseData));
            case 400:
            case 422:
                if ((0, HttpMethodErrorHelpers_1.isExpiredTokenError)(responseData)) {
                    return new errors_1.AuthenticationError(JSON.stringify(responseData), 'Token informado é inválido !');
                }
                return new errors_1.InvalidParamError(JSON.stringify(responseData));
            case 404:
                return new errors_1.NotFoundError(JSON.stringify(error), error.message);
            case 501:
                return new errors_1.NotImplementedError(JSON.stringify(responseData));
            default:
                return new errors_1.ServerError(JSON.stringify(responseData));
        }
    }
}
exports.HttpMethod = HttpMethod;
